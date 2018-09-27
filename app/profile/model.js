const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    fId: { type: String, require: true },
    tokenFirebase: { type: String, default: ''},
    title: { type: String, default: 'title'},
    somethingAboutYou: { type: String, default: 'Something About You'},
    firstName: {type: String, default: 'fname'},
    lastName: {type: String, default: 'lname'},
    birthDate: {type: Date, default: Date.now()},
    profilePhoto: {
        type: String,
        default: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c59.0.200.200/p200x200/10354686_10150004552801856_220367501106153455_n.jpg?_nc_cat=0&oh=ac418906c448f4e3b7b1e62912699246&oe=5B371325'
    },
    backgroundPhoto: {
        type: String,
        default: 'http://blog.entheosweb.com/wp-content/uploads/2012/03/fbs14_byentheosweb.jpg'
    },
    address: {type: String, default: "address"},
    city: {type: String, default: "city"},
    country: {type: String, default: "country"},
    mobile: {type: String, default: "mobile"},
    email: {type: String, default: "email"},
    favorite: {type: Array, default: []},
    documents: { type: Object, default: {
            bankAccount: {
                bankAccountName: "",
                bankAccountNumber: "",
                bankName: "",
                bankBookImage: "",
                verified: false
            },
            idCard: {
                idCardNumber: "",
                idCardImage: "",
                verified: false
            }
        }}
});

module.exports = mongoose.model('Profile', profileSchema);