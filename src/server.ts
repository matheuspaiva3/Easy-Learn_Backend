import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { routes } from './routes/indes'

dotenv.config()

const server = express()
server.use(helmet())
server.use(express.json())
server.use(routes)

server.listen(process.env.PORT,()=> {
    console.log(`Server is running on ${process.env.PORT}`)
})
