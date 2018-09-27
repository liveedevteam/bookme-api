const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

const bookingSchema = mongoose.Schema({
    cId: {type: String, required: true},
    pId: {type: String, required: true},
    jobNo: {type: String, required: true},
    jobTitle: {type: String, default: ""},
    jobDescription: {type: String, default: ""},
    profile: {type: Object, default: {}},
    createDate: {type: Date, default: Date.now()},
    bookingPackage: {type: String, default: ""},
    bookingPackageName: {type: String, default: ""},
    bookingPackagePrice: {type: Float, default: ""},
    bookingDate: {type: Array, default: []},
    bookingProcessStatus: {type: Number, default: ""},
    bookingLocation: {
        type: Object, default: {
            lat: "",
            long: "",
            locationName: ""
        }
    },
    bookingProcessHistory: { type: Array, default: [
            {
                statusUpdate: 1,
                date: Date.now()
            }
        ]},
    bookingWorkUpload: {
        bookingImageUpload: []
    },
    job: {type: Array, default: ""},
    employ: {type: Array, default: ""}
});

module.exports = mongoose.model('Booking', bookingSchema);