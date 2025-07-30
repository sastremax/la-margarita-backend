import { z } from 'zod'

export const productSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    code: z.string().min(1),
    category: z.string().min(1),
    stock: z.number().int().nonnegative(),
    images: z.array(z.string().url()).optional()
})

export function asPublicProduct(product) {
    return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        category: product.category,
        stock: product.stock,
        images: product.images || []
    }
}
