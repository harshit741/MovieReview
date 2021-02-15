const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalRating: {
        type: Number,
        default: 0
    },
    // reviews: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Reviews'
    // }
})

const Movies = mongoose.model('Movie' , movieSchema);

module.exports = Movies;