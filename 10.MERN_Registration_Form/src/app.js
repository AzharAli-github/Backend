const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');

require('./db/conn'); // Ensure the database connection is established


const Register = require('./models/registers');

const PORT = process.env.PORT || 8000;

const staticPath = path.join(__dirname, "../templates/views");
console.log(__dirname);
// console.log(__dirname);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));
app.set('view engine', 'hbs');
app.set('views', staticPath);
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/secret', auth ,  (req, res) => {
    console.log("This is the cookie" , auth , req.cookies.jwt);
    res.render('secret');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', auth , async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((curElem) => {
            return curElem.token !== req.token
        })

        res.clearCookie("jwt");
        
       await req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);
    }
});

//Logging out all the devices
app.get('/logoutall', auth , async(req, res) => {
    try {
        req.user.tokens = [];   
        res.clearCookie("jwt");
       await req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);
    }
}) 

app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        let registerEmployee;
        if (password === cpassword) {
            registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                cpassword: req.body.cpassword
            });
            const token = await registerEmployee.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            console.log("The token part" + token);

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }
        else {
            return res.status(400).send("Passwords are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        if (!useremail) {
            return res.status(400).send("Invalid Email or Password");
        }

        const isMatch = await bcrypt.compare(password, useremail.password);

        if (isMatch) {
            const token = await useremail.generateAuthToken();
            console.log("The login token part" + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });

            res.status(201).render("index");
        } else {
            res.status(400).send("Invalid Email or Password");
        }
    } catch (error) {
        res.status(400).send("Invalid Email or Password");
    }
});

const bcrypt = require('bcryptjs');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

