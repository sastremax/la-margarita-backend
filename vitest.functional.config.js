import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        threads: false,
        testTimeout: 20000,
        hookTimeout: 20000,
        teardownTimeout: 20000
    }
})
