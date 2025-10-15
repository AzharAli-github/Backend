const express = require('express');
const sendMail = require('./controllers/sendMail');
const app = express();
let PORT = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get ('/sendemail', sendMail);

const start = async () => {
try {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}` );
    });
} catch (error) {
    
}
}

start();