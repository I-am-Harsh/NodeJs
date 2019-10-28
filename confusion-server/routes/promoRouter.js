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


promoRouter.route('/:promoId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    // looks for additional function that match the requests
    next();
})

.get((req,res) =>{
    
    res.end('The selected promo id is :' + req.params.promoId);
})

.post((req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported. The selected promo id is : ${req.params.promoId}`);
})

.put((req,res) =>{
    res.write(`The ${req.method} was executed. The selected promo id is :  ${req.body.name} `);
    res.end(`The selected promo id is : ${req.params.promoId}`)
})

.delete((req,res) =>{
    
    res.end(`The ${req.method} was executed on ${req.params.promoId}. `);
});



module.exports = promoRouter;