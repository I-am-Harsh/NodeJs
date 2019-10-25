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



module.exports = leaderRouter;