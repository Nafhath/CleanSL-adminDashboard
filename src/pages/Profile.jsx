import React from 'react';
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Fingerprint,
  Clock,
  KeyRound
} from 'lucide-react';
import { userAPI } from '../services/api';

const Field = ({ label, icon: Icon, value }) => (
  <div className="flex flex-col gap-2 relative">
    <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
        <Icon size={16} className="text-theme-accent" />
      </div>
      <div className="w-full pl-12 pr-4 py-3.5 bg-theme-sidebar border border-white/30 rounded-2xl text-[13px] font-bold text-theme-text shadow-inner">
        {value || 'Not available'}
      </div>
    </div>
  </div>
);

export default function Profile() {
  const [admin, setAdmin] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    userAPI.getCurrentAdmin()
      .then((data) => setAdmin(data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fullName = admin.full_name || admin.name || 'Admin User';
  const role = admin.role || 'admin';
  const email = admin.email || 'Not available';
  const lastLogin = admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : 'No login recorded yet';
  const createdAt = admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'Not available';
  const statusText = admin.is_active === false ? 'Inactive' : 'Active';

  return (
    <div className="flex flex-col gap-8 bg-theme-main font-sans selection:bg-theme-accent selection:text-white w-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Profile</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Current signed-in admin identity and security posture.</p>
        </div>
      </div>

      <div className="bg-theme-card relative overflow-hidden rounded-[32px] border border-white/40 shadow-sm p-6">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-theme-accent/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[40px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-[20px] shadow-sm border-[3px] border-white flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-theme-sidebar/50" />
                <span className="font-serif text-3xl font-black text-theme-text/80 z-10">
                  {String(fullName).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <BadgeCheck size={12} className="text-white" />
              </div>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-theme-text tracking-tight mb-1">
                {fullName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-4 py-2 bg-theme-accent/10 text-theme-accent rounded-xl text-[11px] font-black uppercase tracking-widest border border-theme-accent/20">
                  {role}
                </span>
                <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border ${statusText === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {statusText}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-theme-sidebar px-5 py-4 border border-white/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Profile Mode</p>
            <p className="text-sm font-black text-theme-text">{loading ? 'Refreshing...' : 'Read-only admin profile'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="bg-theme-card rounded-[40px] border border-white/40 shadow-sm p-8 flex flex-col gap-8">
          <h3 className="font-serif text-2xl font-black text-theme-text border-b border-theme-sidebar pb-4">Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <Field label="Full Name" icon={User} value={fullName} />
            <Field label="Role" icon={ShieldCheck} value={role} />
            <Field label="Email Contact" icon={Mail} value={email} />
            <Field label="Account Status" icon={BadgeCheck} value={statusText} />
            <Field label="Created On" icon={Clock} value={createdAt} />
            <Field label="Last Login" icon={Clock} value={lastLogin} />
          </div>
        </div>

        <div className="bg-theme-card rounded-[40px] border border-white/40 shadow-sm p-8 flex flex-col gap-6">
          <h3 className="font-serif text-xl font-black text-theme-text flex items-center gap-3">
            <Fingerprint size={24} className="text-theme-accent" /> Security
          </h3>

          <div className="p-5 bg-white rounded-[24px] border border-white/50 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-extrabold text-theme-text">Authentication Scope</span>
              <span className="text-[10px] font-black text-theme-muted uppercase tracking-wider">Protected</span>
            </div>
            <p className="text-[10px] font-bold text-theme-muted/80 mb-4">Dashboard access now uses the dedicated `admin_users` table and signed backend-issued bearer tokens.</p>
            <div className="w-full py-2.5 bg-theme-sidebar rounded-xl text-[10px] font-black uppercase tracking-widest text-theme-text border border-white/50 text-center">
              Backend-issued admin token
            </div>
          </div>

          <div className="p-5 bg-white rounded-[24px] border border-white/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <KeyRound size={18} className="text-theme-accent" />
              <span className="text-[11px] font-extrabold text-theme-text">Password Management</span>
            </div>
            <p className="text-[10px] font-bold text-theme-muted/80">Password rotation is not exposed in the dashboard yet. It is currently managed by the development team through the `admin_users` auth flow.</p>
          </div>

          <div className="p-5 bg-white rounded-[24px] border border-white/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <MapPin size={18} className="text-theme-accent" />
              <span className="text-[11px] font-extrabold text-theme-text">Admin Separation</span>
            </div>
            <p className="text-[10px] font-bold text-theme-muted/80">Residents and drivers stay in `public.users`. Dashboard staff are now stored separately in `public.admin_users` for tighter access control.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
