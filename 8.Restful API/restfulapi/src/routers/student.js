const express = require('express');
const router = new express.Router();
const Student = require("../models/students");

router.post('/students', async (req, res) => {
    try {
        const user = new Student(req.body);
        const createUser = await user.save();
        res.status(201).send(createUser);
    } catch (e) {
        res.status(400).send(e);
    }
});


// Getting Users by GET method

router.get('/students', async (req, res) => {
    try {
        const studentsData = await Student.find();
        res.send(studentsData);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Getting Individual User by ID using GET method

router.get('/students/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const studentData = await Student.findById(_id);
        if (!studentData) {
            return res.status(404).send();  
        } else {
            res.send(studentData);
        }
    } catch (e) {
        res.status(500).send(e);
}});

// Getting Individual User by Name using GET method

router.get('/students/name/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const studentData = await Student.find({ name: name });
        if (!studentData || studentData.length === 0) {
            return res.status(404).send();
        } else {
            res.send(studentData);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});


// Delete User by ID using DELETE method

router.delete('/students/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteStudent = await Student.findByIdAndDelete(_id);
        if (!_id) {
            return res.status(400).send();
        }
        res.send(deleteStudent);
    } catch (e) {
        res.status(500).send(e);
    }
});


// Update User by ID using PATCH method
router.patch('/students/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const updateStudent = await Student.findByIdAndUpdate(_id, req.body, { new: true });
        res.send(updateStudent);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
