import { describe, it, expect } from 'vitest'
import { loginAdmin } from '../setup/auth.helper.js'

describe('Auth', () => {
    it('debería loguear admin y devolver cookie', async () => {
        const { cookie } = await loginAdmin()
        expect(cookie).toBeTruthy()
    })
})

