const body = require('body-parser');
const express = require('express');
const promoRouter = express.Router();

promoRouter.use(body.json());

promoRouter.route('/')

.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    next();
})

.get((req,res) =>{
    res.end(`This is a ${req.method} request`)
})

.put((req,res) =>{
    res.end(`This is a ${req.method} request`);
})

.delete((req,res) =>{
    res.end(`This is a ${req.method} request`);
})

.post((req,res) =>{
    res.end(`This is a ${req.method} request`);
});



module.exports = promoRouter;