const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url == '/') {
        res.write('Hello, World!');
        res.end();
    } else if(req.url == '/about') {
        res.write('About Us');
        res.end();
    } else if(req.url == '/contact') {
        res.setHeader('Content-Type', 'text/html');
        res.write(`<!DOCTYPE html><html><body>
            <h1 style="text-align: center">Contact Us</h1>
            <p>Right Now I am displayed on a server side</p>
            <p>Right Now I am displayed on a server side</p>
            </body></html>`);
        res.end();
    } else {
        res.write('404 Not Found');
        res.end();
    }
});

server.listen(9000, () => {
    console.log('Server is listening on port 9000');
});
