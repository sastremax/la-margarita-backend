export function uniqueCode(prefix = 'PRD') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
