const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
    data: { type: String, default:'' },
    from: { type: String, default:'' }

});

module.exports = mongoose.model('Search', searchSchema);