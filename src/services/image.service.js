import fs from 'fs/promises'
import path from 'path'

const uploadImage = async (file) => {
    if (!file) throw new Error('No file uploaded')
    return {
        filename: file.filename,
        path: file.path
    }
}

const deleteImage = async (filePath) => {
    try {
        await fs.unlink(path.resolve(filePath))
        return true
    } catch (err) {
        throw new Error(`Failed to delete image: ${err.message}`)
    }
}

export default {
    uploadImage,
    deleteImage
}
