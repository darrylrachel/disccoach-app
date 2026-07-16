import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useSignIn } from '../hooks/useAuthMutations'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signIn = useSignIn()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    signIn.mutate({ email, password })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-white">Welcome back</h1>
        <p className="mb-8 text-sm text-white/50">Log in to keep training.</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {signIn.isError && (
            <p className="text-sm text-red-400">
              {signIn.error instanceof Error ? signIn.error.message : 'Unable to sign in.'}
            </p>
          )}

          <Button type="submit" disabled={signIn.isPending}>
            {signIn.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          New to DiscCoach?{' '}
          <Link to="/sign-up" className="text-brand-green">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
