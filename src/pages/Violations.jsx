import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Search, 
  Calendar, 
  MapPin, 
  MoreHorizontal, 
  ShieldCheck,
  AlertTriangle,
  X,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

import { 
  VIOLATION_STATS, 
  VIOLATIONS_TABLE, 
  VIOLATION_LOCATIONS 
} from '../data/mockData';
import { violationAPI } from '../services/api';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const parseViolationDate = (value) => {
  const parsed = Date.parse(value || '');
  if (!Number.isNaN(parsed)) return parsed;

  const parts = String(value || '').split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    const fallback = new Date(year, month - 1, day).getTime();
    return Number.isNaN(fallback) ? 0 : fallback;
  }

  return 0;
};

const mergeViolations = (liveViolations = []) => {
  const merged = [...liveViolations, ...VIOLATIONS_TABLE];
  const unique = Array.from(
    new Map(merged.map((item, index) => [`${item.resident}-${item.date}-${item.type}-${index < liveViolations.length ? 'live' : 'mock'}`, item])).values()
  );

  return unique
    .sort((a, b) => parseViolationDate(b.date) - parseViolationDate(a.date))
    .slice(0, 15);
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { label: "Pending", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
    Disputed: { label: "Disputed", bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    Resolved: { label: "Resolved", bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200" },
    Confirmed: { label: "Confirmed", bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" }
  };
  const config = statusConfig[status] || { label: status, bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };

  return (
    <div className={`px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </div>
  );
};

const AIDetailsModal = ({ isOpen, onClose, incident }) => {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 bg-theme-main/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-theme-sidebar border border-white/40 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/20 shrink-0">
          <h2 className="text-xl font-serif font-black text-theme-text">AI Incident Details</h2>
          <button onClick={onClose} className="p-2 bg-theme-main text-theme-muted rounded-full hover:text-theme-accent transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="w-full h-64 rounded-2xl overflow-hidden mb-6 border border-white/40 shadow-inner relative">
             <img src={incident.img} className="w-full h-full object-cover" alt="Incident" />
             <div className="absolute top-4 left-4 bg-red-500/90 text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase backdrop-blur-sm shadow-md">
                <AlertTriangle size={12}/> {incident.confidence}% Confidence
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-main p-4 rounded-xl shadow-inner border border-white/20">
              <p className="text-[10px] font-black uppercase text-theme-muted tracking-widest">Incident ID</p>
              <p className="text-sm font-bold text-theme-text mt-1">{incident.id}</p>
            </div>
            <div className="bg-theme-main p-4 rounded-xl shadow-inner border border-white/20">
              <p className="text-[10px] font-black uppercase text-theme-muted tracking-widest">Target Unit</p>
              <p className="text-sm font-bold text-theme-text mt-1">{incident.unit}</p>
            </div>
            <div className="bg-theme-main p-4 rounded-xl shadow-inner border border-white/20 col-span-2">
              <p className="text-[10px] font-black uppercase text-theme-muted tracking-widest">Detected Location & Time</p>
              <p className="text-sm font-bold text-theme-text mt-1 flex items-center gap-1"><MapPin size={12} className="text-theme-muted"/> {incident.location} • {incident.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Violations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  const [violations, setViolations] = useState(VIOLATIONS_TABLE);
  const [stats, setStats] = useState(VIOLATION_STATS);

  const [selectedAiIncident, setSelectedAiIncident] = useState(null);
  const [aiQueue, setAiQueue] = useState([
    {
      id: '20251121SW-1',
      unit: 'Unit_12',
      unitNum: '12',
      confidence: 94,
      img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=60&w=400',
      location: 'Colombo 06',
      time: '14:20 PM',
      confirmed: false
    },
    {
      id: '20251121SW-2',
      unit: 'Unit_08',
      unitNum: '08',
      confidence: 88,
      img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=60&w=400',
      location: 'Colombo 05',
      time: '09:15 AM',
      confirmed: false
    }
  ]);

  const handleConfirmToggle = (id, currentStatus) => {
    if (currentStatus) {
      if (window.confirm("Are you sure you want to return this decision to unconfirmed?")) {
        setAiQueue(prev => prev.map(item => item.id === id ? { ...item, confirmed: false } : item));
      }
    } else {
      setAiQueue(prev => prev.map(item => item.id === id ? { ...item, confirmed: true } : item));
    }
  };

  React.useEffect(() => {
    violationAPI.getAll().then(data => {
      if (data && Array.isArray(data)) {
        setViolations(mergeViolations(data));
      }
    }).catch(e => {
      console.log('Using mock violations list', e);
      setViolations(VIOLATIONS_TABLE);
    });

    violationAPI.getStats().then(data => {
      if (data && Array.isArray(data) && data.length > 0) setStats(data);
    }).catch(e => console.log('Using mock violation stats', e));
  }, []);

  const filteredViolations = useMemo(() => {
    return violations.filter(item => {
      const matchesSearch = 
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resident.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = activeTypeFilter === 'All' || item.type.includes(activeTypeFilter);
      const matchesDate = !selectedDate || item.date === selectedDate.split('-').reverse().join('/');

      return matchesSearch && matchesType && matchesDate;
    });
  }, [violations, searchTerm, activeTypeFilter, selectedDate]);

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <AIDetailsModal 
        isOpen={!!selectedAiIncident} 
        onClose={() => setSelectedAiIncident(null)} 
        incident={selectedAiIncident} 
      />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Violations</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Monitor and manage waste sorting infractions</p>
        </div>
      </div>

      {/* Analytics & Filters Banner */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-theme-sidebar p-5 rounded-[28px] shadow-sm border border-white/40">
         <div className="relative w-full xl:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
            <input 
              type="text" 
              placeholder="Waste Sorting Dashboard" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl text-sm font-bold text-theme-text border border-white/50 shadow-inner focus:ring-2 focus:ring-theme-accent outline-none transition-all placeholder-theme-muted/50" 
            />
         </div>

         <div className="flex flex-wrap gap-3 items-center justify-center w-full xl:w-auto">
            <div className="flex items-center bg-white rounded-2xl border border-white/50 shadow-inner px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer group flex-1 md:flex-none">
              <Calendar size={15} className="text-theme-muted mr-2 group-hover:text-theme-accent" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-[11px] font-black text-theme-text outline-none cursor-pointer uppercase w-full"
              />
              {selectedDate && (
                <button onClick={() => setSelectedDate('')} className="ml-2 p-1 bg-red-50 hover:bg-red-100 rounded-full"><X size={14} className="text-red-500" /></button>
              )}
            </div>

            <div className="h-8 w-[1px] bg-theme-muted/20 hidden md:block mx-1"></div>

            <div className="flex gap-2 flex-wrap md:flex-nowrap w-full md:w-auto">
              {['All', 'Mixed', 'Unsorted'].map((type) => (
                <button 
                  key={type}
                  onClick={() => setActiveTypeFilter(type)}
                  className={`flex-1 md:flex-none px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300
                    ${activeTypeFilter === type ? 'bg-theme-accent border-theme-accent text-white shadow-lg scale-105' : 'bg-white text-theme-muted border-white/50 hover:border-theme-accent'}`}
                >
                  {type === 'All' ? 'All Types' : `${type} Waste`}
                </button>
              ))}
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex-[2] flex flex-col gap-8 min-w-0">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const icons = [
                <AlertTriangle size={16} className="text-theme-accent" />, 
                <Clock size={16} className="text-theme-accent" />, 
                <ShieldCheck size={16} className="text-theme-accent" />, 
                <CheckCircle2 size={16} className="text-theme-accent" />
              ];
              const isNegative = stat.trend?.includes('-');
              return (
                <div key={i} className="bg-theme-card rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-white/40 group hover:border-theme-accent transition-all cursor-pointer" onClick={() => alert("Loading violation category...")}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-theme-text font-bold text-sm">
                      {icons[i]} <span>{stat.label}</span>
                    </div>
                    <div className="text-theme-muted font-bold tracking-widest leading-none opacity-50 group-hover:opacity-100 transition-opacity">...</div>
                  </div>
                  <div>
                    <h3 className={`text-4xl font-bold mb-2 ${stat.color || 'text-theme-accent'}`}>{stat.value}</h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-theme-text opacity-80">
                      {isNegative ? <ArrowDownRight size={14} className="text-red-500" /> : <ArrowUpRight size={14} className="text-theme-accent" />}
                      <span className={isNegative ? 'text-red-500' : 'text-theme-accent'}>{stat.trend}</span>
                      <span className="text-theme-muted ml-1">vs last month</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
                      <th className="px-6 py-4">Resident</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">AI Score</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredViolations.length > 0 ? (
                      filteredViolations.map((row, i) => (
                        <tr key={i} className="border-b border-white/20 hover:bg-white/30 transition-all duration-300">
                          <td className="px-6 py-5 font-bold text-theme-muted">{row.date}</td>
                          <td className="px-6 py-5 font-black text-theme-text">{row.type}</td>
                          <td className="px-6 py-5 font-bold text-theme-muted">{row.resident}</td>
                          <td className="px-6 py-5"><StatusBadge status={row.status} /></td>
                          <td className="px-6 py-5 text-right font-black flex items-center justify-end gap-3 text-theme-text">
                            {row.score} 
                            <div className={`w-4 h-4 rounded-full border-4 ${row.score > 90 ? 'border-theme-accent bg-emerald-50' : 'border-white bg-slate-100 shadow-inner'}`} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="px-6 py-20 text-center text-theme-muted italic font-medium tracking-tight">No violations match your current filters.</td></tr>
                    )}
                  </tbody>
               </table>
             </div>
          </div>

          <div className="bg-theme-card p-7 rounded-[40px] shadow-sm border border-white/40">
             <div className="flex items-center gap-2 mb-5">
                <MapPin size={16} className="text-theme-accent"/>
                <h4 className="font-serif font-bold text-theme-text text-xl">Violation Reported Locations</h4>
             </div>
             <div className="h-80 rounded-[30px] overflow-hidden border border-white/50 z-0 shadow-inner">
                <MapContainer center={[6.9145, 79.8650]} zoom={14} className="h-full w-full relative z-0">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {VIOLATION_LOCATIONS.map((pos, i) => (
                    <Marker key={i} position={pos}>
                      <Popup><span className="font-bold">Incident Log #{i+1}</span></Popup>
                    </Marker>
                  ))}
                </MapContainer>
             </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
           <div className="bg-theme-sidebar p-7 rounded-[35px] shadow-sm border border-white/40">
              <h5 className="text-[10px] font-black uppercase text-theme-muted/70 mb-8 tracking-[0.2em] text-center border-b border-white/50 pb-4">Sorting Accuracy Metrics</h5>
              <div className="h-40 flex items-end justify-between px-3 gap-2">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div 
                    key={i} 
                    style={{ height: `${h}%` }} 
                    className={`flex-1 rounded-full transition-all duration-1000 ${h > 75 ? 'bg-theme-accent shadow-md' : 'bg-white/50'}`} 
                   />
                 ))}
              </div>
              <div className="flex justify-between mt-5 text-[9px] font-black text-theme-muted/70 uppercase px-1 tracking-widest">
                <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
              </div>
           </div>

           <div className="flex items-center justify-between px-4">
            <h5 className="text-[10px] font-black uppercase text-theme-accent bg-theme-sidebar border border-white/50 px-4 py-2 rounded-2xl tracking-tighter shadow-sm">AI Review Queue</h5>
            <button className="text-[10px] font-black text-theme-muted uppercase hover:text-theme-accent transition-all">Expand All</button>
           </div>
           
           {aiQueue.map(incident => (
             <div key={incident.id} className={`bg-theme-card p-6 rounded-[35px] shadow-sm border transition-all duration-300 group ${incident.confirmed ? 'border-red-500/50' : 'border-white/40 hover:border-theme-accent'}`}>
                <div className="flex justify-between items-center mb-5">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-theme-sidebar rounded-2xl flex items-center justify-center text-theme-accent font-black border border-white/50 text-sm shadow-inner group-hover:bg-white transition-colors">
                        {incident.unitNum}
                      </div>
                      <div>
                        <p className={`text-sm font-black tracking-tight transition-colors ${incident.confirmed ? 'text-red-500' : 'text-theme-text'}`}>{incident.unit}</p>
                        <p className="text-[9px] text-theme-muted font-bold uppercase tracking-tighter">AI-Detected Log</p>
                      </div>
                   </div>
                   <MoreHorizontal size={20} className="text-theme-muted/40 group-hover:text-theme-muted" />
                </div>
                <div className="h-44 bg-theme-sidebar rounded-[28px] mb-5 overflow-hidden border border-white/40 relative">
                   <img 
                    src={incident.img} 
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700" 
                    alt="Violation" 
                   />
                   <div className="absolute top-4 left-4 bg-red-500/90 text-white text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1 uppercase backdrop-blur-sm shadow-sm">
                     <AlertTriangle size={8}/> {incident.confidence}% Confidence
                   </div>
                </div>
                <div className="space-y-1.5 mb-6 px-1">
                  <p className="text-[11px] font-black text-theme-text uppercase tracking-widest">Incident: {incident.id}</p>
                  <div className="flex items-center gap-2 text-theme-muted">
                    <MapPin size={12}/>
                    <p className="text-[10px] font-bold">{incident.location} • {incident.time}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                   <button 
                     className="flex-[0.8] py-3 rounded-2xl bg-white text-[10px] font-black uppercase text-theme-text border border-white/50 shadow-sm hover:bg-theme-main transition-all tracking-widest"
                     onClick={() => setSelectedAiIncident(incident)}
                   >
                     Details
                   </button>
                   <button 
                     className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase shadow-md transition-all flex items-center justify-center gap-2 tracking-widest ${incident.confirmed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-theme-accent text-white hover:opacity-90'}`}
                     onClick={() => handleConfirmToggle(incident.id, incident.confirmed)}
                   >
                     <ShieldCheck size={14}/> {incident.confirmed ? 'Confirmed' : 'Confirm'}
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
