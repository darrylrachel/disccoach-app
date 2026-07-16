import { useMutation } from '@tanstack/react-query'
import { signIn, signOut, signUp } from '../../../services/auth.service'

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
  })
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  })
}
