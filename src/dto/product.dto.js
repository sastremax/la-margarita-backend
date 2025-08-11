import { z } from 'zod'

export const productSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().positive(),
    code: z.string().regex(/^[a-zA-Z0-9-_]+$/).min(1),
    category: z.enum(['food', 'service']),
    stock: z.coerce.number().int().nonnegative(),
    images: z.array(z.string().url()).optional()
})

export function asPublicProduct(product) {
    if (!product) return null
    const id = product._id?.toString?.() || product.id || null
    const images = Array.isArray(product.images) ? product.images : []
    return {
        id,
        title: product.title || null,
        description: product.description || null,
        price: typeof product.price === 'number' ? product.price : null,
        code: product.code || null,
        category: product.category || null,
        stock: typeof product.stock === 'number' ? product.stock : null,
        images
    }
}
