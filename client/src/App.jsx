import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetail from './components/Productdetail';
import BoutiqueDetail from './components/BoutiqueDetail';
import Boutiques from './components/Boutiques';
import UserProfile from './components/UserProfile';
import MyShopPage from './components/MyShopPage';
import AboutPage from './components/AboutPage';
import UserRoute from './PermissionRoute/UserRoute';
import AdminRoute from './PermissionRoute/AdminRoute';
import ProductsPage from './components/ProductsPage';
import AdsPage from './components/AdsPage';
import ClientLayout from './components/ClientLayout';

function AppRoutes() {

  const { currentUser, loading } = useAuth();

   if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<ClientLayout><LandingPage /></ClientLayout>} />
      <Route path="/boutiques" element={<ClientLayout><Boutiques /></ClientLayout>} />
      <Route path="/products" element={<ClientLayout><ProductsPage /></ClientLayout>} />
      <Route path="/product/:slug" element={<ClientLayout><ProductDetail /></ClientLayout>} />
      <Route path="/boutique/:slug" element={<ClientLayout><BoutiqueDetail /></ClientLayout>} />
      <Route path="/banner" element={<ClientLayout><AdsPage /></ClientLayout>} />
      <Route element={<UserRoute />}>
        <Route path="/user" element={<ClientLayout><UserProfile /></ClientLayout>} />
        <Route path="/my-shop/:shop_id" element={<ClientLayout><MyShopPage /></ClientLayout>} />
      </Route> 
      <Route path="/about" element={<ClientLayout><AboutPage /></ClientLayout>} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
     </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
            <div className="">
              <AppRoutes />
            </div>
      </AuthProvider>
    </Router>
  );
}

export default App;