# CleanSL Admin Dashboard

React admin dashboard for the CleanSL waste-management project.

## Current Status

The frontend is building and the smoke test is passing.

Current workspace pairing:

- Frontend: `cleansl-admin/`
- Backend: `../backend/` (FastAPI on `http://localhost:8000`)

Verified commands:

```bash
npm run build
npm test -- --watchAll=false --runInBand
```

## Handoff Context

This section is meant for continuing the work in another Codex chat without losing context.

### What was reported

The issue reported in chat was:

> "i think there are some issues admin dashboard ,bcoz its messed up"

### What was investigated

I checked the workspace and found the actual admin frontend here:

```text
Admin Dashboard/cleansl-admin-main/cleansl-admin
```

Then I inspected:

- `package.json`
- `src/App.js`
- `src/pages/Dashboard.jsx`
- `src/pages/Login.jsx`
- `src/pages/Overview.jsx`
- `src/pages/Violations.jsx`
- `src/pages/Analytics.jsx`
- `src/pages/Profile.jsx`

### Root causes found

1. The UI uses Tailwind utility classes heavily, but `tailwindcss`, `postcss`, and `autoprefixer` were missing from `package.json`.
2. The app could log in, store the token, and still not reliably update the root auth state immediately.
3. `react-router-dom` was on v7 while the app code and CRA/Jest setup were effectively using the v6 API shape.
4. `Overview` and `Violations` had stale `useMemo` dependency lists, so filtered data could become out of sync.
5. The default CRA test was outdated and not relevant to the real app.

## Changes Made

### 1. Added missing styling toolchain dependencies

File: `package.json`

Added:

```json
"devDependencies": {
  "@rushstack/eslint-patch": "^1.16.1",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.3",
  "tailwindcss": "^3.4.17"
}
```

This was needed because the app uses classes like `bg-theme-card`, `rounded-[32px]`, `flex`, `grid`, etc., and without the Tailwind/PostCSS stack the dashboard styling would appear broken or incomplete.

### 2. Fixed auth state synchronization

Files:

- `src/App.js`
- `src/pages/Login.jsx`
- `src/pages/Dashboard.jsx`

#### In `src/App.js`

Added a helper and made auth state reactive:

```js
const hasAuthToken = () => Boolean(localStorage.getItem('authToken'));

const [isAuthenticated, setIsAuthenticated] = useState(() => hasAuthToken());
```

Added an effect to keep auth state in sync:

```js
useEffect(() => {
  const syncAuthState = () => {
    setIsAuthenticated(hasAuthToken());
  };

  syncAuthState();
  window.addEventListener('storage', syncAuthState);
  window.addEventListener('authchange', syncAuthState);
  setLoading(false);

  return () => {
    window.removeEventListener('storage', syncAuthState);
    window.removeEventListener('authchange', syncAuthState);
  };
}, []);
```

Passed auth callbacks into pages:

```js
<Route path="/login" element={<Login onLogin={handleLogin} />} />
<Route path="/" element={<Dashboard onLogout={handleLogout} />}>
```

#### In `src/pages/Login.jsx`

Updated the component signature:

```js
export default function Login({ onLogin }) {
```

After successful login, dispatch a custom event and notify the parent:

```js
localStorage.setItem('authToken', 'test-token-123');
localStorage.setItem('user', JSON.stringify({ firstName: 'Demo', lastName: 'Admin', role: 'admin' }));
window.dispatchEvent(new Event('authchange'));
onLogin?.();
navigate('/');
```

The same pattern was added for API-based login too.

#### In `src/pages/Dashboard.jsx`

Updated logout so the rest of the app reacts immediately:

```js
const Dashboard = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authchange'));
    onLogout?.();
    navigate('/login');
  };
};
```

### 3. Aligned router version for CRA compatibility

File: `package.json`

Changed:

```json
"react-router-dom": "^6.30.1"
```

This resolved the mismatch between the app code, the CRA environment, and test compatibility.

### 4. Fixed stale filtered data in dashboard pages

#### `src/pages/Overview.jsx`

Changed:

```js
}, [query, filter]);
```

to:

```js
}, [operations, query, filter]);
```

#### `src/pages/Violations.jsx`

Changed:

```js
}, [searchTerm, activeTypeFilter, selectedDate]);
```

to:

```js
}, [violations, searchTerm, activeTypeFilter, selectedDate]);
```

This makes the filtered views update correctly when the underlying API/mock data changes.

### 5. Reduced warnings and cleaned unused code

Files:

- `src/pages/Analytics.jsx`
- `src/pages/Profile.jsx`

#### `src/pages/Analytics.jsx`

- Removed unused `Star` import.
- Removed unused `loading` state.
- Reworked the unused `defaultDrivers` variable.
- Kept the page behavior intact.

One added snippet:

```js
{drivers.length > 0 && (
  <StatBox label="Tracked Drivers" value={drivers.length.toString()} sub="live performance data" />
)}
```

#### `src/pages/Profile.jsx`

Removed unused imports:

```js
Activity, Calendar
```

### 6. Replaced the default CRA test with a real smoke test

File: `src/App.test.js`

The old test expected a "learn react" link and was not related to this app.

New test:

```js
test('renders the admin login screen when unauthenticated', () => {
  localStorage.clear();

  render(<App />);

  expect(screen.getByRole('heading', { name: /CleanSL Admin/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login to Dashboard/i })).toBeInTheDocument();
});
```

Because the app imports `axios`, `react-leaflet`, and `leaflet`, mocks were added:

```js
jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      }
    }
  };

  return {
    create: jest.fn(() => instance)
  };
});
```

```js
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  Polyline: () => null
}));
```

```js
jest.mock('leaflet', () => {
  const markerPrototype = { options: {} };

  return {
    icon: jest.fn(() => ({})),
    Marker: {
      prototype: markerPrototype
    }
  };
});
```

## Files Changed In This Session

- `package.json`
- `src/App.js`
- `src/pages/Login.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Overview.jsx`
- `src/pages/Violations.jsx`
- `src/pages/Analytics.jsx`
- `src/pages/Profile.jsx`
- `src/App.test.js`
- `START.bat`
- `START.ps1`
- `SETUP.md`

## Current Known Notes

- Build is clean.
- Tests pass.
- Jest still prints React Router future-flag warnings during test runs, but they are warnings only.
- The login footer text now renders with a normal bullet character in the UI.
- Duplicate Express backend folders were removed from the workspace flow, and the FastAPI backend was standardized to `../backend/`.

## How To Run

```bash
npm install
npm start
```

Frontend default URL:

```text
http://localhost:3000
```

## Suggested Next Steps

If another Codex continues from here, the best next checks would be:

1. Run the app visually and inspect the admin pages in-browser.
2. Confirm the backend endpoint at `http://localhost:8000` or the deployed fallback is returning the expected data shape.
3. Replace remaining mock-heavy sections with real API-driven data where needed.
4. Consider cleaning the React Router future warnings later if the app is upgraded further.
