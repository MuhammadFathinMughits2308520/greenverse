import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from './context/DarkModeContext';
import LandingPage from './page/landingpage';
import Navbar from './component/navbar';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './page/loginpage';
import RegisterPage from './page/registerpage';
import Ecombot from './page/ecombot';
import NotFound from './page/notfound';
import ComicReader from './page/comicreader';
import './styles/globals.css';  // ← TAMBAHKAN INI

function App() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* Routes dengan Navbar */}
          <Route path='/' element={
            <>
              <Navbar scrollToSection={scrollToSection} />
              <LandingPage />
            </>
          } />
          
          {/* Routes tanpa Navbar (Auth pages) */}
          <Route path='/login' element={<LoginPage /> } />
          <Route path='/register' element={<RegisterPage />} />
          <Route
          path="/ecombot"
          element={
            <ProtectedRoute>
              <Ecombot />
            </ProtectedRoute>
          }
        />
          <Route path="/ecomic" 
          element={
            <ProtectedRoute>
              <ComicReader comic="my-comic" episode="e_001" />
            </ProtectedRoute>
          }
          />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;