import { useSignOut } from '../../auth/hooks/useAuthMutations'

export function DashboardScreen() {
  const signOut = useSignOut()

  return (
    <div className="px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">DiscCoach</h1>
        <button
          type="button"
          onClick={() => signOut.mutate()}
          className="text-sm text-white/50 hover:text-white"
        >
          Sign out
        </button>
      </div>
      <p className="text-white/50">
        Your dashboard will show your active bag, recent sessions, progress trends, and PRs
        here starting in Phase 4.
      </p>
    </div>
  )
}
