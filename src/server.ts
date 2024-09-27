import  express  from "express";
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import swaggerUi from 'swagger-ui-express'
import { router } from "./router";
import { db } from "./config/db";

//Conectar a base de datos
export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.bgGreen.bold('se agregó bien tio'))
    } catch (error) {
        console.log(error)
        console.log(colors.bgRed.bold('Hubo un error al conectar a la base de datos'))
    }
}

connectDB();

//Instancia de express
const server = express();

// Permitir conexiones CORS
const corsOptions : CorsOptions = {
    origin: function(origin, callback){
        if(origin = process.env.FRONTEND_URL){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

//Leer datos de formularios
server.use(express.json())

//MORGAN
server.use(morgan('dev'))

server.use('/api/products', router)

//Documentacion
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server