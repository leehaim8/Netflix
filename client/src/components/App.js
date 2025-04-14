import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './SingIn/SingIn';
import Register from './SingUp/SingUp';
import UserProfile from './UserProfile/UserProfile';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './HomePage/HomePage';
import TvShows from './TvShows';
import Movies from './Movies';
import NewAndPopular from './NewAndPopular/NewAndPopular';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/userprofile/:userId" element={<ProtectedRoute> <UserProfile /> </ProtectedRoute>} />
        <Route path="/homepage/:id" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
        <Route path="/tvShows/:id" element={<ProtectedRoute> <TvShows /> </ProtectedRoute>} />
        <Route path="/movies/:id" element={<ProtectedRoute> <Movies /> </ProtectedRoute>} />
        <Route path="/newAndPopular/:id" element={<ProtectedRoute> <NewAndPopular /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
