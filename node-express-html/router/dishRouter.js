
const express = require('express');
const body = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(body.json());

dishRouter.route('/')
// all will execute for all by defualt 
// first this will be executed and then res and req will be passed


.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    // looks for additional function that match the requests
    next();
})

// the modified res is passed here
.get((req,res) =>{
    res.end('Will send all the dishes to you, this is just a preview');
})

.post((req,res) =>{
    res.end(`
        The ${req.method} was executed.
        The body is ${req.body.name} and the descriptions is ${req.body.description}
    `);
})

.put((req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})

.delete((req,res) =>{
    
    res.end(`The ${req.method} was executed. Deleting the dishes data`);
});



// DishId
dishRouter.route('/:dishId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    // looks for additional function that match the requests
    next();
})

.get((req,res) =>{
    
    res.end('Will send the details to you, this is just a preview of dish ' + req.params.dishId);
})

.post((req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported. Dish id is ${req.params.dishId}`);
})

.put((req,res) =>{
    res.write(`The ${req.method} was executed. Will update the dish with  ${req.body.name} `);
    res.end(`Will update ethe dish: ${req.params.dishId}`)
})

.delete((req,res) =>{
    
    res.end(`The ${req.method} was executed on ${req.params.dishId}. `);
});




module.exports = dishRouter;
