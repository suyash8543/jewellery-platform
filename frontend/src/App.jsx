import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoldRateProvider } from './context/GoldRateContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyMobileBar from './components/StickyMobileBar';

import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import CustomOrderSample from './pages/CustomOrderSample';
import CheckGoldRates from './pages/CheckGoldRates';
import DiwaliOffers from './pages/DiwaliOffers';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <GoldRateProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-ivory font-sans selection:bg-gold-200 selection:text-burgundy-950">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/custom-sample" element={<CustomOrderSample />} />
              <Route path="/gold-rates" element={<CheckGoldRates />} />
              <Route path="/diwali-offers" element={<DiwaliOffers />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <StickyMobileBar />
        </div>
      </Router>
    </GoldRateProvider>
  );
}
