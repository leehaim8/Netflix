import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './SingIn/SingIn';
import Register from './SingUp/SingUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
