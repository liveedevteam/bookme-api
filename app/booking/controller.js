import Booking from './model';
import Profile from '../profile/model';
import Professional from '../professional/model'
import Calendar from '../calendar/model';
import FCM from 'fcm-node';
import keys from '../../config/keys';

var serverKey = keys.firebaseServerKey;
var fcm = new FCM(serverKey);

const BookingController = {
    async getAll(req, res) {
        let allBooking = await getAllBooking();
        console.log(allBooking)
        for (let i = 0; allBooking.length > i; i++) {
            let pId = allBooking[i].pId;
            let profile = await getProfileById(pId)
            allBooking[i].profile = profile
            if (allBooking.length == (i + 1)) {
                allBooking.sort(function(a, b) {
                    const dateA = new Date(a.createDate)
                    const dateB = new Date(b.createDate)
                    return dateB - dateA;
                })
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

        Calendar.find({uId:cId, pId: pId}, (err, calendar) => {
            if(err) {
                res.json({
                    err: err,
                    response: false,
                    data: null
                });
            }
            if(!calendar) {
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
                                body: 'You got Booking',
                                sound: 'default',
                                badge : 1,
                            },

                            data: {  //you can send only notification or only data(or include both)
                                my_key: '1068513334408',
                                my_another_key: profileProfess.profile.pId
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
            } else {
                Calendar.findByIdAndUpdate(calendar._id, calendar, (err, calendar) => {
                    if(err) {
                        res.json({
                            err: err,
                            response: false,
                            data: null
                        });
                    }
                    if(calendar) {
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
                                        body: 'You got Booking',
                                        sound: 'default',
                                        badge : 1,
                                    },

                                    data: {  //you can send only notification or only data(or include both)
                                        my_key: '1068513334408',
                                        my_another_key: profileProfess.profile.pId
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
                    } else {
                        res.json({
                            err: {msg: "No Calendar."},
                            response: false,
                            data: {}
                        });
                    }
                })
            }
        })

    },

    async update(req, res) {
        let bookingId = req.params.id;
        let bookingProcessStatus = req.body.bookingProcessStatus
        let bookingObjectHistory = {
            statusUpdate: req.body.bookingProcessStatus,
            date: Date.now()
        }
        // console.log(bookingProcessStatus)


        if (bookingId) {
            Booking.findById(bookingId, async (err, booking) => {
                // console.log(booking.bookingProcessStatus)
                // console.log(booking.cId)
                const profileProfess = await getProfileById(booking.pId);
                // console.log(profileProfess)
                const profileCustomer = await getProfileById(booking.cId);

                // console.log(profileCustomer._id);
                // console.log(profileCustomer);
                // console.log(profileEmployer)
                // console.log(profileEmployee)

                booking.bookingProcessStatus = req.body.bookingProcessStatus
                booking.bookingProcessHistory.push(bookingObjectHistory)
                Booking.findByIdAndUpdate(bookingId, booking, async (err, response) => {
                    if (err) res.json({err: {message: err}, response: false, data: {}})
                    if(bookingProcessStatus == 0) {
                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Cancel Booking',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Cancel Booking',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }

                    if(bookingProcessStatus == 1) {
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Booking request sent for ' + profileCustomer.firstName)
                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Booking request sent for ' + profileCustomer.firstName,
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }

                    if(bookingProcessStatus ==2) {
                        // const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Congratulations Your Booking is confirmed by ' + profileProfess.firstName + 'already.')
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Your comfirm already sent to ' + profileCustomer.firstName)

                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Congratulations Your Booking is confirmed by ' + profileProfess.firstName + 'already.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Your comfirm already sent to ' + profileCustomer.firstName,
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                    }

                    if(bookingProcessStatus ==3) {
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", profileCustomer.firstName + ' already make payment for this job.')
                        // const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Your payment was already success.')

                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: profileCustomer.firstName + ' already make payment for this job.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Your payment was already success.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                    }

                    if(bookingProcessStatus ==4) {
                        // const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Payment from ' + profileCustomer.firstName + ' was confirm by Bluweo.')
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Payment from ' + profileCustomer.firstName + ' was confirm by Bluweo.')

                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Payment from ' + profileCustomer.firstName + ' was confirm by Bluweo.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Payment from ' + profileCustomer.firstName + ' was confirm by Bluweo.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }

                    if(bookingProcessStatus ==5) {
                        // const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", profileProfess.firstName + ' already complete work. Please approve payment to transfer money to ' + profileCustomer.firstNam)
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Request Transfer already sent to ' + profileCustomer.firstName)

                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: profileProfess.firstName + ' already complete work. Please approve payment to transfer money to ' + profileCustomer.firstName,
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Request Transfer already sent to ' + profileCustomer.firstName,
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                    }

                    if(bookingProcessStatus ==6) {
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "",profileCustomer.firstName + ' was approve payment. Money will transfer within 2 business days.')
                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: profileCustomer.firstName + ' was approve payment. Money will transfer within 2 business days.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }

                    if(bookingProcessStatus ==7) {
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Transfer Payment Complete. We hope you enjoy with bookme.')
                        // const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Transfer Payment Complete. We hope you enjoy with bookme. And choose we again.')

                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Transfer Payment Complete. We hope you enjoy with bookme. And choose we again.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Transfer Payment Complete. We hope you enjoy with bookme.',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }

                    if(bookingProcessStatus ==8) {
                        // const sendProfess = await sendNotification(profileProfess.tokenFirebase, "", 'Work Done')
                        // const sendCustomer = await sendNotification(profileCustomer.tokenFirebase, "", 'Work Done')
                        const messageCM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileCustomer.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Work Done',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messageCM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });

                        const messagePM = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: profileProfess.tokenFirebase,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: 'Bookme',
                                body: 'Work Done',
                                sound: 'enable',
                                badge : 1,
                                priority:'hight'
                                // click_action : "OPEN_WORK_VIEW"
                            },

                            data: {
                                my_key: '',
                                my_another_key: 'my another value'
                            }
                        };

                        fcm.send(messagePM, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
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
                        if(profile) {
                            allBooking[i].profile = profile
                        } else {
                            allBooking[i].profile = []
                        }
                        allBooking[i].profile = profile
                        // if(allBooking[i].cId == uId) {
                        //     allBooking[i].employ = allBooking[i]
                        // } else {
                        //     allBooking[i].job = allBooking[i]
                        // }
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
    },

    async checkedDay(req, res) {
        const bookings = await getAllBooking()
        // console.log(bookings)
        for(let i=0;i<bookings.length;i++) {
            // console.log(bookings[i].bookingDate)
            for(let j=0;j<bookings[i].bookingDate.length;j++) {
                let date = new Date()
                console.log(date.getDay())
                console.log(date)
                let dateArray = bookings[i].bookingDate[j].split("-")
                let bookingYear = parseInt(dateArray[0])
                let bookingMonth = parseInt(dateArray[1])
                let bookingDay = parseInt(dateArray[2])
                // console.log(dateArray[0])
                // console.log(dateArray[1])
                // console.log(dateArray[2])
                // console.log(time[1])
                // console.log(date.getDate())
                // console.log(date.getMonth())
                // console.log(date.getFullYear())
                console.log(bookingDay +"||"+parseInt(date.getDate()))
                if(
                    (bookingYear - parseInt(date.getFullYear()) <= 0) &&
                    (bookingMonth - parseInt(date.getMonth()) <= 0) &&
                    (bookingDay - parseInt(date.getDay()) == 1)) {

                    const message = {
                        to: bookings[i].pId,
                        collapse_key: "",

                        notification: {
                            title: 'Bookme',
                            body: "เหลือเวลาทำงานอีกหนึ่งวัน",
                            sound: 'enable',
                            badge : 1,
                            priority:'hight'
                            // click_action : "OPEN_WORK_VIEW"
                        },

                        data: {
                            my_key: key,
                            my_another_key: 'my another value'
                        }
                    };

                    fcm.send(message, function(err, response){
                        if (err) {
                            console.log("Something has gone wrong!");
                            res.json({err: {msg: ""}, response: false, data: {msg: err}})
                        } else {
                            console.log("Successfully sent with response: ", response);
                            res.json({err: {msg: ""}, response: true, data: {msg: "Send Complete"}})
                        }
                    });
                } else {
                    res.json({err: {msg: ""}, response: true, data: {msg: "No Date"}})
                }

            }
        }
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
                sound: 'enable',
                badge : 1,
                priority:'hight'
                // click_action : "OPEN_WORK_VIEW"
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