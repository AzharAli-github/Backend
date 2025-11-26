const express = require('express');
require('./db/conn');
const MensRanking = require('./models/mens');
const router = require('./router/men');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);  // Use the router module



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});