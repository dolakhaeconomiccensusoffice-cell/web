 import React, { useState, useRef } from 'react';
import './create.css';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API = 'https://server-r5ni.onrender.com/api';

const Create = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState({ text: '', type: '' });

  const passwordRef = useRef(null);

  const createStaffAccount = async () => {
    if (!username || !password) {
      setMessage({ text: 'Please fill all fields', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API}/create-staff`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username.toUpperCase(),
          password,
          name: username.toUpperCase()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || 'Failed to create account', type: 'error' });
        setLoading(false);
        return;
      }

      setMessage({ text: `✅ Staff account "${data.username}" created successfully!`, type: 'success' });
      setUsername('');
      setPassword('');

    } catch {
      setMessage({ text: '❌ Cannot reach server. Check connection.', type: 'error' });
    }

    setLoading(false);
  };

  return (
    <div className="create-staff-container">
      <div className="create-card">
        <h2>➕ Create Staff Account</h2>

        {/* USERNAME */}
        <div className="create-input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={e => setUsername(e.target.value.toUpperCase())}
            onKeyDown={e => {
              if (e.key === 'Enter') passwordRef.current?.focus();
            }}
            autoFocus
          />
        </div>

        {/* PASSWORD */}
        <div className="create-input-group">
          <label>Password</label>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') createStaffAccount();
            }}
          />
        </div>

        {/* FEEDBACK MESSAGE */}
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
          className="create-btn"
          onClick={createStaffAccount}
          disabled={loading}
        >
          {loading ? '⏳ Creating...' : 'Create Staff'}
        </button>
      </div>
    </div>
  );
};

export default Create;
