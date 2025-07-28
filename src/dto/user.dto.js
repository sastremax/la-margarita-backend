export function asPublicUser(user) {
    return {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        cartId: user.cart?._id || null
    }
}