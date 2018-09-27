const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
    catName: { type: String, required: true},
    catUrl: { type: String, default: 'https://uploads.wikimedia.org/wikipedia/commons/thumb/3/33/Tags_font_awesome.svg/2000px-Tags_font_awesome.svg.png'},
    subCat: { type: Array, default: '' },
    catImg: { type: String, default: ''},
    projects: { type: Object, default: ''},
    catProfessCount: { type: Number, default: 0}

});

module.exports = mongoose.model('Home', homeSchema);