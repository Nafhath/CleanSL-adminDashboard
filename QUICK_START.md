# 🚀 CleanSL Complete Setup - Quick Reference

## ✅ What Has Been Created

### Backend Infrastructure ✨
```
✅ Express.js Server (Port 5000)
✅ MongoDB Database Models (5 models)
✅ API Routes (6 route modules)
✅ Google Maps Service Integration
✅ Data Seeding Script
✅ Error Handling & CORS
✅ Environment Configuration
```

### Frontend Integration ✨
```
✅ Google Maps Integration
✅ Axios API Service with Error Handling
✅ Environment Variables Configuration
✅ LiveMap Component with Google Maps
```

### Documentation ✨
```
✅ Complete Setup Guide (SETUP.md)
✅ API Documentation (API_DOCS.md)
✅ README with Features & Architecture
✅ This Quick Reference Guide
```

### Startup Automation ✨
```
✅ Windows Batch Script (START.bat)
✅ PowerShell Script (START.ps1)
✅ Automated dependency installation
✅ Database seeding automation
```

---

## 🎯 QUICKEST START (Windows)

### Method 1: Double-Click (Easiest)
```
1. Open cleansl-admin folder
2. Double-click: START.bat
3. Choose option 1 to start both backend and frontend
4. Wait for "Services starting..." message
5. Open browser to http://localhost:3000
```

### Method 2: PowerShell (Alternative)
```powershell
# Right-click START.ps1 → "Run with PowerShell"
# OR in PowerShell:
cd C:\path\to\cleansl-admin
.\START.ps1
```

### Method 3: Manual (Full Control)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run seed
npm run dev
# Backend ready at: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm install
npm start
# Frontend ready at: http://localhost:3000
```

---

## 🔐 Login Credentials

Use these to test different roles:

```
┌─────────────┬─────────────────────┬──────────┐
│ Role        │ Email               │ Password │
├─────────────┼─────────────────────┼──────────┤
│ Admin       │ admin@cleansl.com   │ admin123 │
│ Driver      │ aravind@cleansl.com │ driver123│
│ Supervisor  │ supervisor@cleansl  │ supvsr123│
└─────────────┴─────────────────────┴──────────┘
```

---

## 📱 Access Points

Once running, access:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Dashboard & UI |
| Backend | http://localhost:5000 | API Server |
| API Docs | http://localhost:5000/api | API Documentation |
| Health | http://localhost:5000/api/health | System Status |

---

## 🗂️ Key Files & Directories

### Backend Created:
```
backend/
├── server.js                 ← Main Express server
├── package.json              ← Dependencies (NEW axios added)
├── .env                      ← Environment config
├── models/
│   ├── User.js              ← Driver & admin schema
│   ├── Truck.js             ← Vehicle schema
│   ├── Complaint.js         ← Complaint schema
│   ├── Violation.js         ← Violation schema
│   └── Analytics.js         ← Analytics schema
├── routes/
│   ├── usersRoutes.js       ← /api/users endpoints
│   ├── trucksRoutes.js      ← /api/trucks endpoints
│   ├── complaintsRoutes.js  ← /api/complaints endpoints
│   ├── violationsRoutes.js  ← /api/violations endpoints
│   ├── analyticsRoutes.js   ← /api/analytics endpoints
│   └── mapsRoutes.js        ← /api/maps endpoints
├── services/
│   └── googleMapsService.js ← Maps API integration
└── scripts/
    └── seedData.js          ← Database seeding
```

### Frontend Created/Updated:
```
src/
├── services/
│   └── api.js               ← Updated with Axios & error handling
├── pages/
│   └── LiveMap.jsx          ← Updated with Google Maps

.env.local                    ← NEW: Google Maps & API config
```

### Documentation:
```
SETUP.md                      ← Complete installation guide
API_DOCS.md                   ← API endpoint documentation
START.bat                     ← Windows batch starter
START.ps1                     ← PowerShell starter
```

---

## 🔑 Google Maps API

Your keys are configured in `.env.local`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBJAkmEp1gdg63BL28NUvl5GP17BSd3UP0
REACT_APP_API_URL=http://localhost:5000/api
```

**Features Enabled:**
- ✅ Real-time GPS tracking visualization
- ✅ Route polylines
- ✅ Truck markers
- ✅ Geocoding (address ↔ coordinates)
- ✅ Distance & duration calculations
- ✅ Geofencing check

---

## 📊 Database

### MongoDB Setup
- **Default URI:** `mongodb://localhost:27017/cleansl-admin`
- **Status:** Auto-seeds with sample data
- **Collections:** 5 (Users, Trucks, Complaints, Violations, Analytics)

**Sample Data Included:**
- 5 Users (2 drivers, 1 supervisor, 1 manager, 1 admin)
- 4 Trucks (with GPS locations, fuel, load)
- 3 Complaints (various categories & statuses)
- 3 Violations (speeding, harsh braking, off-route)
- 2 Analytics records (daily metrics)

---

## 🛠️ Useful Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Seed database with sample data
npm run seed

# Development (auto-reload)
npm run dev

# Production
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build

# Run tests
npm test
```

---

## ✔️ Verification Checklist

After starting both services:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:5000/api
- [ ] Can log in with test credentials
- [ ] Dashboard shows mock data
- [ ] Google Maps displays on Live Map page
- [ ] No console errors in browser
- [ ] Database connected (no MongoDB errors)

---

## 🐛 Common Issues & Fixes

### "MongoDB connection failed"
```bash
# Check if MongoDB is running
tasklist | findstr mongod

# Start it:
mongod
# OR via Services:
services.msc → Find "MongoDB" → Start
```

### "Port 5000 already in use"
```bash
# Find process:
netstat -ano | findstr :5000

# Kill it:
taskkill /PID <PID_NUMBER> /F
```

### "Port 3000 already in use"
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### "Google Maps not showing"
- Check `.env.local` has correct API key
- Verify API key is not rate-limited
- Open DevTools → Console for errors

### "CORS Error"
- Backend should have CORS enabled for localhost:3000
- Check `server.js` for CORS configuration

---

## 📈 Next Steps After Setup

1. **Test the API**: Use Postman or curl
2. **Explore Pages**: Navigate through all pages
3. **Create Records**: Add trucks, complaints, violations
4. **Check Analytics**: View performance metrics
5. **Test Maps**: Update location, view routes

---

## 📞 File Descriptions

| File | Purpose |
|------|---------|
| `SETUP.md` | Detailed installation & configuration guide |
| `API_DOCS.md` | Complete API endpoint documentation |
| `README.md` | Project overview & quick start |
| `START.bat` | Automated Windows batch starter |
| `START.ps1` | Automated PowerShell starter |

---

## 🎯 Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                       │
│  ├── Pages (Dashboard, Complaints, Violations, etc)    │
│  ├── Components (Charts, Cards, Maps)                  │
│  ├── Services (API calls via Axios)                    │
│  └── Google Maps Integration                           │
└────────────┬────────────────────────────────────────────┘
             │ HTTP/AXIOS
             ↓
┌──────────────────────────────────────────────────────────┐
│  BACKEND (Express.js)                                    │
│  ├── Routes (Users, Trucks, Complaints, Violations)     │
│  ├── Models (Mongoose schemas)                          │
│  ├── Services (Google Maps, Business Logic)             │
│  └── Controllers (Route handlers)                       │
└────────────┬─────────────────────────────────────────────┘
             │ Mongoose
             ↓
┌──────────────────────────────────────────────────────────┐
│  MongoDB                                                 │
│  ├── users                                              │
│  ├── trucks                                             │
│  ├── complaints                                         │
│  ├── violations                                         │
│  └── analytics                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ✨ System Status

**Frontend**: ✅ Ready  
**Backend**: ✅ Ready  
**Database**: ✅ Ready  
**Maps**: ✅ Integrated  
**Documentation**: ✅ Complete  

---

## 🚀 Ready to Launch!

Run: `START.bat` or `npm run dev` (backend) + `npm start` (frontend)

**Everything is set up and ready to use!** 🎉
