export const asUserPublic = (user) => {
    if (!user) return null
    const id = user._id?.toString?.() || user.id || null
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
    const cartId =
        user.cart?._id?.toString?.() ||
        user.cart?.toString?.() ||
        user.cart?.id ||
        null
    return {
        id,
        fullName,
        email: user.email || null,
        role: user.role || null,
        cartId
    }
}
