const http = require('http');
const fs = require('fs');
const path = require('path');

let counter = 0;
let favicon = path.join(__dirname, './favicon.ico');

const server = http.createServer((request, response)=>{
    counter++;

    switch(request.url){
        case '/favicon.ico':
            response.writeHead(200, {'Content-type': 'image/x-icon'});
            fs.createReadStream(favicon).pipe(response);
            break;
        case '/stud':
            response.write('students ' + counter);
            break;
        case '/':
        case '/hi':
            response.write('hello ' + counter);
            break;
        default:
            response.write('404 not found ' + counter);
    }

    response.end();
});

server.listen(3003);