import { afterEach, describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { OfflineBanner } from './OfflineBanner'

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { value, configurable: true })
}

describe('OfflineBanner', () => {
  afterEach(() => {
    setOnline(true)
  })

  it('renders nothing while online', () => {
    setOnline(true)
    render(<OfflineBanner />)
    expect(screen.queryByText(/offline/i)).not.toBeInTheDocument()
  })

  it('renders a message when the offline event fires', () => {
    setOnline(true)
    render(<OfflineBanner />)

    setOnline(false)
    act(() => window.dispatchEvent(new Event('offline')))

    expect(screen.getByText(/you're offline/i)).toBeInTheDocument()
  })

  it('hides again once the online event fires', () => {
    setOnline(false)
    render(<OfflineBanner />)
    expect(screen.getByText(/you're offline/i)).toBeInTheDocument()

    setOnline(true)
    act(() => window.dispatchEvent(new Event('online')))

    expect(screen.queryByText(/offline/i)).not.toBeInTheDocument()
  })
})
