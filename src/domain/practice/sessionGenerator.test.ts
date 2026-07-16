import { describe, expect, it } from 'vitest'
import { difficultyForSkillLevel, selectTemplate } from './sessionGenerator'
import type { PracticeTemplate } from './models'

function makeTemplate(overrides: Partial<PracticeTemplate> & { id: string }): PracticeTemplate {
  return {
    name: overrides.id,
    category: 'putting',
    difficulty: 'beginner',
    durationMinutes: 20,
    structure: [{ label: '10ft putts', reps: 20 }],
    ...overrides,
  }
}

describe('difficultyForSkillLevel', () => {
  it('maps beginner and null to beginner', () => {
    expect(difficultyForSkillLevel('beginner')).toBe('beginner')
    expect(difficultyForSkillLevel(null)).toBe('beginner')
  })

  it('maps intermediate directly', () => {
    expect(difficultyForSkillLevel('intermediate')).toBe('intermediate')
  })

  it('maps advanced and competitive to advanced', () => {
    expect(difficultyForSkillLevel('advanced')).toBe('advanced')
    expect(difficultyForSkillLevel('competitive')).toBe('advanced')
  })
})

describe('selectTemplate', () => {
  const templates: PracticeTemplate[] = [
    makeTemplate({ id: 'putting-beg-20', category: 'putting', difficulty: 'beginner', durationMinutes: 20 }),
    makeTemplate({ id: 'putting-beg-45', category: 'putting', difficulty: 'beginner', durationMinutes: 45 }),
    makeTemplate({
      id: 'putting-int-45',
      category: 'putting',
      difficulty: 'intermediate',
      durationMinutes: 45,
    }),
    makeTemplate({
      id: 'distance-adv-60',
      category: 'distance',
      difficulty: 'advanced',
      durationMinutes: 60,
    }),
  ]

  it('returns an exact category+difficulty+duration match', () => {
    const result = selectTemplate(templates, {
      durationMinutes: 45,
      category: 'putting',
      skillLevel: 'intermediate',
    })
    expect(result?.id).toBe('putting-int-45')
  })

  it('falls back to the closest duration at the same difficulty', () => {
    const result = selectTemplate(templates, {
      durationMinutes: 60,
      category: 'putting',
      skillLevel: 'beginner',
    })
    expect(result?.id).toBe('putting-beg-45')
  })

  it('falls back across difficulty when none exists for the skill level', () => {
    const result = selectTemplate(templates, {
      durationMinutes: 60,
      category: 'distance',
      skillLevel: 'beginner',
    })
    expect(result?.id).toBe('distance-adv-60')
  })

  it('returns null when no template exists for the category', () => {
    const result = selectTemplate(templates, {
      durationMinutes: 20,
      category: 'field_work',
      skillLevel: 'beginner',
    })
    expect(result).toBeNull()
  })
})
