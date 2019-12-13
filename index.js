const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

//console.log(__dirname);
//console.log(json);
//console.log(laptopData);

// Create Server
// Callback function is run each time someone accesses server
const server = http.createServer((req, res) => {

    console.log(req.url);
    // const query = url.parse(req.url, true);
    const pathName = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;
    const id = url.parse(req.url, true).query.id;
    console.log(query);
    console.log('id = ' + id);
    console.log(url.parse(req.url, true));

    if (pathName === '/products' || pathName ==='/'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        console.log('Someone did access the server');
        res.end('This is the products page!');
    }
    else if (pathName === '/laptop' && id < laptopData.length){
        res.writeHead(200, { 'Content-type': 'text/html'});
        //res.end(`This is the laptops page for laptop ${id}!`);
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            // Use regular Exression to replace text
            let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
            output = output.replace(/{%PRICE%}/g, laptop.price);
            output = output.replace(/{%IMAGE%}/g, laptop.image);
            output = output.replace(/{%CPU%}/g, laptop.cpu);
            output = output.replace(/{%RAM%}/g, laptop.ram);
            output = output.replace(/{%STORAGE%}/g, laptop.storage);
            output = output.replace(/{%SCREEN%}/g, laptop.screen);
            res.end(output);
        });
    }
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL was not found on server!');
    }

    
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});