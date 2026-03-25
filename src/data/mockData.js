// mockData.js - centralized dummy data for the app

export const ANALYTICS_TOTALS = {
  waste: { value: "4.8 tons", trend: "+8.2%" },
  pickups: { value: "234", trend: "+12.1%" },
  users: { value: "1,264", trend: "+3.1%" }
};

export const MONTHLY_TRENDS = [
  { name: 'Jan', value: 3000 }, { name: 'Feb', value: 3500 }, { name: 'Mar', value: 3200 },
  { name: 'Apr', value: 4000 }, { name: 'May', value: 4200 }, { name: 'Jun', value: 4100 },
  { name: 'Jul', value: 4500 }, { name: 'Aug', value: 4400 }, { name: 'Sep', value: 4800 },
  { name: 'Oct', value: 5000 }, { name: 'Nov', value: 5200 }
];

export const WASTE_DISTRIBUTION = [
  { name: 'Plastic', value: 35, fill: '#2D5A27' },
  { name: 'Paper', value: 25, fill: '#5DAE54' },
  { name: 'Metal', value: 15, fill: '#A3D99F' },
  { name: 'E-waste', value: 15, fill: '#E9F2E8' },
  { name: 'Others', value: 10, fill: '#CBD5E1' }
];

export const DRIVER_PERFORMANCE = [
  { name: "Ben Tennyson", pickups: 158, rating: 4.8, efficiency: 92 },
  { name: "Nafhath Mohamed", pickups: 203, rating: 4.9, efficiency: 96 },
  { name: "Iman Fazney", pickups: 142, rating: 4.7, efficiency: 88 },
  { name: "Aakif Saroos", pickups: 98, rating: 4.6, efficiency: 85 },
  { name: "Harish Prasanna", pickups: 178, rating: 4.8, efficiency: 91 },
];

export const USER_GROWTH = [
  { month: 'Jan', total: 800 }, { month: 'Mar', total: 950 }, 
  { month: 'Jun', total: 1100 }, { month: 'Sep', total: 1200 }, { month: 'Nov', total: 1264 }
];

// statistics for overview cards
export const MOCK_STATS = {
  totalPickups: 1240,
  missedPickups: 14,
  activeTrucks: 8,
  newComplaints: 5,
  efficiency: "72%"
};

// operations feed for overview
export const MOCK_OPERATIONS = [
  { id: 1, event: "Truck En Route", detail: "Truck T-05 | Ward 37: Kollupitiya", time: "Just now", status: "Moving", color: "blue" },
  { id: 2, event: "Collection Success", detail: "Truck T-01 | Ward 07: Cinnamon Gardens", time: "2 mins ago", status: "Verified", color: "green" },
  { id: 3, event: "AI Violation", detail: "Unsorted Waste | No. 15, Flower Rd", time: "14 mins ago", status: "Violation", color: "red" },
  { id: 4, event: "Resident Complaint", detail: "Missed Pickup | No. 22, Galle Rd", time: "45 mins ago", status: "Pending", color: "amber" }
];

// ward data used in LiveMap sidebar
export const WARDS_DATA = [
  { id: 1, name: "Ward 07: Cinnamon Gardens", progress: 65, trucks: ["T-01", "T-04"], status: "Progress" },
  { id: 2, name: "Ward 04: Bambalapitiya", progress: 100, trucks: ["T-02", "T-05"], status: "Completed" },
  { id: 3, name: "Ward 37: Kollupitiya", progress: 15, trucks: ["T-08", "T-09"], status: "Delayed" }
];

// active truck details for map page
export const ACTIVE_TRUCK = {
  id: 'T-01',
  model: 'Isuzu Giga Compactor',
  loadPercentage: 65,
  location: 'No. 45, Rosmead Place',
  ward: 'Ward 07: Cinnamon Gardens',
  speed: '32 km/hr',
  status: 'Moving',
  weight: '4,250 kg',
  registration: 'WP NA-4589',
  shiftTime: '4h 30m Active',
  shiftEnd: '4:30 PM',
  logs: [
    { type: 'violation', message: 'Violation Detected', time: '8:12 AM' },
    { type: 'info', message: 'Route Optimized', time: '8:15 AM' }
  ],
  route: [[6.9145, 79.8650], [6.9160, 79.8680], [6.9120, 79.8750], [6.9080, 79.8700], [6.9145, 79.8650]]
};

// map configuration
export const MAP_CONFIG = {
  center: [6.9145, 79.8650],
  zoom: 16
};

// violation data for violations page
export const VIOLATION_STATS = [
  { label: "Total Violations", value: "124", color: "text-red-600", trend: "+12%" },
  { label: "Pending Review", value: "28", color: "text-orange-600", trend: "-3%" },
  { label: "Confirmed", value: "67", color: "text-red-600", trend: "+5%" },
  { label: "Resolved", value: "29", color: "text-green-600", trend: "+8%" }
];

export const VIOLATIONS_TABLE = [
  { date: "2025-11-21", type: "Unsorted Waste", resident: "No. 15, Flower Rd", status: "Pending", score: "92" },
  { date: "2025-11-20", type: "Hazardous Waste", resident: "No. 22, Galle Rd", status: "Disputed", score: "87" },
  { date: "2025-11-19", type: "Unsorted Waste", resident: "No. 8, Rosmead Pl", status: "Confirmed", score: "95" },
  { date: "2025-11-18", type: "Mixed Waste", resident: "No. 45, Baudhaloka Mw", status: "Resolved", score: "89" },
  { date: "2025-11-17", type: "Unsorted Waste", resident: "No. 33, Duplication Rd", status: "Pending", score: "91" }
];

export const VIOLATION_LOCATIONS = [
  [6.9145, 79.8650],
  [6.9160, 79.8680],
  [6.9120, 79.8750],
  [6.9080, 79.8700],
  [6.9100, 79.8620]
];


export const COMPLAINT_STATS = [
  { label: "Total Complaints", value: 5, icon: "📋" },
  { label: "Pending", value: 1, icon: "🕒", color: "text-orange-500" },
  { label: "In Progress", value: 2, icon: "⚙️", color: "text-blue-500" },
  { label: "Resolved", value: 1, icon: "✅", color: "text-green-500" },
];

export const COMPLAINTS_LIST = [
  {
    id: "COMP-001",
    title: "Missed Pickup Schedule",
    priority: "High",
    description: "My scheduled waste pickup was missed yesterday. No notification was provided.",
    customer: "Vinusha Ranasinghe",
    category: "Pickup Service",
    date: "2024-11-28",
    status: "Pending",
    assignedTo: null
  },
  {
    id: "COMP-002",
    title: "Damaged Bin Not Replaced",
    priority: "Medium",
    description: "Reported damaged waste bin 2 weeks ago but no replacement received yet.",
    customer: "Nick Fury",
    category: "Equipment",
    date: "2024-11-25",
    status: "In Progress",
    assignedTo: "Vijay Sethupathi"
  },
  {
    id: "COMP-003",
    title: "Overflowing Communal Bin",
    priority: "Critical",
    description: "The communal waste bin at Block 123 has been overflowing for 3 days.",
    customer: "Aakif Saroose",
    category: "Collection Issue",
    date: "2024-11-27",
    status: "In Progress",
    assignedTo: "Bruce Banner"
  },
  {
    id: "COMP-004",
    title: "Billing Discrepancy",
    priority: "Medium",
    description: "I was charged twice for the same service period. Please review my account.",
    customer: "Harish Prasanna",
    category: "Billing",
    date: "2024-11-22",
    status: "Resolved",
    assignedTo: "Nathath Team"
  }
];

// --- Driver Logs / Fleet Tracking Mock Data ---

export const DRIVER_LIST_DATA = [
  { id: 1, name: 'Samantha Silva', username: '@Driver_01', hours: '5 Hours 13 Minutes', vehicle: 'Truck 001', route: 'Wellawatta', status: 'Offline' },
  { id: 2, name: 'Kasun Rathnayake', username: '@Driver_02', hours: '8 Hours 38 Minutes', vehicle: 'Truck 002', route: 'Kollupitiya', status: 'Active' },
  { id: 3, name: 'Mohammed Ali', username: '@Driver_03', hours: '8 Hours 07 Minutes', vehicle: 'Truck 003', route: 'Slave Island', status: 'Active' },
  { id: 4, name: 'Kamal Perera', username: '@Driver_04', hours: '6 Hours 12 Minutes', vehicle: 'Truck 004', route: 'Bambalapitiya', status: 'Offline' },
  { id: 5, name: 'Sanjaya Jayamaha', username: '@Driver_05', hours: '7 Hours 58 Minutes', vehicle: 'Truck 005', route: 'Maligawatta', status: 'Active' },
  { id: 6, name: 'Sunil Weeraratne', username: '@Driver_06', hours: '5 Hours 33 Minutes', vehicle: 'Truck 006', route: 'Dehiwala', status: 'Offline' },
];

export const CITIES_PROGRESS_DATA = [
  { name: 'Colombo 1 (Fort)', type: 'React Project', progress: 78, violations: 'None', color: 'bg-theme-accent' },
  { name: 'Colombo 2 (Slave Island)', type: 'Figma Project', progress: 18, violations: 'None', color: 'bg-red-400' },
  { name: 'Colombo 3 (Kollupitiya)', type: 'VueJs Project', progress: 62, violations: 'None', color: 'bg-purple-500' },
  { name: 'Colombo 4 (Bambalapitiya)', type: 'Xamarin Project', progress: 8, violations: 'None', color: 'bg-orange-400' },
  { name: 'Colombo 5 (Havelock Town)', type: 'Python Project', progress: 49, violations: 'None', color: 'bg-orange-400' },
  { name: 'Colombo 6 (Wellawatta)', type: 'Sketch Project', progress: 92, violations: '01', color: 'bg-theme-accent' },
  { name: 'Colombo 7 (Cinnamon Gardens)', type: 'HTML Project', progress: 88, violations: 'None', color: 'bg-theme-accent' },
];

export const SUCCESS_RATE_DATA = [
  { name: 'Jan', rate: 10 },
  { name: 'Feb', rate: 42 },
  { name: 'Mar', rate: 23 },
  { name: 'April', rate: 58 },
  { name: 'May', rate: 39 },
  { name: 'Jun', rate: 76 },
  { name: 'Jul', rate: 89 },
];