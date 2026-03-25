import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Search, Calendar, Download, Users, Truck, Recycle } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const AnalyticsCard = ({ title, value, trend, icon, color }) => (
  <div className="bg-theme-card p-6 rounded-[32px] shadow-sm border border-white/40 flex-1 flex justify-between items-center group hover:border-theme-accent transition-all min-w-[250px]">
    <div>
      <p className="text-[10px] font-black text-theme-muted uppercase tracking-[0.15em] mb-2">{title}</p>
      <h3 className="text-3xl font-black text-theme-text">{value}</h3>
      <p className="text-[11px] font-bold text-theme-accent mt-1">{trend} <span className="text-theme-muted/50">vs last month</span></p>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-inner`}>
      {icon}
    </div>
  </div>
);

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState('collection'); // 'collection', 'driver', 'user'
  const [analyticsData, setAnalyticsData] = useState({
    totals: {
      waste: { value: "0 tons", trend: "+0%" },
      pickups: { value: "0", trend: "+0%" },
      users: { value: "0", trend: "+0%" }
    },
    monthlyTrends: [],
    wasteDistribution: [],
    driverPerformance: [],
    userGrowth: []
  });
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [trends, waste, dashboard] = await Promise.all([
          analyticsAPI.getMonthlyTrends().catch(() => []),
          analyticsAPI.getWasteDistribution().catch(() => []),
          analyticsAPI.getDashboardStats().catch(() => null)
        ]);

        setAnalyticsData(prev => ({
          ...prev,
          monthlyTrends: trends,
          wasteDistribution: waste,
          totals: {
            waste: { value: "348 tons", trend: "+12%" }, // Mock fallback
            pickups: { value: dashboard?.stats?.totalPickups || "1,245", trend: "+8%" },
            users: { value: "2,841", trend: "+3%" }
          }
        }));
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleExportCSV = () => {
    let csvContent = "";
    
    csvContent += "=== Summary ===\n";
    csvContent += `Metric,Value,Trend\n`;
    // Removing commas from values if they contain commas (e.g. "1,245")
    const cleanValue = (val) => String(val).replace(/,/g, '');
    csvContent += `Waste Collected,${cleanValue(analyticsData.totals.waste.value)},${analyticsData.totals.waste.trend}\n`;
    csvContent += `Total Pickups,${cleanValue(analyticsData.totals.pickups.value)},${analyticsData.totals.pickups.trend}\n`;
    csvContent += `Active Users,${cleanValue(analyticsData.totals.users.value)},${analyticsData.totals.users.trend}\n\n`;

    if (analyticsData.monthlyTrends?.length) {
      csvContent += "=== Monthly Trends ===\n";
      csvContent += "Period,Value\n";
      analyticsData.monthlyTrends.forEach(row => {
        csvContent += `${row.name},${row.value}\n`;
      });
      csvContent += "\n";
    }

    if (analyticsData.wasteDistribution?.length) {
      csvContent += "=== Waste Distribution ===\n";
      csvContent += "Category,Value\n";
      analyticsData.wasteDistribution.forEach(row => {
        csvContent += `${row.name},${row.value}\n`;
      });
      csvContent += "\n";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-theme-main p-8 h-full overflow-y-auto font-sans selection:bg-theme-accent selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <div className="relative flex-1 md:w-72 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
            <input type="text" placeholder="Reports & Analytics" className="w-full pl-12 pr-4 py-3 bg-white border border-white/50 rounded-full text-sm font-bold text-theme-text placeholder-theme-muted/50 shadow-inner outline-none focus:ring-2 focus:ring-theme-accent transition-all" />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-2xl text-xs font-black text-theme-muted hover:text-theme-text border border-white/50 shadow-sm transition-all flex-1 md:flex-none"><Calendar size={16}/> This Month</button>
          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-accent rounded-2xl text-xs font-black text-white shadow-md hover:opacity-90 transition-all flex-1 md:flex-none"><Download size={16}/> Export</button>
        </div>
      </div>

      {/* Top Banner Stats */}
      <div className="flex flex-wrap gap-6">
        <AnalyticsCard title="Waste Collected" value={analyticsData.totals.waste.value} trend={analyticsData.totals.waste.trend} icon={<Recycle size={24}/>} color="bg-theme-sidebar text-theme-accent border border-white/50" />
        <AnalyticsCard title="Total Pickups" value={analyticsData.totals.pickups.value} trend={analyticsData.totals.pickups.trend} icon={<Truck size={24}/>} color="bg-theme-sidebar text-theme-accent border border-white/50" />
        <AnalyticsCard title="Active Users" value={analyticsData.totals.users.value} trend={analyticsData.totals.users.trend} icon={<Users size={24}/>} color="bg-theme-sidebar text-theme-accent border border-white/50" />
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <TabButton label="Collection Analytics" active={activeTab === 'collection'} onClick={() => setActiveTab('collection')} />
        <TabButton label="Driver Performance" active={activeTab === 'driver'} onClick={() => setActiveTab('driver')} />
        <TabButton label="User Growth" active={activeTab === 'user'} onClick={() => setActiveTab('user')} />
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === 'collection' && <CollectionAnalyticsView trends={analyticsData.monthlyTrends} waste={analyticsData.wasteDistribution} />}
        {activeTab === 'driver' && <DriverPerformanceView drivers={analyticsData.driverPerformance} />}
        {activeTab === 'user' && <UserGrowthView />}
      </div>
    </div>
  );
}

// --- SUB-VIEWS ---

const CollectionAnalyticsView = ({ trends = [], waste = [] }) => {
  const defaultTrends = [
    { name: 'Dec 01', value: 8 }, { name: 'Dec 05', value: 16 },
    { name: 'Dec 10', value: 13 }, { name: 'Dec 15', value: 5 },
    { name: 'Dec 20', value: 20 }, { name: 'Dec 25', value: 10 },
    { name: 'Dec 30', value: 18 }
  ];

  const defaultWaste = waste.length > 0 ? waste : [
    { name: 'Plastic', value: 35, fill: '#2D5A27' },
    { name: 'Paper', value: 25, fill: '#5DAE54' },
    { name: 'Metal', value: 15, fill: '#A3D99F' },
    { name: 'E-waste', value: 15, fill: '#E9F2E8' },
    { name: 'Others', value: 10, fill: '#CBD5E1' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full pb-8">
      <div className="xl:col-span-2 bg-theme-card p-8 rounded-[40px] shadow-sm border border-white/40">
        <h4 className="font-black text-theme-muted mb-8 uppercase text-xs tracking-widest flex items-center gap-2"><div className="w-2 h-2 bg-theme-accent rounded-full"/> Monthly Collection Trends</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultTrends}>
              <defs>
                <linearGradient id="colorValAna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.4} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)'}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorValAna)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-theme-card p-8 rounded-[40px] shadow-sm border border-white/40 flex flex-col min-h-[400px]">
        <h4 className="font-black text-theme-muted mb-4 uppercase text-xs tracking-widest">Waste Category Distribution</h4>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={defaultWaste} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {defaultWaste.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DriverPerformanceView = ({ drivers = [] }) => {
  const USER_GROWTH = [
    { month: 'Jan', total: 800 }, { month: 'Mar', total: 950 }, 
    { month: 'Jun', total: 1100 }, { month: 'Sep', total: 1200 }, { month: 'Nov', total: 1264 }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-theme-card p-8 rounded-[40px] shadow-sm border border-white/40">
        <h4 className="font-black text-theme-muted mb-8 uppercase text-xs tracking-widest flex items-center gap-2"><Users size={16} className="text-theme-accent"/> User Growth Over Time</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={USER_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.4} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)'}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={4} dot={{ r: 6, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
        {drivers.length > 0 && (
          <StatBox label="Tracked Drivers" value={drivers.length.toString()} sub="live performance data" />
        )}
        <StatBox label="Total Users" value="1,264" sub="+419 new this year" />
        <StatBox label="Avg. Monthly Growth" value="+38" sub="3.1% growth rate" />
        <StatBox label="Retention Rate" value="89%" sub="+2.3% vs last quarter" />
      </div>
    </div>
  );
};

const UserGrowthView = () => {
  const USER_GROWTH = [
    { month: 'Jan', total: 800 }, { month: 'Mar', total: 950 }, 
    { month: 'Jun', total: 1100 }, { month: 'Sep', total: 1200 }, { month: 'Nov', total: 1264 }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-theme-card p-8 rounded-[40px] shadow-sm border border-white/40">
        <h4 className="font-black text-theme-muted mb-8 uppercase text-xs tracking-widest flex items-center gap-2"><Users size={16} className="text-theme-accent"/> User Growth Over Time</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={USER_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.4} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)'}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={4} dot={{ r: 6, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
        <StatBox label="Total Users" value="1,264" sub="+419 new this year" />
        <StatBox label="Avg. Monthly Growth" value="+38" sub="3.1% growth rate" />
        <StatBox label="Retention Rate" value="89%" sub="+2.3% vs last quarter" />
      </div>
    </div>
  );
};

// --- HELPERS ---

const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap
      ${active ? 'bg-theme-accent text-white shadow-md' : 'bg-theme-card text-theme-muted border border-white/40 hover:bg-theme-sidebar'}`}
  >
    {label}
  </button>
);

const StatBox = ({ label, value, sub }) => (
  <div className="bg-theme-card p-6 rounded-[30px] border border-white/40 text-center shadow-sm">
    <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-2">{label}</p>
    <p className="text-3xl font-black text-theme-text">{value}</p>
    <p className="text-[10px] font-bold text-theme-accent mt-1 uppercase">{sub}</p>
  </div>
);
