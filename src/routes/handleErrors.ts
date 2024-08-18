import { ErrorRequestHandler, RequestHandler } from "express";

//To handle route error
export const notFoundRequest : RequestHandler = (req,res) => {
    res.status(404).json({error: 'Route not found'})
}
//To handle some error in the code
export const  internalErrorRequest : ErrorRequestHandler = (err, req, res, next) =>{
    console.log(err)
    res.status(500).json({error:"Erro interno do servidor"})
}