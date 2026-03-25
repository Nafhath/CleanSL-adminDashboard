# 🛠️ Troubleshooting & FAQ

## Installation & Setup Issues

### ❌ "Node.js is not recognized"

**Problem**: Command not found when running `node --version`

**Solution**:
1. Install Node.js from https://nodejs.org (LTS version recommended)
2. Restart your terminal/command prompt
3. Try again: `node --version`

---

### ❌ "MongoDB connection refused"

**Problem**: Backend shows "MongoDB connection error"

**Solution**:
```bash
# Check if MongoDB is running
tasklist | findstr mongod

# If not running, start it:
mongod

# OR start service:
services.msc
# Find "MongoDB Server" → Right-click → Start
```

**Can't find MongoDB?**
- Download from: https://www.mongodb.com/try/download/community
- Install with default settings
- Start service from Services

---

### ❌ "Port 5000 already in use"

**Problem**: Backend fails with "EADDRINUSE" error

**Solution**:
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F

# Then restart backend
npm run dev
```

---

### ❌ "Port 3000 already in use"

**Problem**: Frontend fails to start on port 3000

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID 12345 /F

# Restart frontend
npm start
```

**Alternative**: Change port
```bash
set PORT=3001
npm start
```

---

### ❌ "npm install failed"

**Problem**: Dependency installation errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules

# Retry installation
npm install

# For backend:
cd backend
npm install
```

---

## Backend Issues

### ❌ "Cannot find module 'mongoose'"

**Problem**: Missing backend dependencies

**Solution**:
```bash
cd backend
npm install
npm run dev
```

---

### ❌ "Database connection timeout"

**Problem**: Backend can't connect to MongoDB

**Checklist**:
- [ ] Is MongoDB running? (`mongod` or Services)
- [ ] Check MONGODB_URI in `.env`
- [ ] Is MongoDB on port 27017? (default)
- [ ] Is firewall blocking localhost:27017?

**Test connection**:
```bash
# In MongoDB compass or CLI
mongo
# Should connect successfully
```

---

### ❌ "SyntaxError in route file"

**Problem**: JavaScript syntax error in backend

**Solution**:
1. Check the error message for line number
2. Open the file and fix the syntax
3. Restart backend: `npm run dev`

---

## Frontend Issues

### ❌ "Google Maps not showing on Live Map"

**Problem**: Blank map or error on LiveMap page

**Checklist**:
- [ ] API key in `.env.local`? 
- [ ] API key correct? (starts with AIza...)
- [ ] Maps API enabled in Google Cloud Console?
- [ ] Check browser console for errors (F12)

**Solution**:
```env
# In .env.local, verify:
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBJAkmEp1gdg63BL28NUvl5GP17BSd3UP0
```

---

### ❌ "Cannot find module 'axios'"

**Problem**: API calls fail - module not found

**Solution**:
```bash
npm install axios
npm start
```

---

### ❌ "White screen, nothing loads"

**Problem**: React app doesn't render

**Troubleshooting**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify backend is running
5. Check API_URL in `.env.local`

**Common cause**: Backend not running
```bash
# In separate terminal
cd backend
npm run dev
```

---

## API & Network Issues

### ❌ "CORS error: No 'Access-Control-Allow-Origin'"

**Problem**: Frontend can't call backend API

**Solution**:
1. Verify backend is running on port 5000
2. Check CORS in `backend/server.js`:
```javascript
app.use(cors()); // Should be present
```
3. Verify API URL in `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### ❌ "Network request failed"

**Problem**: API calls not working

**Checklist**:
- [ ] Backend running? (`npm run dev` in backend folder)
- [ ] Port 5000 accessible?
- [ ] Correct API URL in `.env.local`?
- [ ] No typos in endpoint?

**Test API directly**:
```bash
# In browser or Postman
http://localhost:5000/api/health
# Should return status: OK
```

---

### ❌ "401 Unauthorized"

**Problem**: API returns "Unauthorized"

**Causes**:
- Invalid login credentials
- Expired token
- Wrong token format

**Solution**:
```javascript
// Use correct credentials:
Email: admin@cleansl.com
Password: admin123
```

---

## Data & Database Issues

### ❌ "No data in database"

**Problem**: Database empty after starting

**Solution**:
1. Seed the database:
```bash
cd backend
npm run seed
```

2. Verify data was created:
```bash
mongo
use cleansl-admin
db.users.find()  # Should show users
```

---

### ❌ "E11000 duplicate key error"

**Problem**: Can't create user/truck with that name

**Cause**: Record already exists (probably from seeding)

**Solution**:
1. Use different email/name, OR
2. Reseed database:
```bash
cd backend
npm run seed
```

---

### ❌ "Database locked or can't write"

**Problem**: Write operations failing

**Causes**:
- MongoDB service stopped
- Disk space full
- Permission issues

**Solution**:
```bash
# Restart MongoDB
services.msc
# Restart "MongoDB Server"

# Or in terminal:
mongod --dbpath "C:\data\db"
```

---

## Startup Script Issues

### ❌ "START.bat doesn't work"

**Problem**: Batch script fails to run

**Solution**:
1. Right-click START.bat → "Run as Administrator"
2. OR run manually:
```bash
cd backend
npm install
npm run seed
npm run dev
# In another terminal:
npm install
npm start
```

---

### ❌ "START.ps1 won't run"

**Problem**: PowerShell execution policy error

**Solution**:
```powershell
# Open PowerShell as Admin and run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

# Then run script:
.\START.ps1
```

---

## Performance Issues

### 🐢 "App is slow or laggy"

**Possible causes**:
1. MongoDB not optimized
2. Too much data to load
3. Browser extension interfering

**Solutions**:
```bash
# Restart everything fresh
# Kill all node/mongo processes
taskkill /F /IM node.exe
taskkill /F /IM mongod.exe

# Restart clean
npm run dev
npm start
```

---

### 🐢 "Maps takes forever to load"

**Causes**:
- Slow internet
- Google Maps API rate limited
- Large amount of data

**Solutions**:
1. Wait a moment (API keys can be slow on first request)
2. Reduce data being loaded
3. Check API key limits in Google Cloud Console

---

## Login & Authentication Issues

### ❌ "Can't log in"

**Checklist**:
- [ ] Backend running?
- [ ] Using correct credentials?
- [ ] Email: admin@cleansl.com
- [ ] Password: admin123

---

### ❌ "Logged in but can't see data"

**Possible causes**:
1. Backend not seeded
2. User doesn't have permission
3. API not responding

**Solution**:
```bash
# Reseed database
cd backend
npm run seed
```

---

## Dashboard & Pages Issues

### ❌ "Dashboard shows 'No Data'"

**Causes**:
1. Database not seeded
2. API not returning data
3. Network error

**Solution**:
```bash
# In backend folder:
npm run seed

# Wait 5 seconds, refresh browser
```

---

### ❌ "Charts not rendering"

**Problem**: Analytics show error

**Causes**:
- Recharts not installed
- Invalid data format
- Browser compatibility

**Solution**:
```bash
npm install recharts
npm start
```

---

### ❌ "Maps component crashes"

**Problem**: LiveMap page shows white screen

**Solution**:
1. Check console for errors (F12)
2. Verify API key in `.env.local`
3. Hard refresh: Ctrl+Shift+R
4. Clear browser cache: Ctrl+H → Clear browsing data

---

## Google Maps Specific Issues

### ❌ "Google Maps API Key Invalid"

**Problem**: "This API project is not authorized to use this API"

**Solution**:
1. Go to Google Cloud Console
2. Select your project
3. Enable "Maps JavaScript API"
4. Enable "Geocoding API"
5. Enable "Distance Matrix API"
6. Enable "Directions API"

---

### ❌ "Trucks not showing on map"

**Problem**: No markers on map

**Causes**:
1. No trucks in database
2. Invalid coordinates
3. Map not loaded

**Solution**:
```bash
# Verify trucks exist
mongo
use cleansl-admin
db.trucks.find()

# Should show at least one truck with location
```

---

### ❌ "Map showing blank/gray"

**Problem**: Map tiles not loading

**Solution**:
1. Check internet connection
2. Try different map type (satellite, street)
3. Hard refresh: Ctrl+Shift+R
4. Check browser console for errors

---

## File & Path Issues

### ❌ "File not found" error

**Cause**: Wrong file path

**Solution**: Verify file exists at:
```
C:\Users\Aakif\Documents\GitHub\cleansl-admin\cleansl-admin\
```

All backend files should be in:
```
C:\Users\[Username]\...\cleansl-admin\backend\
```

---

### ❌ "ENOENT: no such file or directory"

**Problem**: Can't find core files

**Solution**:
1. Verify you're in correct directory
2. Check file structure matches CHECKLIST.md
3. Run from project root

---

## Database File Issues

### ❌ "Can't find MongoDB data directory"

**Solution**:
```bash
# MongoDB data usually at:
C:\data\db

# Or check in Services what path is configured
# Can also specify custom path:
mongod --dbpath "C:\custom\path\to\db"
```

---

## Production Deployment Issues

### ❌ "Google Maps key has restrictions"

**Problem**: Maps don't work on production domain

**Solution**:
1. Go to Google Cloud Console
2. Find API key
3. Edit → Application restrictions
4. Remove restrictions or add your domain

---

### ❌ "Database URL wrong"

**Problem**: Can't connect in production

**Solution**:
1. Update `MONGODB_URI` in production `.env`
2. Example: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
3. Ensure MongoDB Atlas allows your IP

---

## Getting Help

1. **Check Documentation**:
   - SETUP.md - Installation help
   - API_DOCS.md - API issues
   - QUICK_START.md - Quick reference

2. **Check Error Messages**:
   - Read the full error message
   - Check browser console (F12)
   - Check terminal output

3. **Verify Basics**:
   - Is backend running?
   - Is MongoDB running?
   - Is frontend running?
   - Are ports 3000 and 5000 free?

4. **Restart Everything**:
   - Kill all processes
   - Delete node_modules (if needed)
   - Reinstall dependencies
   - Start fresh

---

## Quick Fixes Checklist

If something isn't working:

- [ ] Restart backend: Ctrl+C, then `npm run dev`
- [ ] Restart frontend: Ctrl+C, then `npm start`
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check MongoDB: `mongod --version`
- [ ] Check Node: `node --version`
- [ ] Kill stuck processes: `taskkill /F /IM node.exe`
- [ ] Reseed database: `npm run seed`

---

## Still Having Issues?

1. Review the error message carefully
2. Check relevant documentation file
3. Try the "Quick Fixes Checklist"
4. Verify file structure against CHECKLIST.md
5. Restart both backend and frontend
6. Clear all caches and restart browser

**Remember**: Most issues are caused by:
- MongoDB not running
- Dependencies not installed
- Wrong directory paths
- Ports in use
- Missing API key

---

**Last Resort**: Complete fresh start
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Delete node_modules
rmdir /s /q node_modules
rmdir /s /q backend\node_modules

# Reinstall everything
npm install
cd backend
npm install
npm run seed

# Restart
npm run dev      # Backend
npm start        # Frontend
```

---

Good luck! Most issues are easily resolved. 🚀
