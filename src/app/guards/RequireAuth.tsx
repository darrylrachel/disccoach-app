import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../../features/auth/hooks/useSession'
import { LoadingScreen } from '../layout/LoadingScreen'

export function RequireAuth() {
  const { user, isLoading } = useSession()

  if (isLoading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
