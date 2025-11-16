const express = require('express');
require("./db/conn")
const Student = require("./models/students");
const studentRouter = require("./routers/student");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(studentRouter);

// Create New Students

// app.post('/students', (req, res) => {
//     console.log(req.body);
//     const user = new Student(req.body);
//     res.status(201).send(user);
//     user.save().then(() => {
//         res.send(user);
//     }).catch((e) => {
//         res.status(400).send(e)})

// });

app.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
})