import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import WatchlistPage from './pages/WatchlistPage'
import LibraryPage from './pages/LibraryPage'
import HistoryPage from './pages/HistoryPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import MoviesManagementPage from './pages/admin/MoviesManagementPage'
import MusicManagementPage from './pages/admin/MusicManagementPage'
import GamesManagementPage from './pages/admin/GamesManagementPage'
import UsersManagementPage from './pages/admin/UsersManagementPage'
import MediaLibraryPage from './pages/admin/MediaLibraryPage'
import SiteSettingsPage from './pages/admin/SiteSettingsPage'
import AdminProtectedRoute from './components/common/AdminProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute.tsx'
import './styles/main.css'
import './styles/header.css'
import './styles/movie.css'
import './styles/auth.css'
import './styles/admin.css'
import './styles/player.css'
import './styles/movie-details.css'
import './styles/cards.css'
import './styles/profile.css'

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="movies" element={<MoviesManagementPage />} />
              <Route path="music" element={<MusicManagementPage />} />
              <Route path="games" element={<GamesManagementPage />} />
              <Route path="users" element={<UsersManagementPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
              <Route path="settings" element={<SiteSettingsPage />} />
            </Route>
            
            {/* Auth Routes */}
            <Route path="/auth/callback" element={
              <div className="container">
                <div className="auth-container">
                  <div className="auth-card">
                    <h2>Verifying your account...</h2>
                    <p>Please wait while we verify your account.</p>
                  </div>
                </div>
              </div>
            } />
            
            {/* Public Routes */}
            <Route path="/" element={
               <ProtectedRoute requireAuth={false}>
                 <>
                   <Header />
                   <main className="main-content">
                     <div className="container">
                       <HomePage />
                     </div>
                   </main>
                 </>
               </ProtectedRoute>
             } />
            <Route path="/movies" element={
               <ProtectedRoute requireAuth={false}>
                 <>
                   <Header />
                   <main className="main-content">
                     <div className="container">
                       <MoviesPage />
                     </div>
                   </main>
                 </>
               </ProtectedRoute>
             } />
            <Route path="/movies/:id" element={
               <ProtectedRoute requireAuth={false}>
                 <>
                   <Header />
                   <main className="main-content">
                     <div className="container">
                       <MovieDetailsPage />
                     </div>
                   </main>
                 </>
               </ProtectedRoute>
             } />
            <Route path="/login" element={
              <>
                <Header />
                <main className="main-content">
                  <div className="container">
                    <LoginPage />
                  </div>
                </main>
              </>
            } />
            <Route path="/register" element={
              <>
                <Header />
                <main className="main-content">
                  <div className="container">
                    <RegisterPage />
                  </div>
                </main>
              </>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requireAuth={true}>
                <>
                  <Header />
                  <main className="main-content">
                    <div className="container">
                      <ProfilePage />
                    </div>
                  </main>
                </>
              </ProtectedRoute>
            } />
            <Route path="/watchlist" element={
              <ProtectedRoute requireAuth={true}>
                <>
                  <Header />
                  <main className="main-content">
                    <div className="container">
                      <WatchlistPage />
                    </div>
                  </main>
                </>
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute requireAuth={true}>
                <>
                  <Header />
                  <main className="main-content">
                    <div className="container">
                      <LibraryPage />
                    </div>
                  </main>
                </>
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute requireAuth={true}>
                <>
                  <Header />
                  <main className="main-content">
                    <div className="container">
                      <HistoryPage />
                    </div>
                  </main>
                </>
              </ProtectedRoute>
            } />
          </Routes>
          <footer className="footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} MovieFlix. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
