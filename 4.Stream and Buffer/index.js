const fs = require('fs');
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
    // fs.readFile('input.txt', (err, data) => {
    //     if (err) {
    //         console.error(err);
    //         res.statusCode = 500;
    //         res.end('Error reading file');
    //         return;
    //     }
    //     res.end(data.toString());
    // });
    const rstream = fs.createReadStream('input.txt');

    rstream.on('data', (chunk) => {
        res.write(chunk);
    });

    rstream.on('end', () => {
        res.end();
    });

    rstream.on('error', (err) => {
        console.log(err);
    });
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to the port no 8000");
});


