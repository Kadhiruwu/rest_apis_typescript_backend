import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {

    it('should display validation errors', async()=> {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })
    
    it('should validate that the the price is greater than 0', async()=> {
        const response = await request(server).post('/api/products').send({
            name: 'audifonos cable',
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the the price is an number and greater than 0', async()=> {
        const response = await request(server).post('/api/products').send({
            name: 'audifonos cable',
            price: "hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })
    

    it('should create a new product', async() => {
        const response = await request(server).post('/api/products').send({
            name : "Mouse Testing",
            price : 50
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')
    },10000)
})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async() =>{
        const respose = await request(server).get('/api/products')
        expect(respose.status).not.toBe(404)
    })

    it('GET a JSON response with products', async() =>{
        const respose = await request(server).get('/api/products')
        expect(respose.status).toBe(200)
        expect(respose.headers['content-type']).toMatch(/json/)
        expect(respose.body).toHaveProperty('data')
        expect(respose.body.data).toHaveLength(1)

        expect(respose.body).not.toHaveProperty('errors')
    }) 
})

describe('GET /api/products/:id', () =>{
    it('Should return a 404 response for a non-existent product', async() => {
        const productID = 2000
        const response = await request(server).get(`/api/products/${productID}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
    })  

    it('should check a valid ID in the URL', async() => {
        const response = await request(server).get(`/api/products/not-valid-url`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    it('get a JSON response for a single product ', async() => {
        const response = await request(server).get(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/prducts/:id', () => {

    it('should check a valid ID in the URL', async() => {
        const response = await request(server).put(`/api/products/not-valid-url`).send({
                name : "Monitor Curvo",
                availability: true,
                price: 300
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
                name : "Monitor Curvo",
                availability: true,
                price: 0
            
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 for a non-existent product', async () => {
        const productID = 2000
        const response = await request(server).put(`/api/products/${productID}`).send({
                name : "Monitor Curvo",
                availability: true,
                price: 330
            
        })
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        
        const response = await request(server).put(`/api/products/1`).send({
                name : "Monitor Curvo",
                availability: true,
                price: 330
            
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/prducts/:id', () => {
    it('should return a 404 response for a non-existing product', async() => {
        const productID = 2000
        const response = await request(server).patch(`/api/products/${productID}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.body).not.toHaveProperty('data')
        expect(response.status).not.toBe(200)
    })

    it('should update the product availability', async() => {
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.body).not.toHaveProperty('error')
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })

})

describe('DELETE /api/prducts/:id', () => {
    it('should check a valid ID', async() => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    it('should return a 404 response for a non-existent product', async()=> {
        const productID = 2000
        const response = await request(server).delete(`/api/products/${productID}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async()=> {
        const response = await request(server).delete(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})