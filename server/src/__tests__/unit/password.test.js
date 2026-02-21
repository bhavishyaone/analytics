import { describe, it, expect } from '@jest/globals'
import { hashPassword, comparePassword } from '../../utils/auth.js'

describe('hashPassword()', () => {
    it('should return a hashed string different from the original', async () => {
        const hash = await hashPassword('mySecret123')
        expect(hash).not.toBe('mySecret123')
        expect(typeof hash).toBe('string')
        expect(hash.length).toBeGreaterThan(20)
    })

    it('should produce a different hash each time (salted)', async () => {
        const hash1 = await hashPassword('mySecret123')
        const hash2 = await hashPassword('mySecret123')
        expect(hash1).not.toBe(hash2)
    })
})

describe('comparePassword()', () => {
    it('should return true for correct password', async () => {
        const hash = await hashPassword('mySecret123')
        const result = await comparePassword('mySecret123', hash)
        expect(result).toBe(true)
    })

    it('should return false for wrong password', async () => {
        const hash = await hashPassword('mySecret123')
        const result = await comparePassword('wrongPassword', hash)
        expect(result).toBe(false)
    })
})
