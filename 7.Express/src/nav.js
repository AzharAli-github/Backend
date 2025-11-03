const express = require('express');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/about', (req, res) => {
  res.status(200).send('About Page');
});

app.get('/contact', (req, res) => {
  res.status(200).send('Contact Page');
});

app.get('/temp', (req, res) => {
  res.send([
    { temp: 22, city: 'New York' },
    { temp: 25, city: 'Los Angeles' },
    { temp: 18, city: 'Chicago' }
  ]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});