const express = require('express');
const app = express();
const port = 6000 || process.env.PORT;
const path = require('path');
require('./db/conn');

//setting the path
const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

// middleware
app.use(express.json());


// routing
// app.get(path, callback)

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});