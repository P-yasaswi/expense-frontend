import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="navbar">
    <div>💸 Expense Tracker</div>
    <div>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/chart">Charts</Link>
      <Link to="/login" onClick={() => localStorage.clear()}>Logout</Link>
    </div>
  </div>
);

export default Navbar;
