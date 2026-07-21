import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import { Textarea } from '../../../components/ui/Textarea'
import { useSignOut } from '../../auth/hooks/useAuthMutations'
import { useSession } from '../../auth/hooks/useSession'
import { useProfile, useUpdateProfile } from '../../profile/hooks/useProfile'
import { PRIMARY_GOAL_LABELS, PRIMARY_GOAL_ORDER } from '../../profile/profileLabels'
import { EquipmentPicker } from '../../resistanceTraining/components/EquipmentPicker'
import { useEquipment, useSetUserEquipment, useUserEquipment } from '../../resistanceTraining/hooks/useEquipment'
import type { PrimaryGoal, SkillLevel, ThrowStyle, ThrowingHand } from '../../../domain/profile/models'

export function AccountScreen() {
  const { user } = useSession()
  const { data: profile, isLoading } = useProfile()

  return (
    <div className="px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/"
          className="flex min-h-11 min-w-11 items-center justify-center text-white/60 hover:text-white"
          aria-label="Back"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold text-white">Account</h1>
      </div>

      <Card className="mb-8">
        <SectionLabel className="mb-1">Signed in as</SectionLabel>
        <p className="mb-4 text-white">{user?.email}</p>
        <SignOutButton />
      </Card>

      {isLoading ? (
        <p className="text-white/50">Loading profile…</p>
      ) : (
        <ProfileForm key={profile?.id ?? 'new'} profile={profile ?? null} />
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <EquipmentSection />
      </div>
    </div>
  )
}

function EquipmentSection() {
  const { data: equipment, isLoading: equipmentLoading } = useEquipment()
  const { data: userEquipmentIds, isLoading: userEquipmentLoading } = useUserEquipment()
  const setUserEquipment = useSetUserEquipment()
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null)

  const isLoading = equipmentLoading || userEquipmentLoading
  const current = selectedIds ?? userEquipmentIds ?? new Set<string>()

  if (isLoading || !equipment) {
    return <p className="text-white/50">Loading equipment…</p>
  }

  return (
    <div>
      <SectionLabel className="mb-3">Equipment</SectionLabel>
      <p className="mb-4 text-sm text-white/50">
        Used to tailor resistance training workouts to what you actually have available.
      </p>
      <EquipmentPicker equipment={equipment} selectedIds={current} onChange={setSelectedIds} />
      {setUserEquipment.isError && <p className="mt-3 text-sm text-red-400">Unable to save your equipment.</p>}
      <div className="mt-4">
        <Button
          type="button"
          onClick={() => setUserEquipment.mutate(Array.from(current))}
          disabled={selectedIds === null || setUserEquipment.isPending}
        >
          {setUserEquipment.isPending ? 'Saving…' : 'Save equipment'}
        </Button>
      </div>
    </div>
  )
}

function SignOutButton() {
  const signOut = useSignOut()

  return (
    <Button type="button" variant="secondary" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
      {signOut.isPending ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}

interface ProfileFormProps {
  profile: {
    displayName: string | null
    skillLevel: SkillLevel | null
    primaryGoal: PrimaryGoal | null
    throwingHand: ThrowingHand | null
    primaryThrowStyle: ThrowStyle | null
    maxDistance: number | null
    forehandDistance: number | null
    puttingStyle: string | null
    avatarUrl: string | null
    homeCourse: string | null
    yearsPlaying: number | null
    favoriteManufacturer: string | null
    favoriteMold: string | null
    bio: string | null
  } | null
}

function ProfileForm({ profile }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>(profile?.skillLevel ?? '')
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | ''>(profile?.primaryGoal ?? '')
  const [throwingHand, setThrowingHand] = useState<ThrowingHand | ''>(profile?.throwingHand ?? '')
  const [primaryThrowStyle, setPrimaryThrowStyle] = useState<ThrowStyle | ''>(profile?.primaryThrowStyle ?? '')
  const [maxDistance, setMaxDistance] = useState(profile?.maxDistance?.toString() ?? '')
  const [forehandDistance, setForehandDistance] = useState(profile?.forehandDistance?.toString() ?? '')
  const [puttingStyle, setPuttingStyle] = useState(profile?.puttingStyle ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '')
  const [homeCourse, setHomeCourse] = useState(profile?.homeCourse ?? '')
  const [yearsPlaying, setYearsPlaying] = useState(profile?.yearsPlaying?.toString() ?? '')
  const [favoriteManufacturer, setFavoriteManufacturer] = useState(profile?.favoriteManufacturer ?? '')
  const [favoriteMold, setFavoriteMold] = useState(profile?.favoriteMold ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')

  const updateProfile = useUpdateProfile()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updateProfile.mutate({
      displayName: displayName || null,
      skillLevel: skillLevel || null,
      primaryGoal: primaryGoal || null,
      throwingHand: throwingHand || null,
      primaryThrowStyle: primaryThrowStyle || null,
      maxDistance: maxDistance ? Number(maxDistance) : null,
      forehandDistance: forehandDistance ? Number(forehandDistance) : null,
      puttingStyle: puttingStyle || null,
      avatarUrl: avatarUrl || null,
      homeCourse: homeCourse || null,
      yearsPlaying: yearsPlaying ? Number(yearsPlaying) : null,
      favoriteManufacturer: favoriteManufacturer || null,
      favoriteMold: favoriteMold || null,
      bio: bio || null,
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <SectionLabel>Profile</SectionLabel>

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt=""
          className="h-16 w-16 rounded-full border border-white/15 object-cover"
        />
      )}
      <Input
        id="avatarUrl"
        label="Avatar image URL"
        type="url"
        placeholder="https://…"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />

      <Input
        id="displayName"
        label="Display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <Select
        id="skillLevel"
        label="Skill level"
        value={skillLevel}
        onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
      >
        <option value="">Not set</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        <option value="competitive">Competitive</option>
      </Select>

      <Select
        id="primaryGoal"
        label="Primary goal"
        value={primaryGoal}
        onChange={(e) => setPrimaryGoal(e.target.value as PrimaryGoal)}
      >
        <option value="">Not set</option>
        {PRIMARY_GOAL_ORDER.map((goal) => (
          <option key={goal} value={goal}>
            {PRIMARY_GOAL_LABELS[goal]}
          </option>
        ))}
      </Select>

      <Select
        id="throwingHand"
        label="Throwing hand"
        value={throwingHand}
        onChange={(e) => setThrowingHand(e.target.value as ThrowingHand)}
      >
        <option value="">Not set</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </Select>

      <Select
        id="primaryThrowStyle"
        label="Primary throw style"
        value={primaryThrowStyle}
        onChange={(e) => setPrimaryThrowStyle(e.target.value as ThrowStyle)}
      >
        <option value="">Not set</option>
        <option value="backhand">Backhand</option>
        <option value="forehand">Forehand</option>
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="maxDistance"
          label="Max distance (ft)"
          type="number"
          min={0}
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
        />
        <Input
          id="forehandDistance"
          label="Forehand distance (ft)"
          type="number"
          min={0}
          value={forehandDistance}
          onChange={(e) => setForehandDistance(e.target.value)}
        />
      </div>

      <Input
        id="puttingStyle"
        label="Putting style"
        placeholder="e.g. spin, push, hybrid"
        value={puttingStyle}
        onChange={(e) => setPuttingStyle(e.target.value)}
      />

      <Input
        id="homeCourse"
        label="Home course"
        value={homeCourse}
        onChange={(e) => setHomeCourse(e.target.value)}
      />

      <Input
        id="yearsPlaying"
        label="Years playing"
        type="number"
        min={0}
        value={yearsPlaying}
        onChange={(e) => setYearsPlaying(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="favoriteManufacturer"
          label="Favorite manufacturer"
          value={favoriteManufacturer}
          onChange={(e) => setFavoriteManufacturer(e.target.value)}
        />
        <Input
          id="favoriteMold"
          label="Favorite mold"
          value={favoriteMold}
          onChange={(e) => setFavoriteMold(e.target.value)}
        />
      </div>

      <Textarea
        id="bio"
        label="Short bio"
        maxLength={500}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {updateProfile.isError && <p className="text-sm text-red-400">Unable to save your profile.</p>}

      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
