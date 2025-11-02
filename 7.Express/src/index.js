const path = require('path');
const express = require('express');
const hbs = require('hbs');
const requests = require('requests');
const app = express();
const port = 5000;

// app.use(express.static('public'));

// console.log(path.join(__dirname, "../public"));

// const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// to set the view engine
app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialsPath);


// app.use(express.static(staticPath));

app.get("/", (req, res) => {
  res.render('index', {
    myTitle: "Discover Your Next Adventure",
    myName: "John Doe"
  });
});

app.get("/about", (req, res) => {
   requests(
    `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${req.query.name}&appid=c66f4863eb75da25237fa9b61dc385cf`
    )
    .on('data', (chunk) => {
      const objData = JSON.parse(chunk);
      const arrData = [objData];

      const realTimeData = arrData
      .map((val) => replaceVal(homeFile, val))
      .join("");
      res.write(realTimeData);
      // console.log(realTimeData);
    })
    .on('end', (err) => {
      if (err) return console.log('connection closed due to errors', err);

      res.end();
    });
  });


app.use("/service", (req, res) => {
  res.render('service', {
    myTitle: "Our Services",
    myName: "John Doe"
  });
});


app.use((req, res) => {
  res.status(404).render('404', {
    myTitle: "404 Error",
    myName: "John Doe",
    errorMsg: "Oops! Page Not Found"
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
