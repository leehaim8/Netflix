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
import MyList from './MyList';
import ReviewPage from './Review/Review';
import AdminHomePage from './AdminHomePage/AdminHomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/userprofile/:userId" element={<ProtectedRoute allowedRoles={['user']}> <UserProfile /> </ProtectedRoute>} />
        <Route path="/homepage/:id" element={<ProtectedRoute allowedRoles={['user']}> <HomePage /> </ProtectedRoute>} />
        <Route path="/tvShows/:id" element={<ProtectedRoute allowedRoles={['user']}> <TvShows /> </ProtectedRoute>} />
        <Route path="/movies/:id" element={<ProtectedRoute allowedRoles={['user']}> <Movies /> </ProtectedRoute>} />
        <Route path="/newAndPopular/:id" element={<ProtectedRoute allowedRoles={['user']}> <NewAndPopular /> </ProtectedRoute>} />
        <Route path="/MyList/:id" element={<ProtectedRoute allowedRoles={['user']}> <MyList /> </ProtectedRoute>} />
        <Route path="/review/:profileId/:itemId" element={<ProtectedRoute allowedRoles={['user']}> <ReviewPage /> </ProtectedRoute>} />
        <Route path="/adminHomePage/:id" element={<ProtectedRoute allowedRoles={['admin']}> <AdminHomePage /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
