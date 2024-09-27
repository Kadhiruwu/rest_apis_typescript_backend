import {Router} from 'express'
import { body, param } from 'express-validator';
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product';
import { handleInputErrors } from './middleware';


export const router = Router();
/** 
*@swagger
*components: 
*   schemas:
*       Product:
*           type: object
*           properties: 
*               id:
*                   type: integer
*                   Description: The Product ID
*                   Example: 1
*               name: 
*                   type: string
*                   Description: The Product name
*                   Example: Monitor 32 Pulgadas
*               price:
*                   type: number
*                   Description: The Product Price
*                   Example: 300
*               availability:
*                   type: booleand
*                   Description: The Product availability
*                   Example: true
*/ 


/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags: 
 *              - Products 
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successfull response
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/Product'
 * 
 * 
 * 
 * 
 */



//Routing 
router.get('/', getProducts)
/** 
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a producto by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The Id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses: 
 *          200:
 *              description: Successfull Response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *             description: Not found
 *          400:
 *              description: Bad request - Invalid ID
 * 
*/
router.get('/:id', 
    param('id').isInt().withMessage('ID no valido').custom(id => id > 0).withMessage('ID no valido'),
    handleInputErrors,
    getProductById
)


/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Create a New Product
 *      tags:
 *          - Products
 *      description: Return a new record in the database
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      tyoe: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor 32 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 300
 *      responses:
 *          201:
 *              description: Succesfull Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid input data
 * 
 */
router.post('/',
    
    //Validacion
    body ('name').notEmpty()
        .withMessage('El nombre del producto no puede ir vacio'),
   
    body ('price')
        .isNumeric().withMessage('valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no valido'),
        handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      descriptio: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The Id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      tyoe: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor 32 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 300
 *                          availability:
 *                              type: boolean  
 *                              example: true
 *      responses:
 *          200:
 *              description: Succesfull Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input Data
 *          404:
 *              description: Product Not Found
 * 
 */

router.put('/:id', 
    //Validacion
    param('id').isInt().withMessage('ID no valido').custom(id => id > 0).withMessage('ID no valido'),
     body ('name').notEmpty()
    .withMessage('El nombre del producto no puede ir vacio'),
   
    body ('price')
    .isNumeric().withMessage('valor no valido')
    .notEmpty().withMessage('El precio del producto no puede ir vacio')
    .custom(value => value > 0).withMessage('Precio no valido'),
    body('availability').isBoolean().withMessage('Valor incorrecto'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 *  /api/products/{id}:
 *  patch:
 *      summary: Update Product Availability
 *      tags:
 *          - Products
 *      description: Return the updated availability 
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The Id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesfull Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found  
 * 
 */

router.patch('/:id', 
    param('id').isInt().withMessage('ID no valido').custom(id => id > 0).withMessage('ID no valido'),
    handleInputErrors,
    updateAvailability)


/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a Product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The Id of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesfull Response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Delete Product succesfull'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found  
 * 
 * 
 * 
 * 
 */

router.delete('/:id', 
    param('id').isInt().withMessage('ID no valido').custom(id => id > 0).withMessage('ID no valido'),
    handleInputErrors,
    deleteProduct
)

