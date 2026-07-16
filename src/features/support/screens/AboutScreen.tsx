import { BackLink } from '../components/BackLink'

export function AboutScreen() {
  return (
    <div className="px-6 py-8 pb-24">
      <BackLink />
      <h1 className="mb-4 text-2xl font-bold text-white">About DiscCoach</h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-white/70">
        <p>
          DiscCoach is a personal training platform for disc golfers — it combines disc management, bag
          intelligence, structured practice, training programs, and progress tracking in one place.
        </p>
        <p>
          The goal isn&apos;t to help you own more discs. It&apos;s to help you understand the equipment you
          already have, practice with intention, and see real evidence that you&apos;re improving.
        </p>
        <p className="text-white/40">You&apos;re using a closed beta build. Thanks for helping test it.</p>
      </div>
    </div>
  )
}
