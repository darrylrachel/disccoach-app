import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useSignUp } from '../hooks/useAuthMutations'

export function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signUp = useSignUp()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    signUp.mutate({ email, password })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-white">Create your account</h1>
        <p className="mb-8 text-sm text-white/50">Start training with DiscCoach.</p>

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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {signUp.isError && (
            <p className="text-sm text-red-400">
              {signUp.error instanceof Error ? signUp.error.message : 'Unable to sign up.'}
            </p>
          )}

          {signUp.isSuccess && (
            <p className="text-sm text-brand-green">
              Check your email to confirm your account.
            </p>
          )}

          <Button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
