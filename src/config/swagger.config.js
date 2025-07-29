import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API La Margarita',
            version: '1.0.0',
            description: 'Documentación de la API para el sistema de reservas de campo La Margarita'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./src/docs/**/*.yaml']
}

export const specs = swaggerJsdoc(options)
export const swaggerUiInstance = swaggerUi

