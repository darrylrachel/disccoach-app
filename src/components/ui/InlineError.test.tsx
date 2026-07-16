import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InlineError } from './InlineError'

describe('InlineError', () => {
  it('renders the message', () => {
    render(<InlineError message="Unable to log that result." />)
    expect(screen.getByText('Unable to log that result.')).toBeInTheDocument()
  })

  it('omits the retry button when no onRetry is given', () => {
    render(<InlineError message="Unable to log that result." />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn()
    render(<InlineError message="Unable to log that result." onRetry={onRetry} />)

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('disables the retry button and shows a retrying label while retrying', () => {
    render(<InlineError message="Unable to log that result." onRetry={vi.fn()} retrying />)
    expect(screen.getByRole('button', { name: 'Retrying…' })).toBeDisabled()
  })
})
