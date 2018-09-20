const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
    uId: {type: String, required: true},
    pId: {type: String, required: true},
    calendar: {
        type: Array, default: [
            {
                busyDate: [],
                jobDate: [],
                employDate: []
            }
        ]
    },
});

module.exports = mongoose.model('Calendar', calendarSchema);