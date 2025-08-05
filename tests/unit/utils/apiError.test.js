import { describe, expect, test } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'

describe('ApiError', () => {
    test('should set message and statusCode correctly', () => {
        const error = new ApiError(404, 'Not found')

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe('Not found')
        expect(error.statusCode).toBe(404)
        expect(error.stack).toBeDefined()
    })
})
