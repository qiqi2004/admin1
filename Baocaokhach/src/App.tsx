import { HashRouter, Route, Routes } from 'react-router'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/toast'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import AdminCRM from './pages/AdminCRM'

/**
 * Component chính của ứng dụng với authentication
 */
function AppContent() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Dashboard /> : <LoginPage />} />
        <Route path="/admin-crm" element={<AdminCRM />} />
      </Routes>
    </HashRouter>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
