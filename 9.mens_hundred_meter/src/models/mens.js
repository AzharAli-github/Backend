const mongoose = require('mongoose');

const mensSchema = new mongoose.Schema({
    ranking: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}); 


// We are creating a new collection called 'MensRanking' using the mensSchema
const MensRanking = mongoose.model('MensRanking', mensSchema);

module.exports = MensRanking;