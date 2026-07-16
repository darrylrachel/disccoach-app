import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { useUpdateProfile } from '../hooks/useProfile'
import type {
  PrimaryGoal,
  SkillLevel,
  ThrowStyle,
  ThrowingHand,
} from '../../../domain/profile/models'

export function OnboardingScreen() {
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('')
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | ''>('')
  const [throwingHand, setThrowingHand] = useState<ThrowingHand | ''>('')
  const [primaryThrowStyle, setPrimaryThrowStyle] = useState<ThrowStyle | ''>('')
  const [maxDistance, setMaxDistance] = useState('')
  const [puttingStyle, setPuttingStyle] = useState('')

  const navigate = useNavigate()
  const updateProfile = useUpdateProfile()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updateProfile.mutate(
      {
        skillLevel: skillLevel || null,
        primaryGoal: primaryGoal || null,
        throwingHand: throwingHand || null,
        primaryThrowStyle: primaryThrowStyle || null,
        maxDistance: maxDistance ? Number(maxDistance) : null,
        puttingStyle: puttingStyle || null,
      },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-white">Tell us about your game</h1>
        <p className="mb-8 text-sm text-white/50">
          This helps DiscCoach tailor practice sessions to you.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Select
            id="skillLevel"
            label="Skill level"
            required
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
          >
            <option value="" disabled>
              Select skill level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="competitive">Competitive</option>
          </Select>

          <Select
            id="primaryGoal"
            label="Primary goal"
            required
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value as PrimaryGoal)}
          >
            <option value="" disabled>
              Select a goal
            </option>
            <option value="increase_distance">Increase distance</option>
            <option value="improve_putting">Improve putting</option>
            <option value="lower_scores">Lower scores</option>
            <option value="learn_forehand">Learn forehand</option>
            <option value="improve_consistency">Improve consistency</option>
          </Select>

          <Select
            id="throwingHand"
            label="Throwing hand"
            required
            value={throwingHand}
            onChange={(e) => setThrowingHand(e.target.value as ThrowingHand)}
          >
            <option value="" disabled>
              Select throwing hand
            </option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </Select>

          <Select
            id="primaryThrowStyle"
            label="Primary throw style"
            required
            value={primaryThrowStyle}
            onChange={(e) => setPrimaryThrowStyle(e.target.value as ThrowStyle)}
          >
            <option value="" disabled>
              Select throw style
            </option>
            <option value="backhand">Backhand</option>
            <option value="forehand">Forehand</option>
          </Select>

          <Input
            id="maxDistance"
            label="Approximate max distance (feet)"
            type="number"
            min={0}
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
          />

          <Input
            id="puttingStyle"
            label="Putting style (optional)"
            type="text"
            placeholder="e.g. spin, push, hybrid"
            value={puttingStyle}
            onChange={(e) => setPuttingStyle(e.target.value)}
          />

          {updateProfile.isError && (
            <p className="text-sm text-red-400">
              {updateProfile.error instanceof Error
                ? updateProfile.error.message
                : 'Unable to save your profile.'}
            </p>
          )}

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving…' : 'Start training'}
          </Button>
        </form>
      </div>
    </div>
  )
}
