import React from 'react';
import { Search, User, MapPin, Clock, Truck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { userAPI, truckAPI } from '../services/api';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SummaryCard = ({ title, value, sub }) => (
  <div className="bg-theme-sidebar p-5 rounded-2xl border border-white/30 shadow-sm flex flex-col gap-2">
    <h4 className="text-sm font-black text-theme-text">{title}</h4>
    <p className="text-2xl font-black text-theme-accent">{value}</p>
    <p className="text-[11px] font-bold text-theme-muted">{sub}</p>
  </div>
);

export default function FleetStatus() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [drivers, setDrivers] = React.useState([]);
  const [activeTruck, setActiveTruck] = React.useState(null);

  React.useEffect(() => {
    userAPI.getAll()
      .then((users) => {
        const liveDrivers = Array.isArray(users) ? users.filter((u) => u.role === 'driver') : [];
        setDrivers(liveDrivers);
      })
      .catch(() => setDrivers([]));

    truckAPI.getAll()
      .then((data) => setActiveTruck(data?.activeTruck || null))
      .catch(() => setActiveTruck(null));
  }, []);

  const filteredDrivers = drivers.filter((driver) => {
    const name = String(driver.full_name || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  const route = Array.isArray(activeTruck?.route) ? activeTruck.route : [];
  const routeCenter = route[0] || [6.9145, 79.8650];
  const routeEnd = route[route.length - 1] || null;

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-muted/10 pb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Drive Log Dashboard</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Live driver records from the backend</p>
        </div>

        <div className="relative flex-1 md:w-72 min-w-[200px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-muted" size={16} />
          <input type="text" placeholder="Search drivers" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-12 py-2.5 bg-theme-sidebar border border-white/40 rounded-full text-sm font-bold text-theme-text placeholder-theme-muted/60 focus:ring-2 focus:ring-theme-accent outline-none shadow-inner" />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-[2] flex flex-col gap-6 min-w-0">
          <div className="bg-theme-card rounded-[32px] border border-white/30 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-white/20 bg-theme-sidebar/50">
              <h3 className="text-lg font-black text-theme-text">Live Driver List</h3>
              <span className="text-xs font-bold text-theme-muted">{filteredDrivers.length} drivers</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-theme-sidebar">
                  <tr className="text-[9px] uppercase font-black text-theme-muted tracking-[0.2em] border-b border-white/20">
                    <th className="px-3 pl-6 py-4">Driver</th>
                    <th className="px-3 py-4 text-center">Phone</th>
                    <th className="px-3 py-4 text-center">Email</th>
                    <th className="px-3 py-4">Location</th>
                    <th className="px-3 py-4">Role</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-theme-muted font-medium italic">No live drivers found.</td>
                    </tr>
                  ) : filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-white/10 hover:bg-theme-sidebar transition-colors">
                      <td className="px-3 pl-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-theme-accent/10 border border-theme-accent/30 text-theme-accent text-[10px] font-black tracking-widest shrink-0 shadow-sm">
                          {String(driver.full_name || 'D').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-theme-text">{driver.full_name || 'Unnamed Driver'}</p>
                          <p className="text-[10px] text-theme-accent font-bold tracking-tighter">{driver.id}</p>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center text-xs font-bold text-theme-text">{driver.phone_number || '-'}</td>
                      <td className="px-3 py-4 text-center text-xs font-bold text-theme-text">{driver.email || '-'}</td>
                      <td className="px-3 py-4 text-xs font-bold text-theme-text">{driver.location || 'Unknown'}</td>
                      <td className="px-3 py-4 text-xs font-bold text-theme-accent uppercase">{driver.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-theme-card rounded-[32px] p-6 shadow-sm border border-white/30">
            <h3 className="font-serif font-black text-xl text-theme-text mb-4">Driver GPS Location Tracking</h3>
            <div className="h-[400px] w-full rounded-[24px] overflow-hidden border border-white shadow-inner relative z-0">
              <MapContainer center={routeCenter} zoom={14} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {route.length > 0 && <Polyline positions={route} color="var(--accent)" weight={6} opacity={0.6} lineCap="round" />}
                {routeEnd && (
                  <Marker position={routeEnd}>
                    <Popup>
                      <div className="min-w-[180px]">
                        <p className="text-xs font-black text-theme-text">{activeTruck?.driverName || 'Driver'}</p>
                        <p className="text-[10px] text-theme-muted font-bold">{activeTruck?.id || 'Truck'}</p>
                        <p className="text-[10px] text-theme-muted mt-2">{activeTruck?.location || 'No location label'}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
          <SummaryCard title="Total Drivers" value={drivers.length} sub="live user rows" />
          <SummaryCard title="Visible Drivers" value={filteredDrivers.length} sub="current search filter" />
          <SummaryCard title="Live Route Points" value={route.length} sub="latest truck history" />
          <div className="bg-theme-card p-5 rounded-[24px] shadow-sm border border-white/30">
            <h4 className="font-serif font-black text-theme-text opacity-90 mb-4">Active Route Snapshot</h4>
            {activeTruck ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3"><Truck size={16} className="text-theme-accent" /> <span className="font-bold text-theme-text">{activeTruck.id}</span></div>
                <div className="flex items-center gap-3"><User size={16} className="text-theme-accent" /> <span className="font-bold text-theme-text">{activeTruck.driverName || 'Unknown driver'}</span></div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-theme-accent" /> <span className="font-bold text-theme-text">{activeTruck.location || 'Unknown location'}</span></div>
                <div className="flex items-center gap-3"><Clock size={16} className="text-theme-accent" /> <span className="font-bold text-theme-text">{route.length} route points available</span></div>
              </div>
            ) : (
              <p className="text-theme-muted font-medium">No live truck route available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
