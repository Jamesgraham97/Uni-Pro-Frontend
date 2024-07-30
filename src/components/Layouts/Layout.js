import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from '../NavBars/PublicNavbar';
import AuthenticatedNavbar from '../NavBars/AuthenticatedNavbar';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div>
      {user ? <AuthenticatedNavbar /> : <PublicNavbar />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
