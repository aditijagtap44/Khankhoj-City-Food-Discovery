import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ExploreCitiesPage from './pages/ExploreCitiesPage';
import CityDetailPage from './pages/CityDetailPage';
import FamousFoodsPage from './pages/FamousFoodsPage';
import FoodDetailPage from './pages/FoodDetailPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import HiddenGemsPage from './pages/HiddenGemsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';
import AddPlacePage from './pages/AddPlacePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExploreCitiesPage />} />
                  <Route path="/city/:slug" element={<CityDetailPage />} />
                  <Route path="/famous-foods" element={<FamousFoodsPage />} />
                  <Route path="/food/:id" element={<FoodDetailPage />} />
                  <Route path="/place/:id" element={<PlaceDetailPage />} />
                  <Route path="/hidden-gems" element={<HiddenGemsPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/add-place" element={<AddPlacePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
