import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Truck, Recycle, AlertTriangle } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const AnalyticsCard = ({ title, value, icon, color }) => (
  <div className="bg-theme-card p-6 rounded-[32px] shadow-sm border border-white/40 flex-1 flex justify-between items-center group hover:border-theme-accent transition-all min-w-[250px]">
    <div>
      <p className="text-[10px] font-black text-theme-muted uppercase tracking-[0.15em] mb-2">{title}</p>
      <h3 className="text-3xl font-black text-theme-text">{value}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-inner`}>
      {icon}
    </div>
  </div>
);

export default function ReportsAnalytics() {
  const [stats, setStats] = useState({ totalPickups: 0, missedPickups: 0, activeTrucks: 0, newComplaints: 0 });
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [wasteDistribution, setWasteDistribution] = useState([]);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getDashboardStats().catch(() => null),
      analyticsAPI.getMonthlyTrends().catch(() => []),
      analyticsAPI.getWasteDistribution().catch(() => [])
    ]).then(([dashboard, trends, waste]) => {
      setStats(dashboard?.stats || { totalPickups: 0, missedPickups: 0, activeTrucks: 0, newComplaints: 0 });
      setMonthlyTrends(Array.isArray(trends) ? trends : []);
      setWasteDistribution(Array.isArray(waste) ? waste : []);
    });
  }, []);

  const exportCsv = () => {
    const lines = [
      'Metric,Value',
      `Completed Tasks,${stats.totalPickups}`,
      `Total Complaints,${stats.missedPickups}`,
      `Active Drivers,${stats.activeTrucks}`,
      `Pending Complaints,${stats.newComplaints}`
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 bg-theme-main p-8 h-full overflow-y-auto font-sans selection:bg-theme-accent selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Live backend analytics only</p>
        </div>
        <button onClick={exportCsv} className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-accent rounded-2xl text-xs font-black text-white shadow-md hover:opacity-90 transition-all">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        <AnalyticsCard title="Completed Tasks" value={stats.totalPickups} icon={<Recycle size={24} />} color="bg-theme-sidebar text-theme-accent border border-white/50" />
        <AnalyticsCard title="Total Complaints" value={stats.missedPickups} icon={<AlertTriangle size={24} />} color="bg-theme-sidebar text-theme-accent border border-white/50" />
        <AnalyticsCard title="Active Drivers" value={stats.activeTrucks} icon={<Truck size={24} />} color="bg-theme-sidebar text-theme-accent border border-white/50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full pb-8">
        <div className="bg-theme-card p-8 rounded-[40px] shadow-sm border border-white/40">
          <h4 className="font-black text-theme-muted mb-8 uppercase text-xs tracking-widest">Monthly Collection Trends</h4>
          <div className="h-[300px] w-full">
            {monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorValAna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.4} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorValAna)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-theme-muted font-medium">No live monthly trend data available.</div>
            )}
          </div>
        </div>

        <div className="bg-theme-card p-8 rounded-[40px] shadow-sm border border-white/40 flex flex-col min-h-[400px]">
          <h4 className="font-black text-theme-muted mb-4 uppercase text-xs tracking-widest">Waste Category Distribution</h4>
          <div className="flex-1 min-h-[300px]">
            {wasteDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={wasteDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {wasteDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill || '#2D5A27'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-theme-muted font-medium">No live waste distribution data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
