const express = require('express');
const router = new express.Router();
const MensRanking = require('../models/mens');

// we will handle post request
router.post('/mens', async (req, res) => {
    try {
        const addingMensRecords = new MensRanking(req.body);
        console.log(req.body);
        const insertMens = await addingMensRecords.save();
        res.status(201).send(insertMens);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// we will handle get request
router.get('/mens', async (req, res) => {
    try {
        const request = req.body;
        const getMens = await MensRanking.find().sort({"ranking":1});
        res.send(getMens);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
 
// we will handle get request of individual
router.get('/men/:id', async (req, res) => {
    try {
        const  _id = req.params.id;
        const getMens = await MensRanking.findById(_id);
        res.send(getMens);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// we will handle patch request of individual
router.patch('/mens/:id', async (req, res) => {
    try {
        const  _id = req.params.id;
        const getMens = await MensRanking.findByIdAndUpdate(_id, req.body,{new:true});
        res.send(getMens);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/mens/:id', async (req, res) => {
    try {
        const  _id = req.params.id;
        const getMens = await MensRanking.findByIdAndDelete(_id);
        res.send(getMens);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;