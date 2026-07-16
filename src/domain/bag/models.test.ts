import { describe, expect, it } from 'vitest'
import { defaultSlotForDisc } from './models'

describe('defaultSlotForDisc', () => {
  it('defaults slow putters to putting putter', () => {
    expect(defaultSlotForDisc('putter', 2)).toBe('putting_putter')
  })

  it('defaults faster putters to throwing putter', () => {
    expect(defaultSlotForDisc('putter', 4)).toBe('throwing_putter')
  })

  it('maps midrange directly', () => {
    expect(defaultSlotForDisc('midrange', 5)).toBe('midrange')
  })

  it('splits fairway drivers into fairway vs control by speed', () => {
    expect(defaultSlotForDisc('fairway_driver', 6)).toBe('fairway_driver')
    expect(defaultSlotForDisc('fairway_driver', 8)).toBe('control_driver')
  })

  it('splits distance drivers into control vs distance by speed', () => {
    expect(defaultSlotForDisc('distance_driver', 11)).toBe('control_driver')
    expect(defaultSlotForDisc('distance_driver', 13)).toBe('distance_driver')
  })

  it('falls back sensibly when speed is unknown', () => {
    expect(defaultSlotForDisc('putter', null)).toBe('putting_putter')
    expect(defaultSlotForDisc('fairway_driver', null)).toBe('fairway_driver')
    expect(defaultSlotForDisc('distance_driver', null)).toBe('distance_driver')
  })
})
