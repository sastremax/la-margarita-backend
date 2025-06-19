export function asPublicProduct(product) {
    return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        category: product.category,
        stock: product.stock,
        thumbnails: product.thumbnails || []
    }
}
