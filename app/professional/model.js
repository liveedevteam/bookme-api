const mongoose = require('mongoose');

const professionalSchema = mongoose.Schema({
    uId: { type: String, required: true},
    profile: { type: Object, default: {}},
    portfolio: { type: Object, default: '' },
    projects: { type: Array, default: ''},
    packages: { type: Array, default: ''},
    createDate: { type:Date, default: Date.now()},
    updateDate: { type: Date, default: ''},
    categories: { type: Object, default: {}},
    recommend: { type: Boolean, default: false},
    review: { type: Number, default: 0},
    favCount: { type: Number, default: 0}

});

module.exports = mongoose.model('Professional', professionalSchema);