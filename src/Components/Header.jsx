 import React, { useState, useEffect } from 'react';

const Header = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const loadNotifications = () => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    let userNotifs;
    if (userRole === 'admin') {
      userNotifs = allNotifs.filter(n => n.for === 'admin' || n.for === 'all');
    } else {
      userNotifs = allNotifs.filter(n => n.employeeId === user?.id || n.for === 'all' || n.for === 'staff');
    }
    setNotifications(userNotifs);
    setUnreadCount(userNotifs.filter(n => !n.read).length);
  };

  const markAsRead = (notifId) => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = allNotifs.map(n => n.id === notifId ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    if (onLogout) onLogout();
    window.location.reload();
  };

  useEffect(() => {
    if (user) loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">📊</span>
        <div>
          <h2>DECO Dolakha</h2>
          <span>{userRole === 'admin' ? 'Admin Portal' : 'Census Field Portal'}</span>
        </div>
      </div>
      <div className="nav-menu">
        <button className="nav-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        {userRole === 'staff' && (
          <button 
            className="nav-btn attend" 
            onClick={() => {
              const event = new CustomEvent('showAttendanceModal');
              window.dispatchEvent(event);
            }}
          >
            📍 Mark Attendance
          </button>
        )}
        <div className="notif-wrap" onClick={() => setShowNotifications(!showNotifications)}>
          🔔{unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </div>
        <div className="user-chip">
          <div className="user-avatar">{user.name?.charAt(0) || 'U'}</div>
          <div>
            <div className="user-name">{user.name || user.id}</div>
            <div className="user-id">{user.id}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {showNotifications && (
        <div className="notif-dropdown">
          <h3>🔔 Notifications</h3>
          {notifications.length === 0 ? (
            <div className="no-notifications">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markAsRead(n.id)}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{new Date(n.timestamp).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .navbar {
          background: linear-gradient(135deg, #3730a3, #4f46e5);
          color: #fff;
          padding: 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 60px;
          position: sticky;
          top: 0;
          z-index: 100;
          flex-wrap: wrap;
        }
        .nav-brand { display: flex; align-items: center; gap: 12px; }
        .brand-icon { font-size: 24px; }
        .nav-brand h2 { font-size: 15px; font-weight: 800; }
        .nav-brand span { font-size: 11px; opacity: 0.75; }
        .nav-menu { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
        .nav-btn {
          padding: 6px 13px;
          border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .nav-btn.attend { background: #e53e3e; border-color: #e53e3e; }
        .notif-wrap { position: relative; cursor: pointer; font-size: 19px; }
        .notif-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #e53e3e;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 50%;
          width: 17px;
          height: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-chip { display: flex; align-items: center; gap: 8px; }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .user-name { font-size: 12px; font-weight: 700; }
        .user-id { font-size: 11px; opacity: 0.7; }
        .logout-btn {
          padding: 6px 13px;
          border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.4);
          background: transparent;
          color: #fff;
          cursor: pointer;
        }
        .notif-dropdown {
          position: fixed;
          top: 70px;
          right: 18px;
          width: 320px;
          background: #fff;
          border-radius: 13px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          z-index: 200;
          max-height: 400px;
          overflow-y: auto;
        }
        body.dark-mode .notif-dropdown { background: #1a1a2e; color: #e6edf3; }
        .notif-dropdown h3 { padding: 12px 15px; font-size: 13px; font-weight: 800; border-bottom: 1px solid #f0f0f0; }
        .notif-item { padding: 10px 15px; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
        .notif-item.unread { background: #f5f3ff; }
        .notif-title { font-size: 12px; font-weight: 800; }
        .notif-msg { font-size: 11px; color: #666; margin-top: 3px; }
        .notif-time { font-size: 10px; color: #999; margin-top: 4px; }
        .no-notifications { padding: 18px; text-align: center; color: #bbb; font-size: 12px; }
        @media (max-width: 768px) {
          .navbar { flex-wrap: wrap; height: auto; padding: 10px 15px; }
          .nav-menu { flex-wrap: wrap; justify-content: center; margin-top: 8px; }
          .notif-dropdown { width: 280px; right: 10px; }
        }
      `}</style>
    </nav>
  );
};

export default Header;