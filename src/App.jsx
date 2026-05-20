 import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './Components/Login';
import Header from './components/Header';
import Hero from './components/Hero';
import Govt from './components/Govt';
import Admin from './components/Admin';
import Staff from './components/Staff';
import Footer from './components/Footer';
import Create from './components/create';

function App() {

  const [userRole, setUserRole] =
    useState(null);

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    // RESTORE SESSION
    const storedUser =
      localStorage.getItem('user');

    const storedRole =
      localStorage.getItem('userRole');

    if (
      storedUser &&
      storedRole
    ) {

      setUser(
        JSON.parse(storedUser)
      );

      setUserRole(storedRole);

    }

    // DEFAULT USERS
    if (
      !localStorage.getItem('passwordSystem')
    ) {

      const passwordSystem = {

        PAWAN: {

          password: btoa('8586'),
          role: 'admin',
          name: 'Pawan',
          createdAt:
            new Date().toISOString()

        },

        STAFF1: {

          password: btoa('1234'),
          role: 'staff',
          name: 'Staff User',
          createdAt:
            new Date().toISOString()

        }

      };

      localStorage.setItem(
        'passwordSystem',
        JSON.stringify(passwordSystem)
      );

    }

    // ENUMERATORS
    if (
      !localStorage.getItem('enumerators')
    ) {

      localStorage.setItem(
        'enumerators',
        JSON.stringify([
          {
            id: 'STAFF1',
            name: 'Staff User'
          }
        ])
      );

    }

    // OTHER STORAGE
    if (
      !localStorage.getItem('notifications')
    ) {

      localStorage.setItem(
        'notifications',
        JSON.stringify([])
      );

    }

    if (
      !localStorage.getItem('activityLogs')
    ) {

      localStorage.setItem(
        'activityLogs',
        JSON.stringify([])
      );

    }

    if (
      !localStorage.getItem('tokenCounter')
    ) {

      localStorage.setItem(
        'tokenCounter',
        '1000'
      );

    }

    if (
      !localStorage.getItem('suspendedStaff')
    ) {

      localStorage.setItem(
        'suspendedStaff',
        JSON.stringify([])
      );

    }

    // DEFAULT NOTICES
    if (
      !localStorage.getItem('notices')
    ) {

      const sampleNotices = [

        {
          id: Date.now(),

          title:
            'Welcome to DECO Dolakha',

          content:
            'Welcome to the District Economic Census Office.',

          priority: 'high',

          createdAt:
            new Date().toISOString(),

          createdBy: 'PAWAN'
        },

        {
          id: Date.now() + 1,

          title:
            'Attendance Rules',

          content:
            'Check-in between 9:00 AM - 10:30 AM.',

          priority: 'normal',

          createdAt:
            new Date().toISOString(),

          createdBy: 'PAWAN'
        }

      ];

      localStorage.setItem(
        'notices',
        JSON.stringify(sampleNotices)
      );

    }

  }, []);

  // LOGIN FUNCTION
  const handleLogin = (
    userData,
    role
  ) => {

    setUser(userData);
    setUserRole(role);

  };

  // NOT LOGGED IN
  if (!user) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );

  }

  // ADMIN PANEL
  if (userRole === 'admin') {

    return (

      <div className="app">

        <Header />

        <Admin />

        {/* CREATE STAFF ACCOUNT */}
        <Create />

        <Footer />

      </div>

    );

  }

  // STAFF PANEL
  return (

    <div className="app">

      <Header />

      <Hero />

      <Govt />

      <Staff />

      <Footer />

    </div>

  );

}

export default App;