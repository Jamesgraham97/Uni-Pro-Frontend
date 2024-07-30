import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthenticatedNavbar from '../NavBars/AuthenticatedNavbar';
import './AuthenticatedLayout.css';

const AuthenticatedLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-auto bg-dark sticky-top">
          <AuthenticatedNavbar />
        </div>
        <div className="col-sm p-3 min-vh-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
