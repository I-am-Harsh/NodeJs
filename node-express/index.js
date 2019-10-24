const express = require('express');
const http = require('http');
const morgan = require('morgan');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'))

// req --> request, res --> response
//next for additional middleware, its optional 
app.use((req, res, next) =>{

    res.statusCode = 200;
    res.setHeader('Content-type','text/html');
    res.end("<html><body><h1>Express Server is running</h1></body></html>")
});


const server = http.createServer(app);

server.listen(port,hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}`);
});