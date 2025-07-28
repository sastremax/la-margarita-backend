import z from 'zod'

export const cartItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive()
})

export const cartSchema = z.object({
    items: z.array(cartItemSchema).min(1)
})

export function asPublicCart(cart) {
    return {
        id: cart._id,
        userId: cart.user?._id || null,
        products: Array.isArray(cart.products)
            ? cart.products.map(p => ({
                productId: p.product?._id || null,
                title: p.product?.title || '',
                price: p.product?.price || 0,
                quantity: p.quantity
            }))
            : []
    }
}