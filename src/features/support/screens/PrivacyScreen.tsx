import { BackLink } from '../components/BackLink'

export function PrivacyScreen() {
  return (
    <div className="px-6 py-8 pb-24">
      <BackLink />
      <h1 className="mb-4 text-2xl font-bold text-white">Privacy Policy</h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-white/70">
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/50">
          Placeholder for closed beta. A full privacy policy will be published before public launch.
        </p>
        <p>
          DiscCoach stores the data you enter — your discs, bags, practice sessions, and profile — to power
          the app&apos;s features. It is not sold or shared with third parties.
        </p>
        <p>
          You can request deletion of your account and associated data at any time via the{' '}
          <span className="text-white">Support</span> page.
        </p>
      </div>
    </div>
  )
}
