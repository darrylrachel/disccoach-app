import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './guards/RequireAuth'
import { RequireOnboarding } from './guards/RequireOnboarding'
import { PublicOnly } from './guards/PublicOnly'
import { AppShell } from './layout/AppShell'
import { LoadingScreen } from './layout/LoadingScreen'

const LoginScreen = lazy(() => import('../features/auth/screens/LoginScreen').then((m) => ({ default: m.LoginScreen })))
const SignUpScreen = lazy(() => import('../features/auth/screens/SignUpScreen').then((m) => ({ default: m.SignUpScreen })))
const OnboardingScreen = lazy(() =>
  import('../features/profile/screens/OnboardingScreen').then((m) => ({ default: m.OnboardingScreen })),
)
const DiscListScreen = lazy(() => import('../features/discs/screens/DiscListScreen').then((m) => ({ default: m.DiscListScreen })))
const DiscDetailScreen = lazy(() =>
  import('../features/discs/screens/DiscDetailScreen').then((m) => ({ default: m.DiscDetailScreen })),
)
const AddDiscScreen = lazy(() => import('../features/discs/screens/AddDiscScreen').then((m) => ({ default: m.AddDiscScreen })))
const BagListScreen = lazy(() => import('../features/bags/screens/BagListScreen').then((m) => ({ default: m.BagListScreen })))
const BagDetailScreen = lazy(() =>
  import('../features/bags/screens/BagDetailScreen').then((m) => ({ default: m.BagDetailScreen })),
)
const PracticeHomeScreen = lazy(() =>
  import('../features/practice/screens/PracticeHomeScreen').then((m) => ({ default: m.PracticeHomeScreen })),
)
const ActiveSessionScreen = lazy(() =>
  import('../features/practice/screens/ActiveSessionScreen').then((m) => ({ default: m.ActiveSessionScreen })),
)
const SessionSummaryScreen = lazy(() =>
  import('../features/practice/screens/SessionSummaryScreen').then((m) => ({ default: m.SessionSummaryScreen })),
)
const DashboardScreen = lazy(() =>
  import('../features/progress/screens/DashboardScreen').then((m) => ({ default: m.DashboardScreen })),
)
const HistoryScreen = lazy(() => import('../features/progress/screens/HistoryScreen').then((m) => ({ default: m.HistoryScreen })))
const ProgramsScreen = lazy(() =>
  import('../features/programs/screens/ProgramsScreen').then((m) => ({ default: m.ProgramsScreen })),
)
const ProgramDetailScreen = lazy(() =>
  import('../features/programs/screens/ProgramDetailScreen').then((m) => ({ default: m.ProgramDetailScreen })),
)
const ActiveProgramScreen = lazy(() =>
  import('../features/programs/screens/ActiveProgramScreen').then((m) => ({ default: m.ActiveProgramScreen })),
)
const EquipmentSelectionScreen = lazy(() =>
  import('../features/resistanceTraining/screens/EquipmentSelectionScreen').then((m) => ({
    default: m.EquipmentSelectionScreen,
  })),
)
const ResistanceWorkoutScreen = lazy(() =>
  import('../features/resistanceTraining/screens/ResistanceWorkoutScreen').then((m) => ({
    default: m.ResistanceWorkoutScreen,
  })),
)
const AccountScreen = lazy(() =>
  import('../features/account/screens/AccountScreen').then((m) => ({ default: m.AccountScreen })),
)
const AboutScreen = lazy(() => import('../features/support/screens/AboutScreen').then((m) => ({ default: m.AboutScreen })))
const SupportScreen = lazy(() =>
  import('../features/support/screens/SupportScreen').then((m) => ({ default: m.SupportScreen })),
)
const PrivacyScreen = lazy(() =>
  import('../features/support/screens/PrivacyScreen').then((m) => ({ default: m.PrivacyScreen })),
)
const TermsScreen = lazy(() => import('../features/support/screens/TermsScreen').then((m) => ({ default: m.TermsScreen })))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
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
                <Route path="/history" element={<HistoryScreen />} />
                <Route path="/discs" element={<DiscListScreen />} />
                <Route path="/discs/new" element={<AddDiscScreen />} />
                <Route path="/discs/:discId" element={<DiscDetailScreen />} />
                <Route path="/bags" element={<BagListScreen />} />
                <Route path="/bags/:bagId" element={<BagDetailScreen />} />
                <Route path="/practice" element={<PracticeHomeScreen />} />
                <Route path="/practice/:sessionId" element={<ActiveSessionScreen />} />
                <Route path="/practice/:sessionId/summary" element={<SessionSummaryScreen />} />
                <Route path="/programs" element={<ProgramsScreen />} />
                <Route path="/programs/active" element={<ActiveProgramScreen />} />
                <Route path="/programs/:programId" element={<ProgramDetailScreen />} />
                <Route path="/programs/:programId/equipment" element={<EquipmentSelectionScreen />} />
                <Route path="/resistance/:sessionId" element={<ResistanceWorkoutScreen />} />
                <Route path="/account" element={<AccountScreen />} />
                <Route path="/about" element={<AboutScreen />} />
                <Route path="/support" element={<SupportScreen />} />
                <Route path="/privacy" element={<PrivacyScreen />} />
                <Route path="/terms" element={<TermsScreen />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
