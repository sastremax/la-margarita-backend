import { z } from 'zod'

export const cartItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().positive()
})

export const cartSchema = z.object({
    items: z.array(cartItemSchema).min(1)
})

export const asPublicCart = (doc) => {
    if (!doc) return null
    return {
        id: doc._id.toString(),
        userId: doc.user && typeof doc.user === 'object' && doc.user._id ? doc.user._id.toString() : (doc.user?.toString?.() ?? doc.user ?? null),
        products: (doc.products || []).map(p => {
            const prod = p.product
            const publicProduct = prod && prod._id
                ? { id: prod._id.toString(), title: prod.title, price: prod.price }
                : (typeof prod === 'object' && prod?.toString ? prod.toString() : prod)
            return {
                product: publicProduct,
                quantity: p.quantity
            }
        }),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    }
}
