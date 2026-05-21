 import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import './Login.css';

// ─── API CONFIG ───────────────────────────────────────────────────────────────
const API = 'https://server-r5ni.onrender.com/api';

// STATIC DASHBOARD DATA
const DISTRICT_STATS = {

  municipalities: [

    { name: 'कालिन्चोक', count: 85, tokens: 8 },
    { name: 'गौरीशंकर', count: 55, tokens: 5 },
    { name: 'जिरी', count: 110, tokens: 10 },
    { name: 'तामाकोशी', count: 95, tokens: 9 },
    { name: 'बिगु', count: 130, tokens: 12 },
    { name: 'भिमेश्वर', count: 355, tokens: 30 },
    { name: 'मेलुङ', count: 28, tokens: 3 },
    { name: 'वैतेश्वर', count: 108, tokens: 10 },
    { name: 'शैलुङ', count: 78, tokens: 7 },

  ],

  trend: [

    { date: '2083-01-02', count: 42, tokens: 4 },
    { date: '2083-01-03', count: 78, tokens: 7 },
    { date: '2083-01-04', count: 75, tokens: 6 },
    { date: '2083-01-05', count: 30, tokens: 3 },
    { date: '2083-01-06', count: 128, tokens: 12 },
    { date: '2083-01-07', count: 120, tokens: 11 },
    { date: '2083-01-08', count: 196, tokens: 18 },
    { date: '2083-01-09', count: 100, tokens: 9 },
    { date: '2083-01-10', count: 230, tokens: 22 },
    { date: '2083-01-11', count: 132, tokens: 13 },

  ]

};

// BAR CHART
const BarChartMini = ({ data }) => {

  const max =
    Math.max(...data.map(d => d.count));

  const w = 480;
  const h = 220;
  const pb = 60;
  const pt = 10;
  const pl = 40;
  const pr = 10;

  const bw =
    Math.max(
      2,
      Math.floor(
        (w - pl - pr) / data.length
      ) - 4
    );

  return (

    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: '100%', height: '100%' }}
    >

      {data.map((d, i) => {

        const x =
          pl +
          i * ((w - pl - pr) / data.length) +
          2;

        const bh =
          Math.max(
            2,
            ((h - pt - pb) * d.count / max)
          );

        const y = pt + (h - pt - pb) - bh;

        return (

          <g key={i}>

            <rect
              x={x}
              y={y}
              width={bw}
              height={bh}
              fill="rgba(99,179,237,0.85)"
              rx="3"
            />

            <text
              x={x + bw / 2}
              y={h - pb + 14}
              fontSize="7"
              fill="white"
              textAnchor="middle"
              transform={`rotate(-35, ${x + bw / 2}, ${h - pb + 14})`}
            >
              {d.name}
            </text>

          </g>

        );

      })}

    </svg>

  );

};

// LINE CHART
const LineChartMini = ({ data }) => {

  const values = data.map(d => d.count);
  const max = Math.max(...values, 1);

  const w = 480;
  const h = 220;
  const pb = 44;
  const pt = 14;
  const pl = 38;
  const pr = 14;

  const xs =
    data.map((_, i) =>
      pl + i * ((w - pl - pr) / (data.length - 1))
    );

  const ys =
    data.map(d =>
      pt + (h - pt - pb) * (1 - d.count / (max * 1.1))
    );

  const path =
    xs.map((x, i) =>
      `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`
    ).join(' ');

  return (

    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: '100%', height: '100%' }}
    >

      <path
        d={path}
        fill="none"
        stroke="rgba(99,179,237,1)"
        strokeWidth="3"
      />

      {xs.map((x, i) => (

        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r="4"
          fill="#38e5c1"
          stroke="white"
          strokeWidth="1.5"
        />

      ))}

    </svg>

  );

};

// LIVE DASHBOARD
const LiveDashboard = () => {

  const [todayStats, setTodayStats] =
    useState({ totalCounts: 0, eCensusTokens: 0 });

  const calculateTodayStats =
    useCallback(() => {

      const today =
        new Date().toISOString().split('T')[0];

      let total = 0;
      let tokens = 0;

      for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        if (key && key.startsWith('workData_')) {

          const data =
            JSON.parse(localStorage.getItem(key) || '[]');

          const todayEntries =
            data.filter(e => e.date === today);

          total +=
            todayEntries.reduce(
              (s, e) => s + (parseInt(e.totalCount) || 0),
              0
            );

          tokens +=
            todayEntries.filter(e => e.censusToken).length;

        }

      }

      return { totalCounts: total, eCensusTokens: tokens };

    }, []);

  useEffect(() => {
    setTodayStats(calculateTodayStats());
  }, [calculateTodayStats]);

  return (

    <div className="login-dashboard">

      <div className="dashboard-card-hover">

        <div className="govt-badge">
          🇳🇵 Government of Nepal
        </div>

        <div className="dashboard-title">
          District Economic Census Office
        </div>

        <div className="dashboard-subtitle">
          Dolakha, Nepal
        </div>

      </div>

      <div className="dashboard-stats-row">

        <div className="dashboard-stat-card dashboard-card-hover">

          <div className="dashboard-stat-number">
            {todayStats.totalCounts}
          </div>

          <div className="dashboard-stat-label">
            Today's Total Counts
          </div>

        </div>

        <div className="dashboard-stat-card token dashboard-card-hover">

          <div className="dashboard-stat-number token">
            {todayStats.eCensusTokens}
          </div>

          <div className="dashboard-stat-label">
            Today's e-Census Tokens
          </div>

        </div>

      </div>

      <div className="dashboard-chart-card dashboard-card-hover">

        <div className="chart-title">
          📊 Municipality Data
        </div>

        <div className="chart-container">
          <BarChartMini data={DISTRICT_STATS.municipalities} />
        </div>

      </div>

      <div className="dashboard-chart-card dashboard-card-hover">

        <div className="chart-title">
          📈 Census Trend
        </div>

        <div className="chart-container">
          <LineChartMini data={DISTRICT_STATS.trend} />
        </div>

      </div>

    </div>

  );

};

// ADMIN PANEL
const AdminPanel = ({ token }) => {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // ── LOAD STAFF LIST FROM MONGODB ────────────────────────────────────────────
  const loadStaffList = useCallback(async () => {

    try {

      const res = await fetch(`${API}/staff-list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {

        setStaffList(data);

        // ── SYNC enumerators to localStorage so rest of app can use them ──
        const enumerators = data.map(s => ({
          id: s.username,
          name: s.name || s.username
        }));

        localStorage.setItem(
          'enumerators',
          JSON.stringify(enumerators)
        );

      }

    } catch {
      console.error('Could not load staff list');
    }

  }, [token]);

  useEffect(() => {
    if (token) loadStaffList();
  }, [token, loadStaffList]);

  // ── CREATE STAFF → SAVE TO MONGODB + SYNC localStorage ─────────────────────
  const createStaff = async () => {

    if (!name || !username || !password) {
      setMessage({ text: 'Fill all fields', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {

      const res = await fetch(`${API}/create-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username.toUpperCase(),
          password,
          name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || 'Failed to create account', type: 'error' });
        setLoading(false);
        return;
      }

      setMessage({ text: `✅ "${username.toUpperCase()}" created successfully!`, type: 'success' });

      // ── Reload staff list so enumerators updates immediately ──
      await loadStaffList();

      setName('');
      setUsername('');
      setPassword('');

    } catch {
      setMessage({ text: '❌ Cannot reach server. Make sure backend is running.', type: 'error' });
    }

    setLoading(false);

  };

  return (

    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        background: '#1c1c1c',
        borderRadius: '12px'
      }}
    >

      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        Admin Staff Creator
      </h2>

      <div className="form-group">
        <label>Staff Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Staff Name"
        />
      </div>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toUpperCase())}
          placeholder="Enter Username"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
      </div>

      {message.text && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '14px',
            background: message.type === 'success'
              ? 'rgba(56,229,193,0.15)'
              : 'rgba(255,80,80,0.15)',
            color: message.type === 'success' ? '#38e5c1' : '#ff5050',
            border: `1px solid ${message.type === 'success' ? '#38e5c1' : '#ff5050'}`
          }}
        >
          {message.text}
        </div>
      )}

      <button
        className="login-submit-btn"
        onClick={createStaff}
        disabled={loading}
      >
        {loading ? '⏳ Creating...' : '➕ Create Staff Account'}
      </button>

      {/* ── STAFF LIST ── */}
      {staffList.length > 0 && (

        <div style={{ marginTop: '24px' }}>

          <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '16px' }}>
            👥 Staff Accounts ({staffList.length})
          </h3>

          {staffList.map((s, i) => (

            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: '#2a2a2a',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            >

              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                  {s.name || s.username}
                </div>
                <div style={{ color: '#aaa', fontSize: '12px' }}>
                  @{s.username}
                </div>
              </div>

              <div style={{ color: '#38e5c1', fontSize: '12px' }}>
                staff
              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

// MAIN LOGIN COMPONENT
const Login = ({ onLogin }) => {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState('');

  // ── AUTO-LOGIN if valid token saved ─────────────────────────────────────────
  useEffect(() => {

    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');

    if (savedToken && savedUser) {

      try {

        const user = JSON.parse(savedUser);

        fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        })
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(() => {
            setToken(savedToken);
            setLoggedInUser(user);
            if (onLogin) onLogin(user, user.role);
          })
          .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          });

      } catch {}

    }

  }, [onLogin]);

  // ── LOGIN VIA MONGODB API ────────────────────────────────────────────────────
  const handleLogin = async (e) => {

    e.preventDefault();

    setLoginError('');
    setLoading(true);

    try {

      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userId, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Invalid Username or Password');
        setLoading(false);
        return;
      }

      // Save token + user for auto-login
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role);

      setToken(data.token);
      setLoggedInUser(data.user);

      if (onLogin) onLogin(data.user, data.user.role);

    } catch {
      setLoginError('Cannot reach server. Make sure backend is running on port 5000.');
    }

    setLoading(false);

  };

  // ── ADMIN SCREEN ─────────────────────────────────────────────────────────────
  if (loggedInUser && loggedInUser.role === 'admin') {

    return (

      <div className="login-container">

        <div className="login-form-side">

          <div className="login-card">

            <h1>Welcome Admin</h1>
            <h2>{loggedInUser.name}</h2>

            <AdminPanel token={token} />

          </div>

        </div>

      </div>

    );

  }

  // ── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  return (

    <div className="login-container">

      <LiveDashboard />

      <div className="login-form-side">

        <div className="login-card login-card-hover">

          <div className="login-flag">🇳🇵</div>

          <div className="login-title">

            <h1>District Economic Census Office</h1>
            <h2>Dolakha, Nepal</h2>
            <p>GPS Attendance & Census Management System</p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label>Username</label>

              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value.toUpperCase())}
                placeholder="Enter Username"
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>

              </div>

            </div>

            {loginError && (
              <div className="login-error">{loginError}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>

          </form>

          <div className="login-footer">
            <p>District Economic Census Office, Dolakha</p>
            <p className="demo-credentials">PAWAN / 8586</p>
          </div>

        </div>

      </div>

    </div>

  );

};

export default Login;
