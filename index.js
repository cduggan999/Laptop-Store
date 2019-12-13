const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// Create Server
// Callback function is run each time someone accesses server
const server = http.createServer((req, res) => {

    console.log(req.url);
    // const query = url.parse(req.url, true);
    const pathName = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;
    const id = url.parse(req.url, true).query.id;

    // PRODUCT OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });
       // console.log('Someone did access the server');

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            
           // const laptop = laptopData[id];
           // output = replaceTemplate(data, laptop)

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                
                // .Join() used to make output a string
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });

        });
    }

    // LAPTOP DETAILS
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        //res.end(`This is the laptops page for laptop ${id}!`);
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            output = replaceTemplate(data, laptop)
            res.end(output);
        });
    }

    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
            fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
                res.writeHead(200, { 'Content-type': 'image/jpg'});
                res.end(data);
            });
    }

    // URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('URL was not found on server!');
    }


});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});

function replaceTemplate(originalHTML, laptop) {
 
    // Use regular Expression to replace text
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}

// 00:13:00 Part 2