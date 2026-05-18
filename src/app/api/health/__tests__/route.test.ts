import { expect, test, describe, vi } from 'vitest'
import { GET } from '../route'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{}]),
  },
}))

describe('Health Endpoint', () => {
  test('GET returns status ok', async () => {
    const response = await GET()
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.database).toBe('ok')
  })
})
