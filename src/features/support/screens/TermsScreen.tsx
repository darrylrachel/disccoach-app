import { BackLink } from '../components/BackLink'

export function TermsScreen() {
  return (
    <div className="px-6 py-8 pb-24">
      <BackLink />
      <h1 className="mb-4 text-2xl font-bold text-white">Terms of Use</h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-white/70">
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/50">
          Placeholder for closed beta. Full terms will be published before public launch.
        </p>
        <p>
          DiscCoach is provided as-is during the closed beta. Features, data structures, and behavior may
          change without notice as the product is refined based on beta feedback.
        </p>
        <p>You&apos;re responsible for the accuracy of the information you enter into the app.</p>
      </div>
    </div>
  )
}
