import { AuthProvider } from './app/providers/AuthProvider'
import { QueryProvider } from './app/providers/QueryProvider'
import { AppRouter } from './app/router'
import { UpdateAvailableToast } from './app/layout/UpdateAvailableToast'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
        <UpdateAvailableToast />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
