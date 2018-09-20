const mongoose = require('mongoose');

const profileHistorySchema = mongoose.Schema({
    uId: { type: String, required: true },
    profile: { type: Object, default: {}},
    Gallery: [],
    favId: { type: Array, default: [] },
    favCount: { type: String, default: 0},
    createDate: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('ProfileHistory', profileHistorySchema);