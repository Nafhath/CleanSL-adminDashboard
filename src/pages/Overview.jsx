import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { Truck, AlertTriangle, Map, FileText, Search, CheckCircle2 } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const EMPTY_STATS = {
  totalPickups: 0,
  missedPickups: 0,
  activeTrucks: 0,
  newComplaints: 0,
  efficiency: '0%'
};

const StatCard = ({ title, value, icon, subtitle, onClick }) => (
  <div className="bg-theme-card rounded-[32px] p-6 shadow-sm flex flex-col justify-between border border-white/40 cursor-pointer hover:border-theme-accent transition-colors group" onClick={onClick}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2 text-theme-text font-bold text-sm">
        {icon} <span>{title}</span>
      </div>
      <div className="text-theme-muted font-bold tracking-widest leading-none opacity-50 group-hover:opacity-100 transition-opacity">...</div>
    </div>
    <div>
      <h3 className="text-4xl font-bold text-theme-accent mb-2">{value}</h3>
      <div className="flex items-center gap-1 text-xs font-semibold text-theme-text opacity-80">
        <CheckCircle2 size={14} className="text-theme-accent" />
        <span className="text-theme-accent">{subtitle}</span>
      </div>
    </div>
  </div>
);

const FeedRow = ({ num, event, detail, time, status, color }) => {
  let badgeColor = 'bg-slate-200 text-slate-700';
  if (color?.includes('green') || status === 'Verified') badgeColor = 'bg-theme-accent text-white';
  if (color?.includes('red') || status === 'Violation') badgeColor = 'bg-red-400 text-white';
  if (color?.includes('blue') || status === 'Moving') badgeColor = 'bg-blue-400 text-white';
  if (color?.includes('yellow') || status === 'Pending') badgeColor = 'bg-amber-100 text-amber-600';

  return (
    <tr className="border-b border-white/20 hover:bg-theme-sidebar transition-colors">
      <td className="px-6 py-4 text-xs text-theme-muted font-bold">{num}</td>
      <td className="px-6 py-4 text-sm font-bold text-theme-text">{event}</td>
      <td className="px-6 py-4 text-sm text-theme-muted">{detail}</td>
      <td className="px-6 py-4 text-sm font-medium text-theme-muted">{time}</td>
      <td className="px-6 py-4">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${badgeColor}`}>
          {status}
        </span>
      </td>
    </tr>
  );
};

export default function Overview() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [stats, setStats] = React.useState(EMPTY_STATS);
  const [operations, setOperations] = React.useState([]);

  React.useEffect(() => {
    analyticsAPI.getDashboardStats()
      .then((data) => {
        setStats(data?.stats || EMPTY_STATS);
        setOperations(Array.isArray(data?.operations) ? data.operations : []);
      })
      .catch(() => {
        setStats(EMPTY_STATS);
        setOperations([]);
      });
  }, []);

  const efficiency = Number.parseInt(String(stats.efficiency || '0').replace('%', ''), 10) || 0;
  const gaugeData = [
    { name: 'Efficiency', value: efficiency },
    { name: 'Remainder', value: Math.max(100 - efficiency, 0) }
  ];
  const chartData = [
    { name: 'Completed', tons: Number(stats.totalPickups) || 0 },
    { name: 'Complaints', tons: Number(stats.missedPickups) || 0 },
    { name: 'Active Trucks', tons: Number(stats.activeTrucks) || 0 },
    { name: 'Pending', tons: Number(stats.newComplaints) || 0 }
  ];
  const COLORS = ['var(--accent)', '#DDE8CD'];

  const filteredOperations = React.useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    return operations.filter((op) => {
      const event = String(op.event || '').toLowerCase();
      const detail = String(op.detail || '').toLowerCase();
      const matchSearch = event.includes(q) || detail.includes(q);
      const matchFilter = filter === 'all' ||
        (filter === 'pickups' && event.includes('collection')) ||
        (filter === 'violations' && event.includes('violation'));
      return matchSearch && matchFilter;
    });
  }, [operations, query, filter]);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pickups" value={stats.totalPickups} subtitle="completed tasks" icon={<Truck size={16} />} onClick={() => navigate('/driver-log')} />
        <StatCard title="Missed Pickups" value={stats.missedPickups} subtitle="total complaints" icon={<AlertTriangle size={16} />} onClick={() => navigate('/complaints')} />
        <StatCard title="Active Trucks" value={String(stats.activeTrucks).padStart(2, '0')} subtitle="drivers on duty" icon={<Map size={16} />} onClick={() => navigate('/live-map')} />
        <StatCard title="New Complaints" value={String(stats.newComplaints).padStart(2, '0')} subtitle="pending review" icon={<FileText size={16} />} onClick={() => navigate('/complaints')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-theme-card rounded-[32px] p-8 shadow-sm border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-theme-text font-serif text-xl">Live Operational Summary</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="tons" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorTons)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-theme-card rounded-[32px] p-8 shadow-sm border border-white/40 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-theme-text font-serif text-xl">System Efficiency</h3>
            <p className="text-sm font-medium text-theme-muted">Based on completed tasks</p>
          </div>

          <div className="relative h-48 w-full flex items-center justify-center translate-y-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie data={gaugeData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={80} outerRadius={100} paddingAngle={0} dataKey="value" stroke="none" cornerRadius={40}>
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
            <div className="absolute bottom-4 text-5xl font-bold font-serif text-theme-text">
              {stats.efficiency}
            </div>
          </div>

          <div className="flex justify-between mt-auto pt-6 border-t border-white/30">
            <div>
              <p className="font-bold text-theme-text font-serif text-lg mb-1">Completed</p>
              <p className="text-2xl font-bold text-theme-accent">{stats.totalPickups}</p>
              <p className="text-xs font-semibold text-theme-text">live from backend</p>
            </div>
            <div>
              <p className="font-bold text-theme-text font-serif text-lg mb-1">Pending</p>
              <p className="text-2xl font-bold text-theme-accent">{stats.newComplaints}</p>
              <p className="text-xs font-semibold text-theme-text">complaints queue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-theme-card rounded-[32px] shadow-sm border border-white/40 overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h4 className="font-bold text-theme-text font-serif text-xl">Live Operations Feed</h4>

          <div className="flex items-center bg-theme-sidebar rounded-full flex-1 max-w-sm px-4 py-2 mx-8 shadow-inner border border-white/50">
            <Search className="text-theme-muted mr-3" size={16} />
            <input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none text-sm w-full focus:outline-none text-theme-text placeholder-theme-muted/70 font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm font-semibold overflow-x-auto whitespace-nowrap">
              <button onClick={() => setFilter('all')} className={`transition-opacity ${filter === 'all' ? 'text-theme-accent font-bold' : 'text-theme-muted hover:text-theme-text'}`}>All Activities</button>
              <button onClick={() => setFilter('pickups')} className={`transition-opacity ${filter === 'pickups' ? 'text-theme-accent font-bold' : 'text-theme-muted hover:text-theme-text'}`}>Pickups</button>
              <button onClick={() => setFilter('violations')} className={`transition-opacity ${filter === 'violations' ? 'text-theme-accent font-bold' : 'text-theme-muted hover:text-theme-text'}`}>Violations</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-theme-muted text-sm font-bold border-b border-white/30">
                <th className="px-6 py-4 w-16">Num.</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Source / Detail</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperations.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-theme-muted font-medium italic">No live operations available yet.</td></tr>
              ) : (
                filteredOperations.map((op, idx) => (
                  <FeedRow key={op.id || idx} num={idx + 1} {...op} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
