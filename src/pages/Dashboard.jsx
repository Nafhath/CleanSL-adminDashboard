import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Map, FileText, AlertTriangle, Truck, 
  PieChart, Settings as SettingsIcon, User, Search, 
  Calendar, LogOut
} from 'lucide-react';

// --- Reusable Navigation Item ---
const NavItem = ({ icon, label, to, active }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl transition-all ${
        active 
          ? 'bg-theme-accent text-white shadow-md font-bold' 
          : 'text-theme-text hover:bg-theme-card hover:text-theme-accent font-medium'
      }`}
    >
      <div className={`${active ? 'text-white' : 'text-theme-muted'}`}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
};

const Dashboard = ({ onLogout }) => {
  const [timeRange, setTimeRange] = useState('Month');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isOverview = location.pathname === '/';

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
  }, []);

  const currentPeriodLabel = React.useMemo(() => {
    const now = new Date();

    if (timeRange === 'Day') {
      return now.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    if (timeRange === 'Week') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return `${start.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })} - ${end.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}`;
    }

    if (timeRange === 'Year') {
      return now.getFullYear().toString();
    }

    return now.toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric'
    });
  }, [timeRange]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authchange'));
    onLogout?.();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-theme-main font-sans text-theme-text selection:bg-theme-accent selection:text-white overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-[280px] bg-theme-sidebar flex flex-col p-6 m-4 rounded-[40px] shadow-sm border border-white/50 shrink-0 h-[calc(100vh-2rem)]">
        <div className="flex justify-center items-center -mt-2 mb-4 px-2 cursor-pointer hover:opacity-80 transition-opacity">
          <img 
            src="/logo.png" 
            alt="CleanSL Logo" 
            className="w-32 h-auto object-contain drop-shadow-sm" 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233EC0A0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2'/%3E%3C/svg%3E"; 
            }}
          />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutGrid size={20} />} label="Overview" to="/" active={isOverview} />
          <NavItem icon={<Map size={20} />} label="Collection Progress" to="/live-map" active={location.pathname === '/live-map'} />
          <NavItem icon={<Truck size={20} />} label="Driver Log" to="/driver-log" active={location.pathname === '/driver-log'} />
          <NavItem icon={<FileText size={20} />} label="Complaints" to="/complaints" active={location.pathname === '/complaints'} />
          <NavItem icon={<AlertTriangle size={20} />} label="Violations" to="/violations" active={location.pathname === '/violations'} />
          <NavItem icon={<PieChart size={20} />} label="Analytics" to="/analytics" active={location.pathname === '/analytics'} />
        </nav>

        <div className="mt-8 pt-8 border-t border-theme-card space-y-1">
          <NavItem icon={<SettingsIcon size={20} />} label="Settings" to="/settings" active={location.pathname === '/settings'} />
          <NavItem icon={<User size={20} />} label="Profile" to="/profile" active={location.pathname === '/profile'} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden py-4 pr-4">
        
        {/* TOP HEADER */}
        <header className="h-20 flex items-center justify-between px-6 shrink-0 rounded-[32px] mb-4 bg-theme-card border border-white/40">
          <h2 className="text-3xl font-serif text-theme-text pr-4">
            Good Morning, <span className="text-theme-accent font-sans font-bold text-2xl">
              {user?.name || user?.firstName || user?.email?.split('@')[0] || 'User'}
            </span>
          </h2>
          
          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap custom-scrollbar pb-2 md:pb-0">
            <div className="relative shrink-0">
              <input 
                type="text" 
                placeholder="Dashboard..." 
                className="w-56 bg-theme-sidebar border border-white/40 text-sm rounded-full pl-6 pr-10 py-3 focus:ring-2 focus:ring-theme-accent focus:outline-none placeholder-theme-muted/50 font-bold shadow-inner transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-accent opacity-50" size={18} />
            </div>

            <div className="flex bg-theme-sidebar p-1.5 rounded-full border border-white/50 shadow-inner shrink-0">
              {['Day', 'Week', 'Month', 'Year'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${t === timeRange ? 'bg-theme-accent text-white shadow-md' : 'text-theme-muted hover:text-theme-text'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button 
              className="flex items-center gap-2 bg-theme-sidebar px-4 py-2 rounded-full text-xs font-bold text-theme-muted border border-white/50 shadow-sm hover:border-theme-accent transition-colors shrink-0"
              onClick={() => alert("Date picker functionality not configured")}
            >
              <Calendar size={14} className="text-theme-muted" />
              {currentPeriodLabel}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full text-xs font-bold text-red-600 border border-red-200 shadow-sm hover:bg-red-100 transition-colors shrink-0"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
