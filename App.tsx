import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/authContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Members from './components/Members';
import Events from './components/Events';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AiAssistant from './components/AiAssistant';
import BreakingBanner from './components/BreakingBanner';
import WorldMap from './components/WorldMap';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { LanguageProvider } from './lib/languageContext';

const HomePage: React.FC = () => (
  <div className="bg-black min-h-screen text-white selection:bg-honda-red selection:text-white">
    <Navbar />
    <main>
      <Hero />
      <BreakingBanner />
      <About />
      <WorldMap />
      <Members />
      <Gallery />
      <Events />
      <Contact />
    </main>
    <Footer />
    <AiAssistant />
  </div>
);

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;