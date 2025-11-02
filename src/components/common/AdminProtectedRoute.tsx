import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface AdminProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean // If true, requires admin role; if false, editor+ is enough
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          setAuthenticated(false)
          setAuthorized(false)
          setLoading(false)
          return
        }

        setAuthenticated(true)

        // Check user role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          setAuthorized(false)
        } else {
          const userRole = profile?.role
          if (requireAdmin) {
            setAuthorized(userRole === 'admin')
          } else {
            setAuthorized(userRole === 'admin' || userRole === 'editor')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthenticated(false)
        setAuthorized(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setAuthenticated(false)
          setAuthorized(false)
        } else if (event === 'SIGNED_IN' && session?.user) {
          setAuthenticated(true)
          // Re-check authorization
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          const userRole = profile?.role
          if (requireAdmin) {
            setAuthorized(userRole === 'admin')
          } else {
            setAuthorized(userRole === 'admin' || userRole === 'editor')
          }
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [requireAdmin])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
            {requireAdmin ? ' Admin privileges required.' : ' Editor privileges required.'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AdminProtectedRoute