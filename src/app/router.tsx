import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './guards/RequireAuth'
import { RequireOnboarding } from './guards/RequireOnboarding'
import { PublicOnly } from './guards/PublicOnly'
import { AppShell } from './layout/AppShell'
import { LoginScreen } from '../features/auth/screens/LoginScreen'
import { SignUpScreen } from '../features/auth/screens/SignUpScreen'
import { OnboardingScreen } from '../features/profile/screens/OnboardingScreen'
import { DiscListScreen } from '../features/discs/screens/DiscListScreen'
import { DiscDetailScreen } from '../features/discs/screens/DiscDetailScreen'
import { AddDiscScreen } from '../features/discs/screens/AddDiscScreen'
import { BagListScreen } from '../features/bags/screens/BagListScreen'
import { BagDetailScreen } from '../features/bags/screens/BagDetailScreen'
import { PracticeHomeScreen } from '../features/practice/screens/PracticeHomeScreen'
import { DashboardScreen } from '../features/progress/screens/DashboardScreen'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/sign-up" element={<SignUpScreen />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<OnboardingScreen />} />

          <Route element={<RequireOnboarding />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/discs" element={<DiscListScreen />} />
              <Route path="/discs/new" element={<AddDiscScreen />} />
              <Route path="/discs/:discId" element={<DiscDetailScreen />} />
              <Route path="/bags" element={<BagListScreen />} />
              <Route path="/bags/:bagId" element={<BagDetailScreen />} />
              <Route path="/practice" element={<PracticeHomeScreen />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
