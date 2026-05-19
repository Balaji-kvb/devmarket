import { expect, test, describe, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../page'

// Mock next/link to avoid router context issues
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
  }
})

describe('HomePage', () => {
  test('renders Discover heading', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', { name: /Discover/i })
    expect(heading).toBeInTheDocument()
  })

  test('renders Popular Tools section', () => {
    render(<HomePage />)
    const sectionHeading = screen.getByRole('heading', { name: /Popular Tools/i })
    expect(sectionHeading).toBeInTheDocument()
  })
})
