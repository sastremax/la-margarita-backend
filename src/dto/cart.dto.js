import { z } from 'zod'

export const cartItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive()
})

export const cartSchema = z.object({
    items: z.array(cartItemSchema).min(1)
})

export const asPublicCart = (cart) => {
    if (!cart) return null
    const id = cart._id?.toString?.() || cart.id || null
    const userId =
        cart.user?._id?.toString?.() ||
        cart.user?.toString?.() ||
        cart.user?.id ||
        null
    const products = Array.isArray(cart.products)
        ? cart.products.map((p) => ({
            productId:
                p.product?._id?.toString?.() ||
                p.product?.toString?.() ||
                p.product?.id ||
                null,
            title: p.product?.title || '',
            price: Number.isFinite(p.product?.price) ? p.product.price : 0,
            quantity: p.quantity
        }))
        : []
    return { id, userId, products }
}
