import {Request, Response} from 'express'
import Product from '../models/Product.model'

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ],
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    res.json({data: products})
}

export const getProductById = async (req: Request, res: Response) => {
    const {id} = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    res.json({data : product})
}

//POST
export const createProduct = async (req : Request, res: Response) => {
    const product = await Product.create(req.body)
        res.status(201).json({data: product})
}

//PUT
export const updateProduct = async (req: Request, res: Response) => {
    //Verificar que exista
    const {id} = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    //Actualiazr Producto
    //console.log(req.body)
    await product.update(req.body)
    await product.save()
    res.json({data: product})
}

//PATCH
export const updateAvailability = async (req: Request, res: Response) => {
    //Verificar que exista
    const {id} = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    //Actualiazr Producto
    //console.log(req.body)
    product.availability = !product.dataValues.availability
    await product.save()
    res.json({data: product})
}

//DELETE
export const deleteProduct = async (req: Request, res: Response) => {
    //Verificar que exista
    const {id} = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    //Eliminar Producto
    await product.destroy()
    res.json({data: 'Producto Eliminado'})
}