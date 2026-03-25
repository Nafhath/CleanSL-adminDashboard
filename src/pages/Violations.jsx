import React from 'react';
import { Search, Calendar, AlertTriangle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { violationAPI } from '../services/api';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-pink-100 text-pink-600 border-pink-200',
    Confirmed: 'bg-orange-100 text-orange-600 border-orange-200',
    Resolved: 'bg-emerald-100 text-emerald-600 border-emerald-200'
  };
  return (
    <div className={`px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </div>
  );
};

export default function Violations() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [violations, setViolations] = React.useState([]);
  const [stats, setStats] = React.useState([]);

  React.useEffect(() => {
    violationAPI.getAll().then((data) => setViolations(Array.isArray(data) ? data : [])).catch(() => setViolations([]));
    violationAPI.getStats().then((data) => setStats(Array.isArray(data) ? data : [])).catch(() => setStats([]));
  }, []);

  const filteredViolations = React.useMemo(() => {
    return violations.filter((item) => {
      const matchesSearch =
        String(item.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.resident || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !selectedDate || item.date === selectedDate.split('-').reverse().join('/');
      return matchesSearch && matchesDate;
    });
  }, [violations, searchTerm, selectedDate]);

  const icons = [
    <AlertTriangle size={16} className="text-theme-accent" />,
    <Clock size={16} className="text-theme-accent" />,
    <ShieldCheck size={16} className="text-theme-accent" />,
    <CheckCircle2 size={16} className="text-theme-accent" />
  ];

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Violations</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Live anomaly rows generated from backend data</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-theme-sidebar p-5 rounded-[28px] shadow-sm border border-white/40">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
          <input type="text" placeholder="Search violation type or resident" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl text-sm font-bold text-theme-text border border-white/50 shadow-inner focus:ring-2 focus:ring-theme-accent outline-none transition-all placeholder-theme-muted/50" />
        </div>

        <div className="flex items-center bg-white rounded-2xl border border-white/50 shadow-inner px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer group w-full xl:w-auto">
          <Calendar size={15} className="text-theme-muted mr-2 group-hover:text-theme-accent" />
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-[11px] font-black text-theme-text outline-none cursor-pointer uppercase w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-theme-card rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-white/40">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-theme-text font-bold text-sm">
                {icons[i] || icons[0]} <span>{stat.label}</span>
              </div>
            </div>
            <div>
              <h3 className={`text-4xl font-bold mb-2 ${stat.color || 'text-theme-accent'}`}>{stat.value}</h3>
              <div className="text-xs font-semibold text-theme-muted">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-theme-card rounded-[40px] shadow-sm border border-white/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h4 className="font-serif font-bold text-theme-text text-xl">Violation Table</h4>
          <span className="bg-theme-sidebar px-4 py-1.5 rounded-full text-[10px] font-bold text-theme-muted border border-white/50">{filteredViolations.length} Active Incidents</span>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-black text-theme-muted tracking-widest border-b border-white/30">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Violation Type</th>
                <th className="px-6 py-4">Resident / Address</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">AI Score</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredViolations.length > 0 ? filteredViolations.map((row, i) => (
                <tr key={i} className="border-b border-white/20 hover:bg-white/30 transition-all duration-300">
                  <td className="px-6 py-5 font-bold text-theme-muted">{row.date}</td>
                  <td className="px-6 py-5 font-black text-theme-text">{row.type}</td>
                  <td className="px-6 py-5 font-bold text-theme-muted">{row.resident}</td>
                  <td className="px-6 py-5"><StatusBadge status={row.status} /></td>
                  <td className="px-6 py-5 text-right font-black text-theme-text">{row.score}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-theme-muted italic font-medium tracking-tight">No live violations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
