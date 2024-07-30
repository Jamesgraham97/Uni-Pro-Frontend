import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../NavBars/PublicNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const PublicLayout = () => {
  return (
    <div>
      <PublicNavbar />
      <div className="container mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
