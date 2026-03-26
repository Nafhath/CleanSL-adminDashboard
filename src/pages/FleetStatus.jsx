import React from 'react';
import { Search, User, MapPin, Clock, Truck, FileAudio2, Filter, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { driverReportAPI, userAPI, truckAPI } from '../services/api';
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

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  marked: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
};

const normalizeStatus = (status) => String(status || 'pending').toLowerCase();

const formatDateTime = (value) => {
  if (!value) return 'Unknown time';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export default function FleetStatus() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [drivers, setDrivers] = React.useState([]);
  const [activeTruck, setActiveTruck] = React.useState(null);
  const [reports, setReports] = React.useState([]);
  const [reportStatusFilter, setReportStatusFilter] = React.useState('all');
  const [reportDecisionFilter, setReportDecisionFilter] = React.useState('all');
  const [isRefreshingReports, setIsRefreshingReports] = React.useState(false);
  const [updatingReportId, setUpdatingReportId] = React.useState(null);

  const loadDriversAndTruck = React.useCallback(() => {
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

  const loadReports = React.useCallback(async () => {
    setIsRefreshingReports(true);
    try {
      const data = await driverReportAPI.getAll();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    } finally {
      setIsRefreshingReports(false);
    }
  }, []);

  React.useEffect(() => {
    loadDriversAndTruck();
    loadReports();
  }, [loadDriversAndTruck, loadReports]);

  const filteredDrivers = React.useMemo(() => (
    drivers.filter((driver) => {
      const haystack = [
        driver.full_name,
        driver.phone_number,
        driver.email,
        driver.location
      ].join(' ').toLowerCase();
      return haystack.includes(searchTerm.toLowerCase());
    })
  ), [drivers, searchTerm]);

  const driverMap = React.useMemo(() => (
    Object.fromEntries(drivers.map((driver) => [String(driver.id), driver]))
  ), [drivers]);

  const filteredReports = React.useMemo(() => (
    reports.filter((report) => {
      const status = normalizeStatus(report.status);
      if (reportStatusFilter !== 'all' && status !== reportStatusFilter) return false;
      if (reportDecisionFilter !== 'all') {
        if (reportDecisionFilter === 'needs-review' && status !== 'pending') return false;
        if (reportDecisionFilter === 'reviewed' && status === 'pending') return false;
      }

      const linkedDriver = driverMap[String(report.driver_id)] || {};
      const haystack = [
        report.transcription,
        report.lane_name,
        report.file_name,
        linkedDriver.full_name,
        linkedDriver.phone_number
      ].join(' ').toLowerCase();

      return haystack.includes(searchTerm.toLowerCase());
    })
  ), [reports, reportStatusFilter, reportDecisionFilter, searchTerm, driverMap]);

  const route = Array.isArray(activeTruck?.route) ? activeTruck.route : [];
  const routeCenter = route[0] || [6.9145, 79.8650];
  const routeEnd = route[route.length - 1] || null;

  const pendingReports = reports.filter((report) => normalizeStatus(report.status) === 'pending').length;
  const markedReports = reports.filter((report) => normalizeStatus(report.status) === 'marked').length;
  const cancelledReports = reports.filter((report) => normalizeStatus(report.status) === 'cancelled').length;

  const updateReportStatus = async (reportId, nextStatus) => {
    setUpdatingReportId(reportId);
    try {
      const updated = await driverReportAPI.updateStatus(reportId, nextStatus);
      setReports((current) => current.map((report) => (
        report.id === reportId ? { ...report, ...updated } : report
      )));
    } catch {
      // handled by API helper console + auth redirect
    } finally {
      setUpdatingReportId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-muted/10 pb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Drive Log Dashboard</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Live driver records and submitted driver voice reports</p>
        </div>

        <div className="relative flex-1 md:w-72 min-w-[220px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-muted" size={16} />
          <input
            type="text"
            placeholder="Search drivers, lanes, transcripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-12 py-2.5 bg-theme-sidebar border border-white/40 rounded-full text-sm font-bold text-theme-text placeholder-theme-muted/60 focus:ring-2 focus:ring-theme-accent outline-none shadow-inner"
          />
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

          <div className="bg-theme-card rounded-[32px] border border-white/30 shadow-sm overflow-hidden">
            <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/20 bg-theme-sidebar/50">
              <div>
                <h3 className="text-lg font-black text-theme-text flex items-center gap-2">
                  <FileAudio2 size={18} className="text-theme-accent" />
                  Driver Report Review
                </h3>
                <p className="text-xs font-medium text-theme-muted mt-1">Review uploaded audio reports, transcripts, and mark outcomes.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={14} />
                  <select
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-white/40 rounded-full text-xs font-black text-theme-text shadow-sm outline-none"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="marked">Marked</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <select
                  value={reportDecisionFilter}
                  onChange={(e) => setReportDecisionFilter(e.target.value)}
                  className="appearance-none px-4 py-2.5 bg-white border border-white/40 rounded-full text-xs font-black text-theme-text shadow-sm outline-none"
                >
                  <option value="all">All review states</option>
                  <option value="needs-review">Needs review</option>
                  <option value="reviewed">Reviewed only</option>
                </select>

                <button
                  type="button"
                  onClick={loadReports}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-theme-accent text-white rounded-full text-xs font-black shadow-sm"
                >
                  <RefreshCw size={14} className={isRefreshingReports ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {filteredReports.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-theme-muted/30 bg-theme-sidebar/40 px-6 py-10 text-center text-theme-muted font-medium italic">
                  No driver reports match the current filters.
                </div>
              ) : filteredReports.map((report) => {
                const driver = driverMap[String(report.driver_id)] || null;
                const reportStatus = normalizeStatus(report.status);
                return (
                  <div key={report.id} className="rounded-[28px] border border-white/30 bg-theme-sidebar/40 p-5 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wide ${statusStyles[reportStatus] || statusStyles.pending}`}>
                            {reportStatus}
                          </span>
                          <span className="text-[11px] font-black text-theme-muted uppercase tracking-wide">
                            {formatDateTime(report.created_at)}
                          </span>
                          {report.lane_name ? (
                            <span className="text-[11px] font-black text-theme-accent uppercase tracking-wide">
                              {report.lane_name}
                            </span>
                          ) : null}
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-white/70 border border-white/60 p-4">
                            <p className="text-[11px] font-black uppercase tracking-wide text-theme-muted mb-2">Driver</p>
                            <p className="font-black text-theme-text">{driver?.full_name || 'Unknown driver'}</p>
                            <p className="text-xs font-bold text-theme-muted mt-1">{driver?.phone_number || report.driver_id || '-'}</p>
                          </div>
                          <div className="rounded-2xl bg-white/70 border border-white/60 p-4">
                            <p className="text-[11px] font-black uppercase tracking-wide text-theme-muted mb-2">Task Context</p>
                            <p className="font-black text-theme-text">{report.task_id || 'No linked task id'}</p>
                            <p className="text-xs font-bold text-theme-muted mt-1">
                              House {report.house_number ?? '-'} {report.file_name ? `• ${report.file_name}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-white/70 border border-white/60 p-4">
                          <p className="text-[11px] font-black uppercase tracking-wide text-theme-muted mb-2">Transcript</p>
                          <p className="text-sm font-medium leading-6 text-theme-text">
                            {report.transcription || 'No transcription available yet.'}
                          </p>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
                          <div className="flex-1">
                            {report.audio_url ? (
                              <audio controls className="w-full max-w-xl">
                                <source src={report.audio_url} />
                                Your browser does not support audio playback.
                              </audio>
                            ) : (
                              <p className="text-xs font-bold text-theme-muted italic">No audio URL available for this report.</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="text-[11px] font-black uppercase tracking-wide text-theme-muted">Review</label>
                            <select
                              value={reportStatus}
                              disabled={updatingReportId === report.id}
                              onChange={(e) => updateReportStatus(report.id, e.target.value)}
                              className="appearance-none px-4 py-2.5 bg-white border border-white/50 rounded-full text-xs font-black text-theme-text shadow-sm outline-none disabled:opacity-60"
                            >
                              <option value="pending">Pending</option>
                              <option value="marked">Marked</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
          <SummaryCard title="Total Drivers" value={drivers.length} sub="live user rows" />
          <SummaryCard title="Visible Drivers" value={filteredDrivers.length} sub="current search filter" />
          <SummaryCard title="Live Route Points" value={route.length} sub="latest truck history" />
          <SummaryCard title="Pending Reports" value={pendingReports} sub="awaiting admin review" />
          <SummaryCard title="Marked Reports" value={markedReports} sub="reviewed and accepted" />
          <SummaryCard title="Cancelled Reports" value={cancelledReports} sub="reviewed and dismissed" />

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
