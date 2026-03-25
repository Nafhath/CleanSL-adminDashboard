import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { Truck, AlertTriangle, Map, FileText, ArrowUpRight, ArrowDownRight, CheckCircle2, Search } from 'lucide-react';
import { MOCK_STATS, MOCK_OPERATIONS } from '../data/mockData';
import { analyticsAPI } from '../services/api';

const parseOperationTime = (value) => {
  const parsed = Date.parse(value || '');
  return Number.isNaN(parsed) ? 0 : parsed;
};

const mergeOperations = (liveOperations = []) => {
  const merged = [...liveOperations, ...MOCK_OPERATIONS];
  const unique = Array.from(
    new Map(
      merged.map((item, index) => [
        item.id || `${item.event}-${item.detail}-${index}`,
        item
      ])
    ).values()
  );

  return unique
    .sort((a, b) => parseOperationTime(b.createdAt || b.time) - parseOperationTime(a.createdAt || a.time))
    .slice(0, 15);
};

// --- Reusable Stat Card ---
const StatCard = ({ title, value, trend, isNegative, icon, subtitle, onClick }) => (
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
        {isNegative ? <ArrowDownRight size={14} className="text-red-500" /> : trend.includes('+') ? <ArrowUpRight size={14} className="text-theme-accent" /> : <CheckCircle2 size={14} className="text-theme-accent" />}
        <span className={isNegative ? 'text-red-500' : 'text-theme-accent'}>{trend} {subtitle}</span>
      </div>
    </div>
  </div>
);

// --- Operations Feed Row ---
const FeedRow = ({ num, event, detail, time, status, color }) => {
  let badgeColor = 'bg-slate-200 text-slate-700';
  if (color?.includes('green') || status === 'Verified') badgeColor = 'bg-theme-accent text-white';
  if (color?.includes('red') || status === 'Violation') badgeColor = 'bg-red-400 text-white';
  if (color?.includes('blue') || status === 'Moving') badgeColor = 'bg-blue-400 text-white';
  if (color?.includes('yellow') || status === 'Pending') badgeColor = 'bg-amber-100 text-amber-600';

  return (
    <tr className="border-b border-white/20 hover:bg-theme-sidebar transition-colors cursor-pointer" onClick={() => alert(`Reviewing log: ${event}`)}>
      <td className="px-6 py-4 text-xs text-theme-muted font-bold">{num}</td>
      <td className="px-6 py-4 text-sm font-bold text-theme-text flex items-center gap-2">
        {event.includes('Truck') ? <Truck size={14} className="text-theme-muted" /> :
          event.includes('Violation') ? <AlertTriangle size={14} className="text-red-400" /> :
            event.includes('Complaint') ? <FileText size={14} className="text-amber-400" /> :
              <CheckCircle2 size={14} className="text-theme-accent" />}
        {event}
      </td>
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
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [stats, setStats] = useState(MOCK_STATS);
  const [operations, setOperations] = useState(MOCK_OPERATIONS);

  React.useEffect(() => {
    analyticsAPI.getDashboardStats()
      .then(data => {
        if (data?.stats) setStats(data.stats);
        if (Array.isArray(data?.operations)) {
          setOperations(mergeOperations(data.operations));
        }
      })
      .catch((err) => {
        console.log('Using mock dashboard data', err);
        setOperations(MOCK_OPERATIONS);
      });
  }, []);

  // Mock Data for Area Chart
  const chartData = [
    { name: 'Dec 01', tons: 8 }, { name: 'Dec 05', tons: 16 },
    { name: 'Dec 10', tons: 13 }, { name: 'Dec 15', tons: 5 },
    { name: 'Dec 20', tons: 20 }, { name: 'Dec 25', tons: 10 },
    { name: 'Dec 30', tons: 18 }
  ];

  const gaugeData = [{ name: 'Efficiency', value: parseInt(stats.efficiency) }, { name: 'Remainder', value: 100 - parseInt(stats.efficiency) }];
  const COLORS = ['var(--accent)', '#DDE8CD'];

  const filteredOperations = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    return operations.filter(op => {
      const matchSearch = op.event.toLowerCase().includes(q) || op.detail.toLowerCase().includes(q);
      const matchFilter = filter === 'all' ||
        (filter === 'pickups' && op.event.toLowerCase().includes('collection')) ||
        (filter === 'violations' && op.event.toLowerCase().includes('violation'));
      return matchSearch && matchFilter;
    });
  }, [operations, query, filter]);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pickups" value={stats.totalPickups.toString()} trend="+12%" subtitle="this week" icon={<Truck size={16} />} onClick={() => navigate('/driver-log')} />
        <StatCard title="Missed Pickups" value={stats.missedPickups.toString()} trend="-2%" subtitle="this week" isNegative={true} icon={<AlertTriangle size={16} />} onClick={() => navigate('/complaints')} />
        <StatCard title="Active Trucks" value={stats.activeTrucks.toString().padStart(2, '0')} trend={`+${stats.activeTrucks} active`} subtitle="" icon={<Map size={16} />} onClick={() => navigate('/driver-log')} />
        <StatCard title="New Complaints" value={stats.newComplaints.toString().padStart(2, '0')} trend="Pending" subtitle="queue" icon={<FileText size={16} />} onClick={() => navigate('/complaints')} />
      </div>

      {/* MIDDLE CHARTS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* AREA CHART */}
        <div className="xl:col-span-2 bg-theme-card rounded-[32px] p-8 shadow-sm border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-theme-text font-serif text-xl">Total Waste Collected</h3>
            <select className="bg-transparent text-theme-muted text-sm font-semibold p-1 outline-none cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Year to Date</option>
            </select>
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
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }} tickFormatter={(t) => `${t}t`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-main)', borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--text-dark)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="tons" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorTons)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GAUGE & EFFICIENCY */}
        <div className="bg-theme-card rounded-[32px] p-8 shadow-sm border border-white/40 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-theme-text font-serif text-xl">System Efficiency</h3>
            <p className="text-sm font-medium text-theme-muted">Live Performance</p>
          </div>
          <div className="flex items-center gap-2 text-theme-text font-semibold text-sm mb-4">
            <ArrowUpRight size={16} className="text-theme-accent" /> <span className="text-theme-accent">+35%</span> Increase vs. Manual
          </div>

          <div className="relative h-48 w-full flex items-center justify-center translate-y-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={40}
                >
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
              <p className="font-bold text-theme-text font-serif text-lg mb-1">Active Residence</p>
              <p className="text-2xl font-bold text-theme-accent">1, 245</p>
              <p className="text-xs font-semibold text-theme-text">+12 this week</p>
            </div>
            <div>
              <p className="font-bold text-theme-text font-serif text-lg mb-1">App Usage</p>
              <p className="text-2xl font-bold text-theme-accent">92%</p>
              <p className="text-xs font-semibold text-theme-text">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE OPERATIONS TABLE */}
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
            <button className="flex items-center gap-2 text-theme-muted font-bold text-sm bg-theme-sidebar px-4 py-2 rounded-xl border border-white/40 shadow-sm hover:border-theme-accent transition-colors shrink-0" onClick={() => alert("Advanced Filters Modal")}>
              Add Filter
            </button>
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
                <tr><td colSpan={5} className="px-6 py-12 text-center text-theme-muted font-medium italic">No operations found...</td></tr>
              ) : (
                filteredOperations.slice(0, 4).map((op, idx) => (
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
