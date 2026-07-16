import { AuthProvider } from './app/providers/AuthProvider'
import { QueryProvider } from './app/providers/QueryProvider'
import { AppRouter } from './app/router'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
