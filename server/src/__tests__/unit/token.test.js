import { describe, it, expect, beforeAll } from '@jest/globals'
import { generateToken, verifyToken } from '../../utils/auth.js'

beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_key'
    process.env.JWT_EXPIRES_IN = '1d'
})

describe('generateToken()', () => {
    it('should return a JWT string', () => {
        const token = generateToken('user123')
        expect(typeof token).toBe('string')
        expect(token.split('.')).toHaveLength(3)
    })

    it('should encode the userId in the payload', () => {
        const token = generateToken('user123')
        const decoded = verifyToken(token)
        expect(decoded.id).toBe('user123')
    })
})

describe('verifyToken()', () => {
    it('should successfully verify a valid token', () => {
        const token = generateToken('user456')
        const decoded = verifyToken(token)
        expect(decoded.id).toBe('user456')
    })

    it('should throw on an invalid token', () => {
        expect(() => verifyToken('invalid.token.here')).toThrow()
    })
})
