const express = require('express');
const http = require('http');
const morgan = require('morgan');
const body = require('body-parser');

const dishRouter = require('./router/dishRouter');
const leaderRouter = require('./router/leaderRouter');
const promoRouter = require('./router/promoRouter');

const hostname = 'localhost';
const port = 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(body.json());
app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter)


// DishId
// app.get('/dishes/:dishId',(req,res) =>{
//     res.end('Will send the details to you, this is just a preview of dish ' + req.params.dishId);
// });

// app.post('/dishes/:dishId',(req,res) =>{
//     res.statusCode = 403;
//     res.end(`The ${req.method} was executed.  This operation is not supported. Dish id is ${req.params.dishId}`);
// });

// app.put('/dishes/:dishId', (req,res) =>{
//     res.write(`The ${req.method} was executed. Will update the dish with  ${req.body.name} `);
//     res.end(`Will update ethe dish: ${req.params.dishId}`)
// });


// app.delete('/dishes/:dishId', (req,res) =>{
    
//     res.end(`The ${req.method} was executed on ${req.params.dishId}. `);
// });



// req --> request, res --> response
//next for additional middleware, its optional 
app.use((req, res) =>{

    res.statusCode = 200;
    res.setHeader('Content-type','text/html');
    res.end("<html><body><h1>Express Server is running</h1></body></html>");
});


const server = http.createServer(app);

server.listen(port,hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}`);
});