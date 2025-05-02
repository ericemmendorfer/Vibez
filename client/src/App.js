import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import PingNotifications from './components/PingNotifications';

// Page Components
import Home from './pages/Home';
import Profile from './pages/Profile';
import BarDetails from './pages/BarDetails';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Map from './pages/Map';
import Friends from './pages/Friends';

// Context
import { AuthProvider } from './context/AuthContext';
import theme from './theme';

function App() {
  const [pings, setPings] = useState([
    {
      id: 1,
      sender: {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      message: 'Hey, want to meet at The Local Pub?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: 2,
      sender: {
        id: 3,
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      message: 'Great time at City Bar last night!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    }
  ]);

  const handlePingBack = (userId) => {
    // Here you would typically make an API call to send a ping back
    console.log(`Pinging back user ${userId}`);
    // For now, we'll just remove the ping
    setPings(pings.filter(ping => ping.sender.id !== userId));
  };

  const handleIgnore = (pingId) => {
    setPings(pings.filter(ping => ping.id !== pingId));
  };

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PingNotifications 
            pings={pings}
            onPingBack={handlePingBack}
            onIgnore={handleIgnore}
          />
          <Navbar />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/map"
              element={
                <PrivateRoute>
                  <Map />
                </PrivateRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <PrivateRoute>
                  <Friends />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/bar/:barId"
              element={
                <PrivateRoute>
                  <BarDetails />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 