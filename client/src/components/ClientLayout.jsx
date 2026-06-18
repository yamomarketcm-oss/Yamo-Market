import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const ClientLayout = ({ children }) => {
  return (
    <div className="">
      <Navbar />
      <div className="">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;

