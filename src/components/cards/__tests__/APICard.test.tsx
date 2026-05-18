import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { APICard } from '../APICard'

describe('APICard Component', () => {
  const mockApi = {
    id: '1',
    name: 'Stripe API',
    tagline: 'Payment processing platform.',
    category: 'Finance',
    authMethod: 'api-key',
    pricing: 'paid',
    provider: 'Stripe',
    slug: 'stripe'
  }

  test('renders API name and tagline', () => {
    // Note: APICard uses Link, which we mocked globally in vitest.setup.ts
    render(<APICard api={mockApi as any} />)
    
    expect(screen.getByText('Stripe API')).toBeInTheDocument()
    expect(screen.getByText('Payment processing platform.')).toBeInTheDocument()
    expect(screen.getByText('Finance')).toBeInTheDocument()
  })
})
