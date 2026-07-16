import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../../features/auth/hooks/useSession'
import { LoadingScreen } from '../layout/LoadingScreen'

export function PublicOnly() {
  const { user, isLoading } = useSession()

  if (isLoading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />

  return <Outlet />
}
