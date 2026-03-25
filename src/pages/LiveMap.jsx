import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Truck, Navigation, Gauge, Clock } from 'lucide-react';
import { truckAPI } from '../services/api';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EMPTY_DATA = { wards: [], activeTruck: null };

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

function VehicleDetails({ activeTruck, wards }) {
  if (!activeTruck) {
    return (
      <div className="bg-theme-card rounded-[32px] p-8 shadow-sm border border-white/40 text-center text-theme-muted font-medium">
        No live truck details available yet.
      </div>
    );
  }

  const assignedWard = wards.find((ward) => ward.trucks?.includes(activeTruck.id));

  return (
    <div className="bg-theme-card rounded-[32px] p-6 lg:p-8 shadow-sm border border-white/40 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div>
        <h4 className="text-[11px] font-black text-theme-muted uppercase mb-3 tracking-widest">Truck ID</h4>
        <p className="text-lg font-black text-theme-text">{activeTruck.id}</p>
      </div>
      <div>
        <h4 className="text-[11px] font-black text-theme-muted uppercase mb-3 tracking-widest">Driver</h4>
        <p className="text-lg font-black text-theme-text">{activeTruck.driverName || 'Unassigned'}</p>
      </div>
      <div>
        <h4 className="text-[11px] font-black text-theme-muted uppercase mb-3 tracking-widest">Assigned Ward</h4>
        <p className="text-lg font-black text-theme-text">{assignedWard?.name || 'Live Operations'}</p>
      </div>
      <div>
        <h4 className="text-[11px] font-black text-theme-muted uppercase mb-3 tracking-widest">Route Points</h4>
        <p className="text-lg font-black text-theme-text">{activeTruck.route?.length || 0}</p>
      </div>
    </div>
  );
}

export default function LiveMap() {
  const [data, setData] = React.useState(EMPTY_DATA);

  React.useEffect(() => {
    truckAPI.getAll()
      .then((response) => {
        setData({
          wards: Array.isArray(response?.wards) ? response.wards : [],
          activeTruck: response?.activeTruck || null
        });
      })
      .catch(() => setData(EMPTY_DATA));
  }, []);

  const { wards, activeTruck } = data;
  const routePath = Array.isArray(activeTruck?.route) ? activeTruck.route : [];
  const mapCenter = routePath[0] || [6.9145, 79.8650];
  const currentPoint = routePath[routePath.length - 1] || routePath[0] || null;

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Collection Progress</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Real-time vehicle tracking and route coordination</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
          <input type="text" placeholder="Search trucks, drivers, zones..." className="w-full pl-12 pr-4 py-3 bg-white border border-white/50 rounded-full text-sm font-bold text-theme-text placeholder-theme-muted/50 shadow-inner focus:ring-2 focus:ring-theme-accent transition-all outline-none" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        <div className="w-full lg:w-[350px] flex flex-col gap-4 overflow-y-auto pr-1 shrink-0">
          <h2 className="text-sm font-black text-theme-muted uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-theme-accent rounded-full" /> Collection Progress
          </h2>

          {wards.length === 0 ? (
            <div className="bg-theme-card p-5 rounded-[28px] shadow-sm border border-white/30 text-sm text-theme-muted">
              No live ward progress available yet.
            </div>
          ) : wards.map((ward) => (
            <div key={ward.id} className="bg-theme-card p-5 rounded-[28px] shadow-sm border border-white/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-theme-text text-sm leading-tight w-[70%]">{ward.name}</h3>
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
                {(ward.trucks || []).map((id) => (
                  <div key={id} className="flex justify-between items-center bg-white/40 p-3 rounded-2xl border border-white/30">
                    <span className="flex items-center gap-2 text-[11px] font-black text-theme-text"><Truck size={14} className="text-theme-accent" /> {id}</span>
                    <span className="text-[10px] text-theme-accent font-bold uppercase tracking-widest">In Service</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="h-[350px] lg:h-[400px] bg-theme-sidebar rounded-[40px] overflow-hidden border border-white/50 relative shadow-sm">
            <MapContainer center={mapCenter} zoom={15} className="h-full w-full z-0">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {routePath.length > 0 && <Polyline positions={routePath} color="var(--accent)" weight={6} opacity={0.8} lineCap="round" />}
              {currentPoint && (
                <Marker position={currentPoint}>
                  <Popup>
                    <span className="font-bold">{activeTruck?.id || 'Truck'}</span><br />
                    {activeTruck?.location || 'Current location unavailable'}
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {activeTruck && (
              <div className="absolute top-6 right-6 z-[1000] bg-white/90 text-theme-text p-4 rounded-3xl shadow-xl flex items-center gap-3 backdrop-blur-md border border-white">
                <div className="bg-theme-sidebar p-2.5 rounded-2xl text-theme-accent shadow-inner"><Truck size={20} /></div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest">{activeTruck.id}</p>
                  <p className="text-[10px] text-theme-muted font-bold tracking-tight">{activeTruck.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-theme-sidebar p-5 md:p-6 rounded-[32px] flex flex-wrap lg:flex-nowrap justify-between items-center shadow-inner border border-white/60 gap-4">
            <StatItem icon={<Navigation className="text-theme-accent" size={18} />} label="Current Location" value={activeTruck?.location || 'No live location'} sub="live from Supabase" />
            <StatItem icon={<Gauge className="text-theme-accent" size={18} />} label="Route Points" value={String(routePath.length)} sub="recent coordinates" />
            <StatItem icon={<Truck className="text-orange-500" size={18} />} label="Truck" value={activeTruck?.id || 'Unavailable'} sub={activeTruck?.driverName || 'No driver'} />
            <StatItem icon={<Clock className="text-theme-text" size={18} />} label="Ward Count" value={String(wards.length)} sub="active zones" />
          </div>

          <VehicleDetails activeTruck={activeTruck} wards={wards} />
        </div>
      </div>
    </div>
  );
}
