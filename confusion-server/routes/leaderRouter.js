const express = require('express');
const body = require('body-parser');
const leaderRouter = express.Router();

leaderRouter.use(body.json());

leaderRouter.route('/')

.all((req,res,next) =>{
    // console.log(req.header)
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


leaderRouter.route('/:leaderId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','text/plain');
    // looks for additional function that match the requests
    next();
})

.get((req,res) =>{
    
    res.end('The selected leader id is :' + req.params.leaderId);
})

.post((req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported. The selected leader id is : ${req.params.leaderId}`);
})

.put((req,res) =>{
    res.write(`The ${req.method} was executed. The selected leader id is :  ${req.body.name} `);
    res.end(`The selected leader id is : ${req.params.leaderId}`)
})

.delete((req,res) =>{
    
    res.end(`The ${req.method} was executed on ${req.params.leaderId}. `);
});




module.exports = leaderRouter;