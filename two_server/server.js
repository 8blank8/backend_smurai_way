const http = require('http');
const fs = require('fs');

let count = 0;

const readFile = (path)=>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path, (err, data)=>{
            if(err) reject(err)
            else resolve(data)
        });
    })
}

const server = http.createServer( async( request,response)=>{
    count++;
    switch(request.url){
        case '/favicon.ico': {
            const data = await readFile('img/favicon.ico');
            response.write(data);
            response.end();
            break;
        }
        case '/':
        case '/home': {
            try{
                const data = await readFile('pages/home1.html');
                response.write(data);
                response.end();
            } catch{
                response.write('404 not found');
                response.end();
            }
            break;
        }
        case '/time':{
            try{
                const data = await readFile('pages/time.html');
                response.write(data);
                response.end();
            } catch{
                response.write('404 not found');
                response.end();
            }
            break;
        }
        default:{
            response.write('404 not found');
            response.end();
        }
            
    }


});

server.listen(3000);