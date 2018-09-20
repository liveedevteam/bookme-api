const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    cId: {type: String, required: true},
    pId: {type: String, required: true},
    bookingId: {type: String, required: true},
    createDate: {type: Date, default: Date.now()},
    transactionType : {type: Number, default: ""},
    sourceAccountNo : {type: String, default: ""},
    sourceAccountName : {type: String, default: ""},
    sourceBank : {type: String, default: ""},
    destinationAccountNo : {type: String, default: ""} ,
    destinationAccountName : {type: String, default: ""},
    destinationBank : {type: Number, default: ""},
    amount : {type: String, default: ""},
    transferDateTime : {type: String, default: ""},
    paymentStatus : {type: Number, default: ""},
    responsePaymentGateway : {type: String, default: ""},
    slipUpload : {type: String, default: ""},
    promoCode : {type: String, default: ""},
    omiseCallBack: {type: Object, default: {
            omiseId: "",
            transaction: ""
        }}
});

module.exports = mongoose.model('Transaction', transactionSchema);