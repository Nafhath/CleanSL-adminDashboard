import React from 'react';
import {
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Search,
  Truck,
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { addressAPI, taskAPI, userAPI } from '../services/api';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  not_collected: 'bg-red-100 text-red-700',
  delayed: 'bg-orange-100 text-orange-700'
};

const EMPTY_FORM = {
  driver_id: '',
  address_id: '',
  scheduled_date: '',
  status: 'pending',
  voice_transcript: ''
};

const formatDate = (value) => {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getTaskState = (task) => {
  const status = String(task.status || 'pending').toLowerCase();
  if (status === 'completed') return 'completed';
  if (status === 'not_collected') return 'not_collected';

  const scheduled = task.scheduled_date ? new Date(task.scheduled_date) : null;
  if (scheduled && !Number.isNaN(scheduled.getTime())) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduled.setHours(0, 0, 0, 0);
    if (scheduled < today) return 'delayed';
  }

  return 'pending';
};

const TaskCard = ({ title, value, helper, icon: Icon, tone }) => (
  <div className="bg-theme-card p-6 rounded-[28px] border border-white/40 shadow-sm flex items-center gap-4">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/50 ${tone}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">{title}</p>
      <p className="text-3xl font-black text-theme-text">{value}</p>
      <p className="text-xs font-bold text-theme-muted">{helper}</p>
    </div>
  </div>
);

export default function Operations() {
  const [drivers, setDrivers] = React.useState([]);
  const [addresses, setAddresses] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const loadData = React.useCallback(() => {
    setLoading(true);
    setError('');

    Promise.allSettled([
      userAPI.getDrivers(),
      addressAPI.getAll(),
      taskAPI.getAll()
    ])
      .then(([driversResult, addressesResult, tasksResult]) => {
        const nextDrivers = driversResult.status === 'fulfilled' && Array.isArray(driversResult.value)
          ? driversResult.value
          : [];
        const nextAddresses = addressesResult.status === 'fulfilled' && Array.isArray(addressesResult.value)
          ? addressesResult.value
          : [];
        const nextTasks = tasksResult.status === 'fulfilled' && Array.isArray(tasksResult.value)
          ? tasksResult.value
          : [];

        setDrivers(nextDrivers);
        setAddresses(nextAddresses);
        setTasks(nextTasks);
      })
      .catch(() => {
        setError('Unable to refresh operations right now.');
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const driverMap = React.useMemo(
    () => new Map(drivers.map((driver) => [driver.id, driver])),
    [drivers]
  );

  const addressMap = React.useMemo(
    () => new Map(addresses.map((address) => [address.id, address])),
    [addresses]
  );

  const hydratedTasks = React.useMemo(
    () =>
      tasks.map((task) => {
        const driver = driverMap.get(task.driver_id);
        const address = addressMap.get(task.address_id);
        return {
          ...task,
          derivedStatus: getTaskState(task),
          driverName: driver?.full_name || driver?.email || task.driver_id,
          wardName: address?.zone_or_ward || 'Unassigned ward',
          streetAddress: address?.street_address || 'Unknown address'
        };
      }),
    [tasks, driverMap, addressMap]
  );

  const filteredTasks = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return hydratedTasks.filter((task) => {
      const matchesSearch =
        String(task.driverName || '').toLowerCase().includes(query) ||
        String(task.streetAddress || '').toLowerCase().includes(query) ||
        String(task.wardName || '').toLowerCase().includes(query) ||
        String(task.id || '').toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || task.derivedStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [hydratedTasks, search, statusFilter]);

  const metrics = React.useMemo(() => {
    const pending = hydratedTasks.filter((task) => task.derivedStatus === 'pending').length;
    const delayed = hydratedTasks.filter((task) => task.derivedStatus === 'delayed').length;
    const completed = hydratedTasks.filter((task) => task.derivedStatus === 'completed').length;
    const missed = hydratedTasks.filter((task) => task.derivedStatus === 'not_collected').length;
    return { pending, delayed, completed, missed };
  }, [hydratedTasks]);

  const resetForm = () => setForm(EMPTY_FORM);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!form.driver_id || !form.address_id || !form.scheduled_date) {
      setError('Choose a driver, address, and schedule date before saving.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        driver_id: form.driver_id,
        address_id: form.address_id,
        scheduled_date: form.scheduled_date,
        status: form.status,
        voice_transcript: form.voice_transcript || null
      };

      const created = await taskAPI.create(payload);
      setTasks((prev) => [created, ...prev]);
      resetForm();
    } catch (createError) {
      setError(createError?.response?.data?.detail || 'Failed to create the pickup schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    setError('');
    try {
      const updated = await taskAPI.update(taskId, updates);
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
    } catch (updateError) {
      setError(updateError?.response?.data?.detail || 'Failed to update the pickup task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError('');
    try {
      await taskAPI.delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (deleteError) {
      setError(deleteError?.response?.data?.detail || 'Failed to remove the pickup task.');
    }
  };

  const handleRescheduleTomorrow = (task) => {
    const baseDate = task.scheduled_date ? new Date(task.scheduled_date) : new Date();
    baseDate.setDate(baseDate.getDate() + 1);
    const nextDate = baseDate.toISOString().split('T')[0];
    handleUpdateTask(task.id, { scheduled_date: nextDate, status: 'pending' });
  };

  return (
    <div className="flex flex-col gap-8 bg-theme-main font-sans selection:bg-theme-accent selection:text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-theme-text tracking-tight">Operations Control</h1>
          <p className="text-sm text-theme-muted font-medium mt-1">
            Schedule pickups, manage delays, and update collection progress for residents and drivers.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="flex items-center gap-2 bg-theme-accent text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={14} />
          Refresh Operations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <TaskCard title="Scheduled" value={metrics.pending} helper="upcoming pickups" icon={CalendarDays} tone="bg-theme-accent" />
        <TaskCard title="Delayed" value={metrics.delayed} helper="needs reschedule" icon={Clock3} tone="bg-orange-400" />
        <TaskCard title="Completed" value={metrics.completed} helper="finished collections" icon={CheckCircle2} tone="bg-emerald-500" />
        <TaskCard title="Missed" value={metrics.missed} helper="not collected yet" icon={CircleOff} tone="bg-red-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-6">
        <div className="bg-theme-card rounded-[32px] border border-white/40 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-black text-theme-text">Create Pickup Plan</h2>
            <p className="text-xs font-bold text-theme-muted mt-1">
              This page is the manual control point for scheduling, pickup updates, and delay management.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleCreateTask}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Assign Driver</label>
              <select
                value={form.driver_id}
                onChange={(event) => setForm((prev) => ({ ...prev, driver_id: event.target.value }))}
                className="w-full px-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-bold text-theme-text outline-none focus:ring-2 focus:ring-theme-accent"
              >
                <option value="">Select driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.full_name || driver.email || driver.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Pickup Address</label>
              <select
                value={form.address_id}
                onChange={(event) => setForm((prev) => ({ ...prev, address_id: event.target.value }))}
                className="w-full px-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-bold text-theme-text outline-none focus:ring-2 focus:ring-theme-accent"
              >
                <option value="">Select address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {(address.zone_or_ward ? `${address.zone_or_ward} - ` : '') + address.street_address}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Schedule Date</label>
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={(event) => setForm((prev) => ({ ...prev, scheduled_date: event.target.value }))}
                  className="w-full px-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-bold text-theme-text outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Starting Status</label>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full px-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-bold text-theme-text outline-none focus:ring-2 focus:ring-theme-accent"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="not_collected">Not Collected</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Delay or Pickup Notes</label>
              <textarea
                rows={4}
                value={form.voice_transcript}
                onChange={(event) => setForm((prev) => ({ ...prev, voice_transcript: event.target.value }))}
                placeholder="Optional operations note, delay reason, or pickup instruction..."
                className="w-full px-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-medium text-theme-text outline-none focus:ring-2 focus:ring-theme-accent resize-none"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                {error}
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-theme-accent text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Plus size={14} />
                {submitting ? 'Saving...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-theme-sidebar text-theme-text border border-white/50 shadow-inner"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="bg-theme-card rounded-[32px] border border-white/40 shadow-sm p-6 flex flex-col gap-6 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-black text-theme-text">Pickup Queue</h2>
              <p className="text-xs font-bold text-theme-muted mt-1">
                Live collection tasks from Supabase with delay detection derived from schedule date.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search driver, ward, address..."
                  className="w-full pl-11 pr-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-bold text-theme-text outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-3 bg-theme-sidebar border border-white/50 rounded-2xl shadow-inner text-sm font-bold text-theme-text outline-none focus:ring-2 focus:ring-theme-accent"
              >
                <option value="all">All statuses</option>
                <option value="pending">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
                <option value="not_collected">Missed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-dashed border-theme-muted/30 bg-theme-sidebar/60 px-6 py-16 text-center text-theme-muted font-medium italic">
              Loading operations...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-theme-muted/30 bg-theme-sidebar/60 px-6 py-16 text-center text-theme-muted font-medium italic">
              No pickup tasks match the current filters.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-theme-sidebar rounded-[28px] border border-white/50 shadow-inner p-5">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                    <div className="space-y-4 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-serif font-black text-theme-text">{task.wardName}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[task.derivedStatus] || STATUS_STYLES.pending}`}>
                          {task.derivedStatus === 'not_collected' ? 'Missed' : task.derivedStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-3 min-w-0">
                          <Truck size={16} className="mt-1 text-theme-accent shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Driver</p>
                            <p className="font-bold text-theme-text truncate">{task.driverName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 min-w-0">
                          <MapPin size={16} className="mt-1 text-theme-accent shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Address</p>
                            <p className="font-bold text-theme-text">{task.streetAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 min-w-0">
                          <CalendarDays size={16} className="mt-1 text-theme-accent shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Schedule</p>
                            <p className="font-bold text-theme-text">{formatDate(task.scheduled_date)}</p>
                          </div>
                        </div>
                      </div>

                      {task.voice_transcript ? (
                        <div className="rounded-2xl bg-white/50 border border-white/50 px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted mb-1">Operations Note</p>
                          <p className="text-sm font-medium text-theme-text">{task.voice_transcript}</p>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap xl:flex-col gap-2 xl:min-w-[180px]">
                      <button
                        type="button"
                        onClick={() => handleUpdateTask(task.id, { status: 'completed' })}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <CheckCircle2 size={13} />
                        Mark Completed
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRescheduleTomorrow(task)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-400 text-white text-[10px] font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <Clock3 size={13} />
                        Delay to Tomorrow
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateTask(task.id, { status: 'not_collected' })}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-400 text-white text-[10px] font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <AlertTriangle size={13} />
                        Mark Missed
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-theme-main text-theme-text text-[10px] font-black uppercase tracking-wider border border-white/50 shadow-sm hover:border-red-200 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
