import { expect, test, describe } from 'vitest'
import { validateJSON, minifyJSON } from '../json-utils'

describe('JSON Utils', () => {
  test('validateJSON returns valid for correct JSON', () => {
    const result = validateJSON('{"key": "value"}')
    expect(result.valid).toBe(true)
  })

  test('validateJSON returns invalid for malformed JSON', () => {
    const result = validateJSON('{"key": "value"')
    expect(result.valid).toBe(false)
  })

  test('minifyJSON removes whitespace', () => {
    const result = minifyJSON('{\n  "key": "value"\n}')
    expect(result).toBe('{"key":"value"}')
  })
})
