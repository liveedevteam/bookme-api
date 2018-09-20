const mongoose = require('mongoose');

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
    bookingPackagePrice: {type: Number, default: ""},
    bookingDate: {type: Array, default: ""},
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
    }
});

module.exports = mongoose.model('Booking', bookingSchema);