const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    uId: {type: String, required: true},
    bookingId: {type: String, default: ""},
    reviewTitle: {type: String, default: ""},
    reviewText: {type: String, default: ""},
    reviewRate: {type: String, default: ""},
    reviewReply : {type: Array, default: []},
});

module.exports = mongoose.model('Review', reviewSchema);