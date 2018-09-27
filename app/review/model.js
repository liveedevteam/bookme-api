const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    uId: {type: String, required: true},
    reviewProfile: { type: Object, default: []},
    bookingId: {type: String, default: ""},
    reviewTitle: {type: String, default: ""},
    reviewText: {type: String, default: ""},
    reviewRate: {type: String, default: ""},
    reviewReply : {type: Array, default: []},
    createDate: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Review', reviewSchema);