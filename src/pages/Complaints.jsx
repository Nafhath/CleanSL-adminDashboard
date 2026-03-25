import React from 'react';
import { Search, ChevronDown, Eye, MoreHorizontal, Clock, CheckCircle2, AlertCircle, XCircle, FileText, X, Trash2 } from 'lucide-react';
import { complaintAPI } from '../services/api';

const mapComplaintStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'reviewed' || normalized === 'in_progress' || normalized === 'in-progress') return 'In Progress';
  if (normalized === 'resolved') return 'Resolved';
  if (normalized === 'rejected' || normalized === 'closed') return 'Closed';
  return 'Pending';
};

const mapComplaintPriority = (priority) => {
  const normalized = String(priority || '').toLowerCase();
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'low') return 'Low';
  return 'Medium';
};

const normalizeComplaint = (complaint) => ({
  id: complaint.id,
  title: complaint.location_name || complaint.street_address || 'Resident Complaint',
  priority: mapComplaintPriority(complaint.priority || complaint.priority_level),
  description: complaint.complaint_text || complaint.description || complaint.authority_notes || 'No complaint description available.',
  customer: complaint.customer || complaint.full_name || complaint.resident_name || complaint.resident_id || 'Resident',
  category: complaint.category || complaint.prediction || complaint.material_label || 'General',
  date: complaint.created_at ? new Date(complaint.created_at).toISOString().split('T')[0] : 'Unknown date',
  status: mapComplaintStatus(complaint.status),
  assignedTo: complaint.assignedTo || complaint.assigned_to || null,
  imageUrl: complaint.photo_url || complaint.image_url || null
});

const PriorityBadge = ({ level }) => {
  const styles = {
    High: 'bg-orange-100 text-orange-600',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-blue-100 text-blue-600'
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ml-2 ${styles[level] || styles.Medium}`}>{level}</span>;
};

const StatusLabel = ({ status }) => {
  const icons = {
    Pending: <Clock size={12} className="text-orange-500" />,
    'In Progress': <AlertCircle size={12} className="text-blue-500" />,
    Resolved: <CheckCircle2 size={12} className="text-theme-accent" />,
    Closed: <XCircle size={12} className="text-theme-muted" />
  };
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-theme-muted">
      {icons[status] || icons.Pending} {status}
    </div>
  );
};

const ComplaintModal = ({ isOpen, onClose, complaint, onUpdateStatus }) => {
  const [localStatus, setLocalStatus] = React.useState(complaint?.status || 'Pending');

  React.useEffect(() => {
    if (complaint) setLocalStatus(complaint.status);
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleSave = () => {
    onUpdateStatus(complaint.id, localStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-theme-main/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-theme-sidebar border border-white/40 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/20 shrink-0">
          <h2 className="text-xl font-serif font-black text-theme-text">Complaint Details</h2>
          <button onClick={onClose} className="p-2 bg-theme-main text-theme-muted rounded-full hover:text-theme-accent transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-black text-theme-text tracking-tight">{complaint.title}</h3>
              <p className="text-xs text-theme-muted font-bold mt-1">ID: {complaint.id} • {complaint.date}</p>
            </div>
            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${complaint.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : complaint.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {complaint.priority} Priority
            </span>
          </div>

          <div className="bg-white/30 p-4 rounded-2xl border border-white/20 mb-6">
            <p className="text-xs text-theme-text font-medium leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-theme-main p-4 rounded-2xl shadow-inner border border-white/20">
              <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest block mb-1">Customer</span>
              <span className="text-xs font-bold text-theme-text break-all">{complaint.customer}</span>
            </div>
            <div className="bg-theme-main p-4 rounded-2xl shadow-inner border border-white/20">
              <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest block mb-1">Category</span>
              <span className="text-xs font-bold text-theme-text">{complaint.category}</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest block mb-3">Uploaded Evidence</span>
            <div className="min-h-48 w-full bg-theme-main rounded-2xl overflow-hidden border border-white/40 flex items-center justify-center">
              {complaint.imageUrl ? (
                <img src={complaint.imageUrl} alt="Evidence" className="w-full h-64 object-cover" />
              ) : (
                <span className="text-theme-muted text-sm font-medium">No evidence image uploaded.</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest block mb-3">Update Status</span>
            <select className="w-full appearance-none px-4 py-3 bg-white rounded-xl text-xs font-bold text-theme-text border border-white/50 shadow-inner outline-none focus:ring-2 focus:ring-theme-accent cursor-pointer" value={localStatus} onChange={(e) => setLocalStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 flex gap-4">
            <button className="flex-1 py-3 bg-theme-main text-theme-text text-xs font-black uppercase rounded-xl border border-white/40 hover:bg-white/50 transition-colors" onClick={onClose}>Cancel</button>
            <button className="flex-1 py-3 bg-theme-accent text-white text-xs font-black uppercase rounded-xl hover:opacity-90 transition-opacity shadow-md" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Complaints() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All Status');
  const [priorityFilter, setPriorityFilter] = React.useState('All Priority');
  const [complaints, setComplaints] = React.useState([]);
  const [stats, setStats] = React.useState([]);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
  const [activeDropdown, setActiveDropdown] = React.useState(null);

  const handleUpdateStatus = (id, newStatus) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedComplaint?.id === id) {
      setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  React.useEffect(() => {
    complaintAPI.getAll()
      .then((data) => setComplaints(Array.isArray(data) ? data.map(normalizeComplaint) : []))
      .catch(() => setComplaints([]));

    complaintAPI.getStats()
      .then((data) => setStats(Array.isArray(data) ? data : []))
      .catch(() => setStats([]));
  }, []);

  const filteredComplaints = React.useMemo(() => {
    return complaints.filter((item) => {
      const matchesSearch =
        String(item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.id || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'All Priority' || item.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter, complaints]);

  return (
    <div className="flex flex-col gap-6 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <ComplaintModal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} complaint={selectedComplaint} onUpdateStatus={handleUpdateStatus} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Complaint Management</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">Track and resolve customer complaints</p>
        </div>
        <div className="flex items-center bg-theme-sidebar px-4 py-2 rounded-full text-xs font-bold text-theme-muted border border-white/50">
          Total: {complaints.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          let StatIcon = FileText;
          if (stat.label === 'Pending') StatIcon = Clock;
          if (stat.label === 'In Progress') StatIcon = AlertCircle;
          if (stat.label === 'Resolved') StatIcon = CheckCircle2;
          return (
            <div key={i} className="bg-theme-card p-6 rounded-[28px] shadow-sm border border-white/40 flex items-center gap-4">
              <div className="text-2xl bg-theme-sidebar w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner text-theme-accent">
                <StatIcon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color || 'text-theme-text'}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-theme-sidebar p-4 rounded-[24px] border border-white/40 shadow-sm">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={16} />
          <input type="text" placeholder="Search complaints by ID, name..." className="w-full pl-11 pr-4 py-3 bg-white border border-white/50 shadow-inner rounded-xl text-xs focus:ring-2 focus:ring-theme-accent outline-none text-theme-text placeholder-theme-muted/50 font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-white rounded-xl text-xs font-bold text-theme-text border border-white/50 shadow-inner cursor-pointer outline-none focus:ring-2 focus:ring-theme-accent" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
          </div>

          <div className="relative group flex-1 md:flex-none">
            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-white rounded-xl text-xs font-bold text-theme-text border border-white/50 shadow-inner cursor-pointer outline-none focus:ring-2 focus:ring-theme-accent" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option>All Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredComplaints.length > 0 ? filteredComplaints.map((comp) => (
          <div key={comp.id} className="bg-theme-card p-6 rounded-[32px] shadow-sm border border-white/40 hover:border-theme-accent transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <h3 className="text-sm font-black text-theme-text tracking-tight">{comp.title}</h3>
                <PriorityBadge level={comp.priority} />
              </div>
              <StatusLabel status={comp.status} />
            </div>

            <p className="text-xs text-theme-muted font-medium mb-4 line-clamp-2 md:line-clamp-none pr-4">{comp.description}</p>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 border-t border-white/30 gap-4">
              <div className="flex flex-wrap gap-4 text-[10px] font-bold text-theme-muted uppercase tracking-tighter">
                <span>ID: <span className="text-theme-text">{comp.id}</span></span>
                <span>Customer: <span className="text-theme-text">{comp.customer}</span></span>
                <span>Category: <span className="text-theme-text">{comp.category}</span></span>
                <span>Date: <span className="text-theme-text">{comp.date}</span></span>
                {comp.assignedTo && <span>Assigned: <span className="text-theme-text">{comp.assignedTo}</span></span>}
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <div className="relative">
                  <button className="p-2 bg-theme-sidebar rounded-lg text-theme-muted hover:text-theme-accent transition-colors" onClick={() => setActiveDropdown(activeDropdown === comp.id ? null : comp.id)}>
                    <MoreHorizontal size={16} />
                  </button>
                  {activeDropdown === comp.id && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-white/50 py-2 z-50">
                      <button className="w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 text-red-500 hover:bg-red-50 transition-colors" onClick={() => { handleDelete(comp.id); setActiveDropdown(null); }}>
                        <Trash2 size={14} /> Remove Complaint
                      </button>
                    </div>
                  )}
                </div>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-theme-accent text-white text-[10px] font-black uppercase rounded-lg hover:opacity-90 transition-all shadow-md" onClick={() => setSelectedComplaint(comp)}>
                  <Eye size={12} /> View Details
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-theme-sidebar rounded-[32px] border border-dashed border-theme-muted/30">
            <p className="text-theme-muted font-medium italic">No live complaints found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
