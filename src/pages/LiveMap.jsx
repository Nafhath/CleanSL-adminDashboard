import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Search, 
  Truck, 
  Navigation, 
  Gauge, 
  Trash2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

// Local Assets
import truckImg from '../images/truck.png';

// Import from mockData
import { WARDS_DATA, ACTIVE_TRUCK } from '../data/mockData';
import { truckAPI } from '../services/api';

// Fix for Leaflet marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPONENTS ---

const StatItem = ({ icon, label, value, sub }) => (
  <div className="flex items-center gap-3 flex-1 min-w-[140px]">
    <div className="bg-white/60 p-2.5 rounded-xl shadow-inner border border-white/40 flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider leading-tight">{label}</p>
      <p className="text-[13px] font-black text-theme-text truncate">{value}</p>
      <p className="text-[9px] font-bold text-theme-muted/70 leading-tight uppercase">{sub}</p>
    </div>
  </div>
);

const VehicleDetails = () => (
  <div className="bg-theme-card rounded-[32px] p-6 lg:p-8 shadow-sm border border-white/40 flex flex-col lg:flex-row gap-8 items-start">
    <div className="w-full lg:w-1/4">
      <h4 className="text-[11px] font-black text-theme-muted uppercase mb-3 tracking-widest">Route Info</h4>
      <div className="h-40 w-full bg-theme-sidebar rounded-3xl flex items-center justify-center border border-white/50 shadow-inner overflow-hidden">
        <img src={truckImg} alt="Collection Truck" className="w-full h-full object-contain mix-blend-multiply p-4" />
      </div>
    </div>

    <div className="w-full lg:flex-1 lg:border-l border-white/40 lg:pl-8">
      <h4 className="text-[11px] font-black text-theme-accent uppercase mb-4 pb-2 border-b border-theme-accent/30 inline-block tracking-widest">Vehicle Status</h4>
      <div className="space-y-5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-theme-muted font-bold">Vehicle Model</span>
          <span className="font-black text-theme-text">Isuzu Giga Compactor</span>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="text-theme-muted font-bold">Waste Load</span>
            <span className="font-black text-theme-accent">65% <span className="text-theme-muted/50">/ 100%</span></span>
          </div>
          <div className="w-full bg-white/50 border border-white/30 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div className="bg-theme-accent h-full rounded-full shadow-sm" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>

    <div className="w-full lg:flex-1 lg:border-l border-white/40 lg:pl-8">
      <h4 className="text-[11px] font-black text-theme-muted uppercase mb-4 tracking-widest">Driver Profile</h4>
      <div className="space-y-4 text-xs">
        <div className="flex justify-between items-center bg-white/30 p-3 rounded-xl border border-white/20">
          <span className="text-theme-muted font-bold text-[11px] uppercase tracking-wider">Net Weight</span>
          <span className="font-black text-theme-text text-sm">4,250 kg</span>
        </div>
        <div className="flex justify-between items-center bg-white/30 p-3 rounded-xl border border-white/20">
          <span className="text-theme-muted font-bold text-[11px] uppercase tracking-wider">Registration No.</span>
          <span className="font-black text-theme-text uppercase tracking-widest border-b border-theme-text/20">WP NA-4589</span>
        </div>
      </div>
    </div>

    <div className="w-full lg:w-1/5 lg:border-l border-white/40 lg:pl-8 lg:text-right">
      <h4 className="text-[11px] font-black text-theme-muted uppercase mb-4 tracking-widest">AI Logs</h4>
      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 flex-wrap">
        <span className="bg-red-50 text-red-600 text-[10px] px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 border border-red-100 shadow-sm uppercase tracking-wider">
          <AlertTriangle size={12}/> Violation Detected
        </span>
        <span className="bg-theme-main text-theme-accent text-[10px] px-3 py-1.5 rounded-xl font-black border border-white/50 shadow-sm uppercase tracking-wider">
          Route Optimized
        </span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function LiveMap() {
  const [wards, setWards] = React.useState(WARDS_DATA);
  const [activeTruck, setActiveTruck] = React.useState(ACTIVE_TRUCK);

  React.useEffect(() => {
    // Attempt to load live truck and ward coordination data, fallback to mock
    truckAPI.getAll().then(data => {
      if (data?.wards) setWards(data.wards);
      if (data?.activeTruck) setActiveTruck(data.activeTruck);
    }).catch(e => console.log('Using mock live map data', e));
  }, []);

  const routePath = activeTruck.route;
  const trucksData = [
    { id: activeTruck.id, lat: activeTruck.route[0][0], lng: activeTruck.route[0][1], location: activeTruck.location },
  ];

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Collection Progress</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Real-time vehicle tracking and route coordination</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search trucks, drivers, zones..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-white/50 rounded-full text-sm font-bold text-theme-text placeholder-theme-muted/50 shadow-inner focus:ring-2 focus:ring-theme-accent transition-all outline-none" 
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        
        {/* LEFT: Progress Sidebar */}
        <div className="w-full lg:w-[350px] flex flex-col gap-4 overflow-y-auto pr-1 shrink-0">
          <h2 className="text-sm font-black text-theme-muted uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-theme-accent rounded-full"/> Collection Progress
          </h2>
          
          {wards.map(ward => (
            <div key={ward.id} className="bg-theme-card p-5 rounded-[28px] shadow-sm border border-white/30 hover:border-theme-accent transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-theme-text text-sm leading-tight w-[70%] group-hover:text-theme-accent transition-colors">{ward.name}</h3>
                <div className="relative w-11 h-11 shrink-0">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeDasharray={`${ward.progress}, 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-theme-text">{ward.progress}%</span>
                </div>
              </div>
              <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-inner ${ward.status === 'Completed' ? 'bg-[#D1FAE5] text-[#2D5A27] border border-[#A3D99F]' : 'bg-theme-sidebar text-theme-muted border border-white/50'}`}>
                {ward.status}
              </span>
              <div className="mt-5 space-y-2">
                {ward.trucks.map(id => (
                  <div key={id} className="flex justify-between items-center bg-white/40 p-3 rounded-2xl border border-white/30 group-hover:bg-white/60 transition-colors">
                    <span className="flex items-center gap-2 text-[11px] font-black text-theme-text"><Truck size={14} className="text-theme-accent"/> Truck {id}</span>
                    <span className="text-[10px] text-theme-accent font-bold uppercase tracking-widest">In Service</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Map & Details */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Main Map */}
          <div className="h-[350px] lg:h-[400px] bg-theme-sidebar rounded-[40px] overflow-hidden border border-white/50 relative shadow-sm">
            <MapContainer center={[6.9145, 79.8650]} zoom={15} className="h-full w-full z-0">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline positions={routePath} color="var(--accent)" weight={6} opacity={0.8} lineCap="round" />
              {trucksData.map(truck => (
                <Marker key={truck.id} position={[truck.lat, truck.lng]}>
                  <Popup><span className="font-bold">Truck {truck.id}</span><br/>{truck.location}</Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Overlay Label Top Right */}
            <div className="absolute top-6 right-6 z-[1000] bg-white/90 text-theme-text p-4 rounded-3xl shadow-xl flex items-center gap-3 backdrop-blur-md border border-white">
               <div className="bg-theme-sidebar p-2.5 rounded-2xl text-theme-accent shadow-inner"><Truck size={20}/></div>
               <div>
                 <p className="text-[11px] font-black uppercase tracking-widest">Truck {activeTruck.id}</p>
                 <p className="text-[10px] text-theme-muted font-bold tracking-tight">{activeTruck.location}</p>
               </div>
            </div>
          </div>

          {/* Stat Panel */}
          <div className="bg-theme-sidebar p-5 md:p-6 rounded-[32px] flex flex-wrap lg:flex-nowrap justify-between items-center shadow-inner border border-white/60 gap-4">
            <StatItem icon={<Navigation className="text-theme-accent" size={18}/>} label="Current Location" value={activeTruck.location} sub="Ward 07: Cinnamon Gardens" />
            <StatItem icon={<Gauge className="text-theme-accent" size={18}/>} label="Speed" value={activeTruck.location.includes('km/h') ? activeTruck.location.split('(')[1].replace(')', '') : '32 km/hr'} sub="Steady Speed" />
            <StatItem icon={<Trash2 className="text-orange-500" size={18}/>} label="Bin Capacity" value="65% Full" sub="Alert at 90%" />
            <StatItem icon={<Clock className="text-theme-text" size={18}/>} label="Shift Time" value="4h 30m Active" sub="Ends 4:30 PM" />
          </div>

          <VehicleDetails />
        </div>
      </div>
    </div>
  );
}