import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building2, ShieldCheck, 
  Globe, Smartphone, ShieldAlert, Save,
  BadgeCheck, Fingerprint
} from 'lucide-react';

const FormField = ({ label, icon: Icon, value, onChange, type = "text", isEditing }) => (
  <div className="flex flex-col gap-2 relative">
    <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
        <Icon size={16} className={isEditing ? 'text-theme-accent' : 'text-theme-text'} />
      </div>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full pl-12 pr-4 py-3.5 bg-theme-sidebar border rounded-2xl text-[13px] font-bold text-theme-text transition-all outline-none ${
          isEditing 
            ? 'border-white/60 focus:border-theme-accent shadow-inner focus:ring-4 focus:ring-theme-accent/10' 
            : 'border-white/30 opacity-80 cursor-default'
        }`}
      />
    </div>
  </div>
);

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Kasun Perera',
    email: 'kasun.p@cleansl.gov.lk',
    phone: '+94 11 268 1198',
    location: 'Colombo Central Office',
    department: 'IT Operations',
    role: 'System Administrator',
    language: 'English (UK)',
    joinDate: 'Jan 01, 2024',
    employeeId: 'EMP-4092',
    emergencyContact: '+94 77 123 4567'
  });

  const [securityInfo, setSecurityInfo] = useState({
    passwordAge: '92 days',
    is2FAEnabled: false,
    recoveryEmail: 'admin-backup@cleansl.gov.lk'
  });


  const handleSave = () => setIsEditing(false);

  return (
    <div className="flex flex-col gap-8 bg-theme-main font-sans selection:bg-theme-accent selection:text-white w-full pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Profile</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Manage your personal information and security</p>
        </div>
      </div>
      
      {/* Profile Hero Banner */}
      <div className="bg-theme-card relative overflow-hidden rounded-[32px] border border-white/40 shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-theme-accent/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[40px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-center gap-4">
           <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <div className="relative group cursor-pointer">
                 <div className="w-20 h-20 bg-white rounded-[20px] shadow-sm border-[3px] border-white flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                   <div className="absolute inset-0 bg-theme-sidebar/50" />
                   <span className="font-serif text-3xl font-black text-theme-text/80 z-10">
                     {personalInfo.fullName.charAt(0)}
                   </span>
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                   <BadgeCheck size={12} className="text-white" />
                 </div>
              </div>
              
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-theme-text tracking-tight mb-1">
                  {personalInfo.fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                   <span className="px-4 py-2 bg-theme-accent/10 text-theme-accent rounded-xl text-[11px] font-black uppercase tracking-widest border border-theme-accent/20">
                     {personalInfo.role}
                   </span>
                   <span className="flex items-center gap-1.5 text-xs font-bold text-theme-muted">
                     <Building2 size={14} /> {personalInfo.department}
                   </span>
                   <span className="flex items-center gap-1.5 text-xs font-bold text-theme-muted border-l border-theme-sidebar pl-3">
                     <MapPin size={14} /> {personalInfo.location}
                   </span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
               {isEditing ? (
                 <>
                   <button className="px-6 py-3 bg-white border border-white/50 text-theme-text rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-theme-sidebar transition-colors" onClick={() => setIsEditing(false)}>
                     Discard
                   </button>
                   <button className="flex items-center gap-2 px-6 py-3 bg-theme-text text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-theme-text/20 hover:opacity-90 hover:-translate-y-0.5 transition-all" onClick={handleSave}>
                     <Save size={14} /> Confirm
                   </button>
                 </>
               ) : (
                 <button className="flex items-center gap-2 px-8 py-4 bg-white border border-white/50 text-theme-text rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:border-theme-accent hover:shadow-md transition-all group" onClick={() => setIsEditing(true)}>
                   <User size={14} className="text-theme-accent group-hover:scale-110 transition-transform" /> Modify Details
                 </button>
               )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {/* Left Column: Personal Information & Settings */}
        <div className="flex flex-col gap-8 h-full">
           
           <div className="bg-theme-card rounded-[40px] border border-white/40 shadow-sm p-8 hover:border-theme-accent/30 transition-colors h-full flex flex-col">
              <h3 className="font-serif text-2xl font-black text-theme-text mb-8 border-b border-theme-sidebar pb-4">Identifier Registry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                 <FormField label="Full Name" icon={User} isEditing={isEditing} value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} />
                 <FormField label="Employee ID" icon={BadgeCheck} isEditing={isEditing} value={personalInfo.employeeId} onChange={e => setPersonalInfo({...personalInfo, employeeId: e.target.value})} />
                 <FormField label="Email Contact" icon={Mail} isEditing={isEditing} value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} />
                 <FormField label="Phone Number" icon={Phone} isEditing={isEditing} value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} />
                 <FormField label="Department" icon={Building2} isEditing={isEditing} value={personalInfo.department} onChange={e => setPersonalInfo({...personalInfo, department: e.target.value})} />
                 <FormField label="Office Location" icon={MapPin} isEditing={isEditing} value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} />
                 <FormField label="Emergency Contact" icon={Smartphone} isEditing={isEditing} value={personalInfo.emergencyContact} onChange={e => setPersonalInfo({...personalInfo, emergencyContact: e.target.value})} />
                 <FormField label="Language Pref" icon={Globe} isEditing={isEditing} value={personalInfo.language} onChange={e => setPersonalInfo({...personalInfo, language: e.target.value})} />
              </div>
           </div>
        </div>

        {/* Right Column: Security & Activity */}
        <div className="flex flex-col gap-8 h-full">
          
          <div className="bg-theme-card rounded-[40px] border border-white/40 shadow-sm p-8 flex flex-col gap-6 hover:border-theme-accent/30 transition-colors h-full">
            <h3 className="font-serif text-xl font-black text-theme-text flex items-center gap-3">
              <Fingerprint size={24} className="text-theme-accent" /> Security Hub
            </h3>
            
            <div className="p-5 bg-white rounded-[24px] border border-white/50 shadow-sm">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[11px] font-extrabold text-theme-text">Master Password</span>
                 <span className="text-[10px] font-black text-theme-muted uppercase tracking-wider">{securityInfo.passwordAge}</span>
               </div>
               <p className="text-[10px] font-bold text-theme-muted/80 mb-4">You should rotate your credentials periodically.</p>
               <button className="w-full py-2.5 bg-theme-sidebar rounded-xl text-[10px] font-black uppercase tracking-widest text-theme-text hover:bg-theme-accent hover:text-white transition-colors border border-white/50">
                 Rotate Keys
               </button>
            </div>

            <div className="p-5 bg-white rounded-[24px] border border-white/50 shadow-sm flex flex-col gap-4">
               <div className="flex justify-between items-center">
                 <div>
                   <span className="text-[11px] font-extrabold text-theme-text mb-0.5 block">2-Factor Auth</span>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${securityInfo.is2FAEnabled ? 'text-emerald-500' : 'text-red-400'}`}>
                     {securityInfo.is2FAEnabled ? 'Secured' : 'Vulnerable'}
                   </span>
                 </div>
                 <button onClick={() => setSecurityInfo(p => ({...p, is2FAEnabled: !p.is2FAEnabled}))} className="w-12 h-12 bg-theme-sidebar rounded-2xl flex items-center justify-center hover:scale-105 transition-transform border border-white/50">
                   {securityInfo.is2FAEnabled ? <ShieldCheck size={20} className="text-emerald-500" /> : <ShieldAlert size={20} className="text-red-400" />}
                 </button>
               </div>
            </div>

            <div className="p-5 bg-white rounded-[24px] border border-white/50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-theme-sidebar flex items-center justify-center rounded-[14px]">
                  <Smartphone size={16} className="text-indigo-500" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-theme-text block">Active Nodes</span>
                  <span className="text-[10px] font-bold text-theme-muted">2 Authorized</span>
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">Wipe All</button>
            </div>
          </div>


        </div>
      </div>

    </div>
  );
}
