const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;


// http takes a function as a params
// tht function takes two things as params
const server = http.createServer((req,res) =>{
    console.log("URL for request is " + req.url + " by method " + req.method);
    if(req.method == 'GET'){
        var fileUrl;
        if(req.url == '/'){
            fileUrl = '/index.html'
        }
        else{
            fileUrl = req.url;
        }

        var filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath)
        if(fileExt == '.html'){
            fs.exists(filePath, (exists) => {
                if(!exists){
                    res.statusCode = 404;
                    res.setHeader('Content-type', "text/html");
                    res.end('<html><body> ' + fileUrl +  ' not found Error 404 </body></html>')
                    // return;
                }
                else{
                    res.statusCode = 200;
                    res.setHeader('Content-type', "text/html");
                    fs.createReadStream(filePath).pipe(res);
                }
            })
        }
        else{
            res.statusCode = 404;
            res.setHeader('Content-type', "text/html");
            res.end('<html><body>' + fileUrl +  ' is not a HTML file, Error 404 </body></html>')
        }
    }

    else{
        res.statusCode = 404;
        res.setHeader('Content-type', "text/html");
        res.end('<html><body> Error 404, req method '+ req.method +' </body></html>')
        return;
    }



    // res.statusCode = 200;
    // res.setHeader('Content-type', 'text/html');

    // res.end(
    //     '<html><body> <h1> Hi </h1> </body></html>'
    // )
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});