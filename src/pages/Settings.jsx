import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Blocks, 
  MapPin, Plus, Trash2, Edit2, Shield, 
  UploadCloud, DownloadCloud, File, Layers, ToggleLeft, ToggleRight, Link, Save
} from 'lucide-react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('operations');

  const navItems = [
    { id: 'operations', icon: Building2, title: 'Operational Info' },
    { id: 'users', icon: Users, title: 'Users & Permissions' },
    { id: 'integrations', icon: Blocks, title: 'Network Integrations' },
    { id: 'documents', icon: FileText, title: 'Documentations' }
  ];

  const MetricCard = ({ icon: Icon, label, value, color }) => (
    <div className="p-5 bg-theme-sidebar rounded-[24px] border border-white/50 shadow-inner flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/50 shadow-sm ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <h4 className="font-black text-[11px] uppercase tracking-widest text-theme-muted opacity-80">{label}</h4>
        <p className="font-serif text-xl font-black text-theme-text">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 bg-theme-main font-sans selection:bg-theme-accent selection:text-white w-full pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Settings</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Configure global platform modules and organizational references.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          <div className="bg-theme-card p-3 rounded-[32px] border border-white/40 shadow-sm flex flex-col gap-2 relative">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-5 py-5 rounded-[20px] text-[12px] font-extrabold uppercase tracking-widest transition-all text-left ${
                  activeSection === item.id 
                    ? 'bg-theme-accent text-white shadow-lg shadow-theme-accent/20 scale-[1.02]' 
                    : 'bg-transparent text-theme-muted hover:bg-white hover:text-theme-text'
                }`}
              >
                <item.icon size={20} className={activeSection === item.id ? 'opacity-100' : 'opacity-50'} />
                {item.title}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <MetricCard icon={MapPin} label="Service Area" value="37.3 km²" color="bg-emerald-500" />
            <MetricCard icon={Layers} label="Population" value="752,993 Est" color="bg-amber-500" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0">
          
          <div className="bg-theme-card rounded-[40px] p-8 border border-white/40 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <h2 className="font-serif text-2xl font-black text-theme-text tracking-tight mb-1 capitalize">
                 {navItems.find(i => i.id === activeSection)?.title}
               </h2>
               <p className="text-xs font-bold text-theme-muted tracking-wide">
                 Manage local environment records and module specific rules.
               </p>
             </div>
             <div className="flex gap-3 relative z-10 shrink-0">
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-text text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-theme-text/20 hover:opacity-90 transition-all hover:-translate-y-0.5">
                  <Save size={14} /> Commit Changes
                </button>
             </div>
          </div>

          {/* SECTION: OPERATIONAL INFO */}
          {activeSection === 'operations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
               <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-theme-card p-6 rounded-[32px] border border-white/40 shadow-sm">
                 <div>
                   <h3 className="font-serif text-xl font-black text-theme-text">Active Council Zone</h3>
                   <p className="text-xs font-bold text-theme-muted mt-1">Currently managing operations for this primary boundary.</p>
                 </div>
                 <button className="flex items-center justify-center gap-2 bg-theme-text text-white px-5 py-3 sm:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-all"><Plus size={14}/> Add Council Zone</button>
               </div>

               <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6 md:col-span-2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">Council Name</label>
                      <input type="text" defaultValue="Colombo Municipal Council" className="w-full px-4 py-3.5 bg-theme-sidebar border border-white/60 rounded-2xl text-[13px] font-bold text-theme-text transition-all outline-none focus:border-theme-accent shadow-inner focus:ring-4 focus:ring-theme-accent/10" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">Registration Code</label>
                      <input type="text" defaultValue="CMC-WP-001" className="w-full px-4 py-3.5 bg-theme-sidebar border border-white/60 rounded-2xl text-[13px] font-bold text-theme-text transition-all outline-none focus:border-theme-accent shadow-inner focus:ring-4 focus:ring-theme-accent/10" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">Total Wards</label>
                      <input type="text" defaultValue="47" className="w-full px-4 py-3.5 bg-theme-sidebar border border-white/60 rounded-2xl text-[13px] font-bold text-theme-text transition-all outline-none focus:border-theme-accent shadow-inner focus:ring-4 focus:ring-theme-accent/10" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">Headquarters Location</label>
                      <input type="text" defaultValue="Town Hall, Colombo 07" className="w-full px-4 py-3.5 bg-theme-sidebar border border-white/60 rounded-2xl text-[13px] font-bold text-theme-text transition-all outline-none focus:border-theme-accent shadow-inner focus:ring-4 focus:ring-theme-accent/10" />
                    </div>
                 </div>
               </div>

            </div>
          )}

          {/* SECTION: USERS & PERMISSIONS */}
          {activeSection === 'users' && (
            <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-theme-sidebar pb-4">
                <h3 className="font-serif text-xl font-black text-theme-text">System Directory</h3>
                <button className="flex items-center gap-2 bg-theme-text text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-all"><Plus size={14}/> Add User</button>
              </div>

              <div className="border border-white/40 rounded-[24px] overflow-hidden shadow-sm bg-white/50">
                 <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-theme-sidebar border-b border-white/40 text-[10px] uppercase font-black text-theme-muted tracking-widest">
                        <th className="p-4 pl-6">Personnel</th>
                        <th className="p-4 hidden sm:table-cell">Role Group</th>
                        <th className="p-4 hidden sm:table-cell">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40 text-sm font-bold text-theme-text">
                      {[
                        { name: 'Kasun Perera', email: 'kasun.p@cleansl.gov.lk', role: 'Super Admin', status: 'Active' },
                        { name: 'Nuwan Wijesinghe', email: 'nuwan.w@cleansl.gov.lk', role: 'Dispatcher', status: 'Active' },
                        { name: 'Amali Fernando', email: 'amali.f@cleansl.gov.lk', role: 'Analyst', status: 'Inactive' },
                      ].map((u, i) => (
                        <tr key={i} className="hover:bg-white transition-colors group">
                           <td className="p-4 pl-6">
                             <div className="flex items-center gap-3">
                               <div className="w-9 h-9 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent font-black text-xs shrink-0">{u.name.charAt(0)}</div>
                               <div className="flex flex-col">
                                 <span className="text-[13px]">{u.name}</span>
                                 <span className="text-[10px] font-bold text-theme-muted">{u.email}</span>
                               </div>
                             </div>
                           </td>
                           <td className="p-4 hidden sm:table-cell">
                             <span className="flex items-center gap-1.5 text-[11px]"><Shield size={12} className={u.role === 'Super Admin' ? 'text-emerald-500' : 'text-indigo-500'}/> {u.role}</span>
                           </td>
                           <td className="p-4 hidden sm:table-cell">
                             <span className={`px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                           </td>
                           <td className="p-4 pr-6 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-2 bg-theme-sidebar rounded-lg text-theme-muted hover:text-theme-accent"><Edit2 size={14}/></button>
                               <button className="p-2 bg-red-50 rounded-lg text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                             </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* SECTION: INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-theme-sidebar pb-4">
                 <Blocks size={24} className="text-theme-accent" />
                 <h3 className="font-serif text-xl font-black text-theme-text">API Interlinks & Features</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Hardware IoT Protocol', desc: 'Sync live dump truck weights and bin sensors via MQTT routing.', enabled: true },
                  { name: 'GIS Routing Engine', desc: 'Advanced OS Map pathfinding module for automated driver routes.', enabled: true },
                  { name: 'SMS Citizen Alerts', desc: 'Automated 2-way text messaging for delay announcements.', enabled: false },
                  { name: 'Cloud Vault Backup', desc: 'AWS S3 integration to secure compliance photos and driver logs.', enabled: true }
                ].map((int, i) => (
                  <div key={i} className="flex items-start justify-between p-6 bg-white/20 rounded-[24px] border border-white/50 hover:border-theme-accent/30 transition-all group">
                     <div className="flex flex-col gap-2 pr-4">
                       <h4 className="font-extrabold text-sm text-theme-text flex items-center gap-2"><Link size={14} className="text-theme-muted" /> {int.name}</h4>
                       <p className="text-[11px] font-bold text-theme-muted/80 leading-relaxed max-w-[200px]">{int.desc}</p>
                     </div>
                     <button className="shrink-0 outline-none transform group-hover:scale-105 transition-transform">
                       {int.enabled ? <ToggleRight size={44} className="text-theme-accent drop-shadow-sm" /> : <ToggleLeft size={44} className="text-theme-muted/40" />}
                     </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: DOCUMENTS */}
          {activeSection === 'documents' && (
            <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
               <div className="flex justify-between items-center border-b border-theme-sidebar pb-4">
                 <h3 className="font-serif text-xl font-black text-theme-text">Standard Operating Procedures</h3>
                 <button className="flex items-center gap-2 bg-theme-text text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-all"><UploadCloud size={14}/> Upload Asset</button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { title: 'Fleet Maintenance Protocol.pdf', size: '2.4 MB', date: 'Jul 15, 2025' },
                   { title: 'Employee Code of Conduct.pdf', size: '1.1 MB', date: 'Jun 02, 2025' },
                   { title: 'Emergency Response Plan.pdf', size: '4.8 MB', date: 'Oct 30, 2025' },
                   { title: 'API Integration Keys.csv', size: '0.2 MB', date: 'Dec 05, 2025' }
                 ].map((doc, idx) => (
                   <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-white/50 shadow-sm hover:border-theme-accent/40 transition-all group">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-theme-sidebar rounded-xl flex items-center justify-center shrink-0 border border-white/50">
                          <File size={18} className="text-theme-accent" />
                       </div>
                       <div className="flex flex-col flex-1 min-w-0">
                         <span className="font-extrabold text-[12px] text-theme-text truncate">{doc.title}</span>
                         <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">{doc.size}</span>
                           <span className="w-1 h-1 rounded-full bg-theme-muted/30" />
                           <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">{doc.date}</span>
                         </div>
                       </div>
                     </div>
                     <button className="p-2 bg-theme-sidebar rounded-lg text-theme-muted opacity-0 group-hover:opacity-100 hover:text-theme-accent transition-all shrink-0"><DownloadCloud size={14}/></button>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
