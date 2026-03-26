import React from 'react';
import {
  Building2,
  Users,
  FileText,
  Blocks,
  MapPin,
  Shield,
  Link,
  Database,
  BadgeCheck
} from 'lucide-react';
import { complaintAPI, userAPI } from '../services/api';

const navItems = [
  { id: 'operations', icon: Building2, title: 'Operational Info' },
  { id: 'users', icon: Users, title: 'Users & Permissions' },
  { id: 'integrations', icon: Blocks, title: 'Network Integrations' },
  { id: 'documents', icon: FileText, title: 'Documentations' }
];

const MetricCard = ({ icon: Icon, label, value, helper, color }) => (
  <div className="p-5 bg-theme-sidebar rounded-[24px] border border-white/50 shadow-inner flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/50 shadow-sm ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <h4 className="font-black text-[11px] uppercase tracking-widest text-theme-muted opacity-80">{label}</h4>
      <p className="font-serif text-xl font-black text-theme-text">{value}</p>
      <p className="text-[10px] font-bold text-theme-muted">{helper}</p>
    </div>
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">{label}</label>
    <div className="w-full px-4 py-3.5 bg-theme-sidebar border border-white/60 rounded-2xl text-[13px] font-bold text-theme-text shadow-inner">
      {value || 'Not configured'}
    </div>
  </div>
);

export default function Settings() {
  const [activeSection, setActiveSection] = React.useState('operations');
  const [admins, setAdmins] = React.useState([]);
  const [complaintStats, setComplaintStats] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.allSettled([userAPI.getAdmins(), complaintAPI.getStats()])
      .then(([adminsResult, complaintsResult]) => {
        setAdmins(adminsResult.status === 'fulfilled' && Array.isArray(adminsResult.value) ? adminsResult.value : []);
        setComplaintStats(complaintsResult.status === 'fulfilled' && Array.isArray(complaintsResult.value) ? complaintsResult.value : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeAdmins = admins.filter((admin) => admin.is_active);
  const totalComplaints = complaintStats.find((item) => item.label === 'Total')?.value ?? 0;
  const pendingComplaints = complaintStats.find((item) => item.label === 'Pending')?.value ?? 0;
  const integrations = [
    { name: 'Supabase Database', desc: 'Primary source for residents, drivers, pickups, complaints, and admin users.', status: 'Connected', icon: Database },
    { name: 'Render Backend API', desc: 'Protected admin API used by the dashboard to retrieve operational data.', status: 'Connected', icon: Link },
    { name: 'Vercel Frontend', desc: 'Admin dashboard frontend deployment consuming the Render backend.', status: 'Connected', icon: Blocks },
    { name: 'Storage Buckets', desc: 'Complaint images and driver audio assets are stored in Supabase storage.', status: 'Connected', icon: FileText }
  ];

  const documents = [
    { title: 'Context Log', detail: 'Workspace handoff summary for future Codex/model sessions.', source: 'CODEX_CONTEXT_LOG.md' },
    { title: 'Frontend README', detail: 'Frontend-specific setup and handoff notes for the reorganized admin dashboard.', source: 'Admin Dashboard/Frontend/README.md' },
    { title: 'Frontend Setup Guide', detail: 'Workspace startup and frontend environment guidance.', source: 'Admin Dashboard/Frontend/SETUP.md' }
  ];

  return (
    <div className="flex flex-col gap-8 bg-theme-main font-sans selection:bg-theme-accent selection:text-white w-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Settings</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Live system references for the admin dashboard. Editing tools are intentionally limited until full admin management is implemented.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
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
            <MetricCard icon={Users} label="Active Admins" value={activeAdmins.length} helper="dashboard staff accounts" color="bg-emerald-500" />
            <MetricCard icon={MapPin} label="Pending Complaints" value={pendingComplaints} helper="live complaints queue" color="bg-amber-500" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 min-w-0">
          <div className="bg-theme-card rounded-[40px] p-8 border border-white/40 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="font-serif text-2xl font-black text-theme-text tracking-tight mb-1 capitalize">
                {navItems.find((item) => item.id === activeSection)?.title}
              </h2>
              <p className="text-xs font-bold text-theme-muted tracking-wide">
                {loading ? 'Refreshing live configuration details...' : 'Showing live references and currently implemented capabilities.'}
              </p>
            </div>
            <div className="relative z-10 rounded-2xl bg-theme-sidebar px-5 py-4 border border-white/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Mode</p>
              <p className="text-sm font-black text-theme-text">Read-only admin settings</p>
            </div>
          </div>

          {activeSection === 'operations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-xl font-black text-theme-text">Operational Snapshot</h3>
                  <p className="text-xs font-bold text-theme-muted mt-1">These values come from the current dashboard environment and seeded operational data.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <ReadOnlyField label="Backend API" value="https://cleansl-backend-9d4g.onrender.com" />
                  <ReadOnlyField label="Database Provider" value="Supabase (suzgjlzertafuyeprshp)" />
                  <ReadOnlyField label="Admin Auth Store" value="public.admin_users" />
                  <ReadOnlyField label="Complaint Records" value={String(totalComplaints)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-theme-sidebar pb-4">
                <div>
                  <h3 className="font-serif text-xl font-black text-theme-text">Admin Directory</h3>
                  <p className="text-xs font-bold text-theme-muted mt-1">Live staff accounts from `admin_users`. Creation and password rotation are currently handled by the development team.</p>
                </div>
                <div className="rounded-xl bg-theme-sidebar px-4 py-3 border border-white/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Status</p>
                  <p className="text-sm font-black text-theme-text">{activeAdmins.length} active / {admins.length} total</p>
                </div>
              </div>

              <div className="border border-white/40 rounded-[24px] overflow-hidden shadow-sm bg-white/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-theme-sidebar border-b border-white/40 text-[10px] uppercase font-black text-theme-muted tracking-widest">
                      <th className="p-4 pl-6">Admin</th>
                      <th className="p-4 hidden sm:table-cell">Role</th>
                      <th className="p-4 hidden sm:table-cell">Last Login</th>
                      <th className="p-4 pr-6 text-right">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40 text-sm font-bold text-theme-text">
                    {admins.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-theme-muted font-medium italic">No admin users found.</td>
                      </tr>
                    ) : admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-white transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent font-black text-xs shrink-0">
                              {String(admin.full_name || admin.email || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px]">{admin.full_name || 'Unnamed Admin'}</span>
                              <span className="text-[10px] font-bold text-theme-muted">{admin.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="flex items-center gap-1.5 text-[11px]">
                            <Shield size={12} className={admin.role === 'admin' ? 'text-emerald-500' : 'text-indigo-500'} />
                            {admin.role}
                          </span>
                        </td>
                        <td className="p-4 hidden sm:table-cell text-[11px] text-theme-muted">
                          {admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : 'No login recorded'}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <span className={`px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider ${admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {admin.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-theme-sidebar pb-4">
                <Blocks size={24} className="text-theme-accent" />
                <h3 className="font-serif text-xl font-black text-theme-text">Live Integrations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((integration) => (
                  <div key={integration.name} className="flex items-start justify-between p-6 bg-white/20 rounded-[24px] border border-white/50">
                    <div className="flex flex-col gap-2 pr-4">
                      <h4 className="font-extrabold text-sm text-theme-text flex items-center gap-2">
                        <integration.icon size={14} className="text-theme-muted" />
                        {integration.name}
                      </h4>
                      <p className="text-[11px] font-bold text-theme-muted/80 leading-relaxed max-w-[260px]">{integration.desc}</p>
                    </div>
                    <span className="shrink-0 px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      {integration.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'documents' && (
            <div className="bg-theme-card p-8 rounded-[36px] border border-white/40 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-theme-sidebar pb-4">
                <BadgeCheck size={24} className="text-theme-accent" />
                <h3 className="font-serif text-xl font-black text-theme-text">Project References</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.title} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-white/50 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-theme-sidebar rounded-xl flex items-center justify-center shrink-0 border border-white/50">
                        <FileText size={18} className="text-theme-accent" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-extrabold text-[12px] text-theme-text truncate">{doc.title}</span>
                        <span className="text-[10px] font-bold text-theme-muted">{doc.detail}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-theme-accent mt-1">{doc.source}</span>
                      </div>
                    </div>
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
