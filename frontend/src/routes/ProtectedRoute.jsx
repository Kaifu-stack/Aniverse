import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not logged in.
 */
export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth()

  // Wait for auth to initialize before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void">
        <div className="w-10 h-10 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}
