import Booking from './model';
import Profile from '../profile/model';
import Professional from '../professional/model'
import FCM from 'fcm-node';
import keys from '../../config/keys';

var serverKey = keys.firebaseServerKey;
var fcm = new FCM(serverKey);

const BookingController = {
    async getAll(req, res) {
        let allBooking = await getAllBooking();
        for (let i = 0; allBooking.length > i; i++) {
            let pId = allBooking[i].pId;
            let profile = await getProfileById(pId)
            allBooking[i].profile = profile
            if (allBooking.length == (i + 1)) {
                res.json({
                    err: {message: ""},
                    response: true,
                    data: allBooking
                })
            }
        }
    },

    async get(req, res) {
        let bookingId = req.params.id;
        let allBooking = await getAllBooking();
        if (bookingId) {
            for (let i = 0; allBooking.length > i; i++) {
                let profile = await getProfileById(allBooking[i].pId);
                if (allBooking[i].id == bookingId) {
                    allBooking[i].profile = profile
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: allBooking[i]
                    })
                }
            }
        } else {
            res.json({
                err: {message: "No CId"},
                response: false,
                data: {}
            })
        }
    },

    async create(req, res) {
        let bookingCId = req.body.cId;
        let bookingPId = req.body.pId;
        let jobNo = Date.now();
        let jobTitle = req.body.jobTitle;
        let jobDescription = req.body.jobDescription;
        let bookingPackage = req.body.bookingPackage;
        let bookingPackageName = req.body.bookingPackageName;
        let bookingDate = req.body.bookingDate;
        let bookingPackagePrice = req.body.bookingPackagePrice;
        let bookingProcessStatus = req.body.bookingProcessStatus;
        let bookingLocation = req.body.bookingLocation;
        let bookingImageUpload = req.body.bookingWorkUpload.bookingImageUpload;
        let newBooking = new Booking({
            cId: bookingCId,
            pId: bookingPId,
            jobNo: jobNo,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            createDate: Date.now(),
            bookingPackage: bookingPackage,
            bookingPackageName: bookingPackageName,
            bookingPackagePrice: bookingPackagePrice,
            bookingDate: bookingDate,
            bookingProcessStatus: bookingProcessStatus,
            bookingLocation: {
                lat: bookingLocation.lat,
                long: bookingLocation.long,
                locationName: bookingLocation.locationName
            },
            bookingWorkUpload: {
                bookingImageUpload: bookingImageUpload
            }
        })

        const profileProfess = await getProfileById(newBooking.pId);

        newBooking.save((err, saveProfile) => {
            if (err) {
                res.json({
                    err: err,
                    response: false,
                    data: null
                });
                console.log(err);
            } else {
                const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: profileProfess.tokenFirebase,
                    collapse_key: 'your_collapse_key',

                    notification: {
                        title: 'Bookme',
                        body: 'New Booking'
                    },

                    data: {  //you can send only notification or only data(or include both)
                        my_key: '1068513334408',
                        my_another_key: 'my another value'
                    }
                };

                fcm.send(message, function(err, response){
                    if (err) {
                        console.log("Something has gone wrong!");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });
                res.json({
                    err: "",
                    response: true,
                    data: newBooking
                });
            }
        });

    },

    async update(req, res) {
        let bookingId = req.params.id;
        let bookingProcessStatus = req.body.bookingProcessStatus
        let bookingObjectHistory = {
            statusUpdate: req.body.bookingProcessStatus,
            date: Date.now()
        }
        console.log(bookingProcessStatus)


        if (bookingId) {
            Booking.findById(bookingId, async (err, booking) => {
                // console.log(booking.bookingProcessStatus)
                // console.log(booking.cId)
                const profileProfess = await getProfileById(booking.pId);
                // console.log(profileProfess)
                const profileCustomer = await getProfileById(booking.cId);

                console.log(profileCustomer._id);
                console.log(profileCustomer);
                // console.log(profileEmployer)
                // console.log(profileEmployee)
                booking.bookingProcessStatus = req.body.bookingProcessStatus
                booking.bookingProcessHistory.push(bookingObjectHistory)
                Booking.findByIdAndUpdate(bookingId, booking, async (err, response) => {
                    if (err) res.json({err: {message: err}, response: false, data: {}})
                    if(bookingProcessStatus == 0) {
                        const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Cancel Booking')
                        const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Cancel Booking')
                    }

                    if(bookingProcessStatus == 1) {
                        const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'New Booking'+profileProfess.firstName)
                    }

                    if(bookingProcessStatus ==2) {
                        const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'You are booking is confirmed.')
                    }

                    if(bookingProcessStatus ==3) {
                        const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Make Payment')
                    }

                    if(bookingProcessStatus ==4) {
                        const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Confirm Payment.')
                    }

                    if(bookingProcessStatus ==5) {
                        const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Work Complete.')
                    }

                    if(bookingProcessStatus ==6) {
                        const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Approve Payment')
                    }

                    if(bookingProcessStatus ==7) {
                        const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Transfer Payment')
                        const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Transfer Payment')
                    }

                    if(bookingProcessStatus ==8) {
                        const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Work Done')
                        const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Work Done')
                    }
                    if (response) {
                        res.json({
                            err: {message: "Update completed."},
                            response: true,
                            data: req.body
                        })
                    } else {
                        res.json({
                            err: {message: "Save is not completed."},
                            response: false,
                            data: {}
                        })
                    }
                })
            })
        } else {
            res.json({
                err: {message: "Id is not matched."},
                response: false,
                data: {}
            })
        }
    },

    delete(req, res) {
        let id = req.params.id;
        let cId = req.body.cId;
        let pId = req.body.pId;

        if (id && cId && pId) {
            Booking.findById(id, (err, response) => {
                if (err) res.json({err: {message: err}, response: false, data: {}})
                let bookingResponse = response;
                if (bookingResponse.cId == cId) {
                    if (bookingResponse.pId == pId) {
                        Booking.findByIdAndRemove(id, (err, response) => {
                            if (err) {
                                res.json({err: {message: err}, response: false, data: {}})
                            }
                            else {
                                res.json({
                                    err: {message: ""},
                                    response: true,
                                    data: "Delete Successd."
                                })
                            }
                        })
                    } else {
                        res.json({
                            err: {message: "Input is not PId."},
                            response: false,
                            data: {}
                        })
                    }

                } else {
                    res.json({
                        err: {message: "Input is not CId."},
                        response: false,
                        data: {}
                    })
                }
            })
        } else {
            res.json({
                err: {message: "Input is not complete."},
                response: false,
                data: {}
            })
        }
    },

    async getByUId(req, res) {
        let uId = req.params.id;
        let allBooking = await getAllBooking();
        // console.log(allBooking)
        if (uId) {
            if (allBooking.length > 0) {
                let uIdArray = []
                for (let i = 0; allBooking.length > i; i++) {
                    if ((allBooking[i].cId == uId) || (allBooking[i].pId == uId)) {
                        let profile = await getProfileById(allBooking[i].pId)
                        allBooking[i].profile = profile
                        uIdArray.push(allBooking[i]);
                        // console.log(i)
                        // console.log(allBooking.length)
                    }
                    if (allBooking.length == (i + 1)) {
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: uIdArray
                        })
                    }
                }
                if (uIdArray.length == 0) {
                    res.json({
                        err: {message: "No Booking"},
                        response: false,
                        data: uIdArray
                    })
                }
            } else {
                res.json({
                    err: {message: "No Booking"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No CId"},
                response: false,
                data: {}
            })
        }
    },

    async omiseCreditCard(req, res) {
        let token = req.params.token
        console.log("Omise Credit Card:"+ token)
    }
};

function getAllBooking() {
    return new Promise((resolve, reject) => {
            Booking.find({}, (err, response) => {
                if (err) resolve(false)
                if (response) {
                    resolve(response)
                } else {
                    resolve(false)
                }
            });
        }
    )
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

function getProfessionalById(pId) {
    return new Promise((resolve, reject) => {
        Professional.findById(pId, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

function sendNotification(receivpient, key, msg) {
    return new Promise((resolve, reject) => {
        const message = {
            to: receivpient,
            collapse_key: "",

            notification: {
                title: 'Bookme',
                body: msg,
                sound: 'default'
            },

            data: {
                my_key: key,
                my_another_key: 'my another value'
            }
        };

        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
                resolve(false)
            } else {
                console.log("Successfully sent with response: ", response);
                resolve(true)
            }
        });
    });
}

export default BookingController;