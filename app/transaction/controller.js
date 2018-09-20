import Transaction from './model';
import request from 'request';
import FCM from 'fcm-node';
import Profile from "../profile/model";
import Booking from "../booking/model"

var serverKey = "AAAA-MhblIg:APA91bFgoDV5dUXqta5qT4Fv9d6_1xddU8t6p-Q6IeQHzQeLxT8-x9L13fQ-i58QPXx-uxWNqU-DEdDHfNqQ6rE3APXF771Z6DtmILKxdXpWHn4JH8xuqc0_AVZa33Q6vZcRtvp5A80A";
var fcm = new FCM(serverKey);

const TransactionController = {
    async getAll(req, res) {
        let transactions = await getAllTransactions();
        if (transactions) {
            if (transactions.length == 0) {
                res.json({
                    err: {message: "No Data"},
                    response: false,
                    data: {}
                })
            } else {
                res.json({
                    err: {message: ""},
                    response: true,
                    data: transactions
                })
            }
        } else {
            res.json({
                err: {message: "Fetch Data Error"},
                response: false,
                data: {}
            })
        }
    },

    async get(req, res) {
        let transId = req.params.id;
        let transactions = await getAllTransactions();
        if (transactions) {
            for (let i = 0; transactions.length > i; i++) {
                if (transactions[i].id == transId) {
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: transactions[i]
                    })
                }
            }
        } else {
            res.json({
                err: {message: "Id is not match"},
                response: false,
                data: {}
            })
        }
    },

    async create(req, res) {
        const cId = req.body.cId;
        const pId = req.body.pId;
        const bookingId = req.body.bookingId;
        const transactionType = 0;
        const amount = parseInt(req.body.amount*100);
        const token = req.body.token;

        // console.log(cId, pId, bookingId, transactionType, amount, token)

        const options = {
            method: 'POST',
            url: 'https://api.omise.co/charges',
            headers:
                {
                    'Postman-Token': '743ca92b-43fa-4b5f-9c20-540a74f6a320',
                    'Cache-Control': 'no-cache',
                    'Authorization': 'Basic c2tleV90ZXN0XzVjOXhtbWw3dzZmN3ozYW1sZjY=',
                    'Content-Type': 'application/json'
                },
            body:
                {
                    description: 'Charge for bookingId:' + pId,
                    amount: amount,
                    currency: 'thb',
                    return_uri: 'http://www.example.com/orders/3947/complete',
                    card: token
                },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            if (body) {
                // console.log(body.object)
                if (body.object == "error") {
                    res.json({
                        err: {message: body},
                        response: false,
                        data: {}
                    })
                } else if (body.object == "charge") {
                    const newTransaction = new Transaction({
                        cId: cId,
                        pId: pId,
                        bookingId: bookingId,
                        createDate: Date.now(),
                        transactionType: transactionType,
                        sourceAccountNo: req.body.sourceAccountNo,
                        sourceAccountName: req.body.sourceAccountName,
                        sourceBank: req.body.sourceBank,
                        destinationAccountNo: req.body.destinationAccountNo,
                        destinationAccountName: req.body.destinationAccountName,
                        destinationBank: req.body.destinationBank,
                        amount: (amount*0.01),
                        transferDateTime: Date.now(),
                        paymentStatus: 1,
                        omiseCallBack: {
                            omiseId: body.id,
                            transaction: body.transaction
                        }
                    });

                    newTransaction.save(async (err, transactions) => {
                        if (err) {
                            res.json({
                                err: err,
                                response: false,
                                data: ""
                            });
                        }

                        const options = {
                            method: 'PUT',
                            url: 'http://bookme.bluweo.com:3023/api/booking/'+bookingId,
                            headers:
                                {
                                    'Cache-Control': 'no-cache',
                                    'Content-Type': 'application/json'
                                },
                            body: {bookingProcessStatus: 3},
                            json: true
                        };

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error);

                            // console.log(body);

                            res.json({
                                err: "",
                                response: true,
                                data: newTransaction
                            });
                        });

                    });
                }
            }
        });

        // const newTransaction = new Transaction({
        //     cId: req.body.cId,
        //     pId: req.body.pId,
        //     bookingId: req.body.bookingId,
        //     createDate: Date.now(),
        //     transactionType : req.body.transactionType,
        //     sourceAccountNo : req.body.sourceAccountNo,
        //     sourceAccountName : req.body.sourceAccountName,
        //     sourceBank : req.body.sourceBank,
        //     destinationAccountNo : req.body.destinationAccountNo ,
        //     destinationAccountName : req.body.destinationAccountName,
        //     destinationBank : req.body.destinationBank,
        //     amount : req.body.amount,
        //     transferDateTime : req.body.transferDateTime,
        //     paymentStatus : req.body.paymentStatus,
        //     responsePaymentGateway : req.body.responsePaymentGateway,
        //     slipUpload : req.body.slipUpload,
        //     promoCode : req.body.promoCode
        // });
        //
        // newTransaction.save((err, transactions) => {
        //     if(err) {
        //         res.json({
        //             err: err,
        //             response: false,
        //             date: ""
        //         });
        //     } else {
        //         res.json({
        //             err: "",
        //             response: true,
        //             date: transactions
        //         }) ;
        //     }
        // });
    },

    update(req, res) {
        const transactions = req.body;
        const transId = req.params.id

        Transaction.findByIdAndUpdate(transId, transactions, (err, response) => {
            console.log(err);
            if (err) {
                res.json({
                    err: err,
                    response: false,
                    data: ""
                });
            }

            res.json({
                err: err,
                response: true,
                data: "Update Home Complete"
            });

        })
    },

    delete(req, res) {
        Transaction.findByIdAndRemove(req.params.id, (err, response) => {
            if (err) {
                res.json({
                    err: err,
                    response: false,
                    data: ""
                });
            }

            res.json({
                err: err,
                response: true,
                data: "Delete Home Complete"
            });

        })
    },

    async checkPromo(req, res) {
        let promoCode = req.body.promoCode
        if (promoCode) {
            res.json({
                promoCode: promoCode,
                discountValue: 1000,
                discountPercent: 10
            })
        } else {
            res.json({
                err: {message: "No Promo Code"},
                response: false,
                data: ""
            });
        }
    },

    getBankAccount(req, res) {
        res.json({
            err: {message: ""},
            response: true,
            data: [
                {
                    "bankAccountNo": "0987654321",
                    "bankAccountName": "Bluweo",
                    "bankName": "Siam Commercial Bank",
                },
                {
                    "bankAccountNo": "0987654322",
                    "bankAccountName": "Bluweo",
                    "bankName": "Kasikorn Bank",
                }
            ]
        })
    }
};

function getAllTransactions() {
    return new Promise((resolve, reject) => {
        Transaction.find({}, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve("No Data")
            }
        })
    })
}

function getProfileById(pId) {
    return new Promise((resolve, reject) => {
        Profile.findById(pId, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

function getBookingById(bookingId) {
    return new Promise((resolve, reject) => {
        Booking.findById(bookingId, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}


export default TransactionController;