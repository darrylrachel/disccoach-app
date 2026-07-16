import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../../features/profile/hooks/useProfile'
import { isOnboardingComplete } from '../../domain/profile/models'
import { LoadingScreen } from '../layout/LoadingScreen'

export function RequireOnboarding() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) return <LoadingScreen />
  if (!isOnboardingComplete(profile ?? null)) return <Navigate to="/onboarding" replace />

  return <Outlet />
}
