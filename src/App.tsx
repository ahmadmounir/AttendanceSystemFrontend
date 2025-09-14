import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { ProtectedRoute } from './components/protected-route'
import { AuthProtectedRoute } from './components/auth-protected-route'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import ResetPassword from './pages/auth/reset-password'
import Home from './pages/home'
import { Toaster } from './components/ui/toaster'
import { ToastContainer } from 'react-toastify'
import { toastContainerConfig } from './components/ui/toast-config'

// Add this script to set theme on initial page load
const setInitialTheme = () => {
  const theme = localStorage.getItem('engage-ui-theme') || 'system';
  const root = window.document.documentElement;
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
    document.body.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
    document.body.classList.add(theme);
  }
};

// Execute it immediately
setInitialTheme();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="engage-ui-theme">
      <Router>
        <Routes>
          {/* Auth routes - protected from authenticated users */}
          <Route element={<AuthProtectedRoute />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
          </Route>
          
          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            {/* Add more protected routes here */}
          </Route>
          
          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
      <ToastContainer {...toastContainerConfig} />
    </ThemeProvider>
  )
}

export default App
