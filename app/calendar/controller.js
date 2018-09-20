import Calendar from './model';
import Profile from "../profile/model";
import Professional from "../professional/model";

const CalendarController = {
    getAll(req, res) {
        Calendar.find({}, (err, response) => {
            res.json({
                err: err,
                response: true,
                data: response
            });
        });
    },

    get(req, res) {
        Calendar.findById(req.params.id, (err, response) => {
            console.log(response);
            res.json({
                err: err,
                response: true,
                data: response
            });
        })
    },

    async create(req, res) {

        const uId = req.body.uId;
        const pId = req.body.pId;

        let checkedCalendar = await checkCalendarByUId(uId)
        // console.log(checkedCalendar)
        console.log(uId)
        console.log(checkedCalendar)

        if (!checkedCalendar) {
            const newCalendar = new Calendar(req.body);

            console.log(newCalendar);

            newCalendar.save((err, calendar) => {
                if (err) {
                    res.json({
                        err: err,
                        response: false,
                        date: ""
                    });
                } else {
                    res.json({
                        err: "",
                        response: true,
                        date: calendar
                    });
                }
            });
        } else {
            let calendarByUId = await getCalendarByUId(uId)
            // console.log(calendarByUId)
            console.log(calendarByUId)
            if (calendarByUId.pId == pId) {
                res.json({
                    err: {message: "Calendar is duplicated!"},
                    response: false,
                    data: {}
                })
            } else {
                const newCalendar = new Calendar(req.body);

                console.log(newCalendar);

                newCalendar.save((err, calendar) => {
                    if (err) {
                        res.json({
                            err: err,
                            response: false,
                            date: ""
                        });
                    } else {
                        res.json({
                            err: "",
                            response: true,
                            date: calendar
                        });
                    }
                });
            }
        }

        // console.log(req.body);
    },

    async updateByJob(req, res) {
        const id = req.params.id;
        const calendar = await getCalendarById(id);
        const employDateAdd = req.body.jobDate;
        // console.log(jobDateAdd)
        // console.log(calendar)
        if (calendar) {
            calendar.calendar[0].jobDate = calendar.calendar[0].jobDate.concat(employDateAdd)
            console.log(calendar)
            Calendar.findByIdAndUpdate(id, calendar, (err, response) => {
                if (err) {
                    res.json({
                        err: {message: err},
                        response: false,
                        data: null
                    });
                }
                console.log(response.calendar[0].jobDate)
                res.json({
                    err: {message: err},
                    response: true,
                    data: "Update Calendar Complete"
                });

            })
        } else {
            res.json({
                err: {message: "Can not find Calendar!"},
                response: false,
                data: null
            });
        }
    },

    async updateByEmploy(req, res) {
        const id = req.params.id;
        const calendar = await getCalendarById(id);
        const employDateAdd = req.body.employDate;
        // console.log(jobDateAdd)
        // console.log(calendar)
        if (calendar) {
            calendar.calendar[0].employDate = calendar.calendar[0].employDate.concat(employDateAdd)
            // console.log(calendar)
            Calendar.findByIdAndUpdate(id, calendar, (err, response) => {
                if (err) {
                    res.json({
                        err: {message: err},
                        response: false,
                        data: null
                    });
                }
                // console.log(response.calendar[0].jobDate)
                res.json({
                    err: {message: err},
                    response: true,
                    data: "Update Calendar Complete"
                });

            })
        } else {
            res.json({
                err: {message: "Can not find Calendar!"},
                response: false,
                data: null
            });
        }
    },

    delete(req, res) {

        Calendar.findByIdAndRemove(req.params.id, (err, response) => {
            console.log(err);
            if (err) {
                res.json({
                    err: {message: err},
                    response: false,
                    data: ""
                });
            }

            res.json({
                err: {message: ""},
                response: true,
                data: "Delete Calendar Complete"
            });

        })
    },

    async getByUId(req, res) {
        let uId = req.params.id
        let calendar = await getCalendarByUId(uId)
        console.log(calendar);
        if (uId) {
            if (calendar) {
                res.json({
                    err: {message: ""},
                    response: true,
                    data: calendar
                })
            } else {
                res.json({
                    err: {message: "No Calendar"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No uId"},
                response: false,
                data: {}
            })
        }
    },

    async AddByUId(req, res) {
        let uId = req.params.id;
        let calendar = await getCalendarByUId(uId);
        let inputBusyDate = req.body.busyDate;
        let inputBookingDate = req.body.bookingDate;
        let pId = req.body.pId;
        let newCalendar = [
            {
                busyDate: [],
                bookingDate: [],
                uId: uId,
                pId: pId,
            }
        ]

        if (uId) {
            if (calendar) {
                if (inputBookingDate.length > 0) {
                    newCalendar[0].bookingDate = calendar[0].bookingDate.concat(inputBookingDate);
                }

                if (inputBusyDate.length > 0) {
                    newCalendar[0].busyDate = calendar[0].busyDate.concat(inputBusyDate);
                }

                console.log(newCalendar)

                Calendar.findByIdAndUpdate(calendar[0]._id, {
                    busyDate: newCalendar[0].busyDate,
                    bookingDate: newCalendar[0].bookingDate,
                    uId: uId,
                    pId: pId,
                }, (err, response) => {
                    console.log(err)
                    if (err) {
                        res.json({
                            err: {message: err},
                            response: false,
                            data: {}
                        })
                    }

                    if (response) {
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: newCalendar
                        })
                    }
                })
            } else {
                res.json({
                    err: {message: "No Calendar"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No uId"},
                response: false,
                data: {}
            })
        }
    },

    async updateByUId(req, res) {
        let uId = req.params.id;
        let calendar = await getCalendarByUId(uId);
        let inputBusyDate = req.body.busyDate;
        let inputBookingDate = req.body.bookingDate;
        let pId = req.body.pId;
        let newCalendar = [
            {
                busyDate: inputBusyDate,
                bookingDate: inputBookingDate,
                uId: uId,
                pId: pId,
            }
        ]

        if (uId) {
            if (calendar) {

                console.log(newCalendar)

                Calendar.findByIdAndUpdate(calendar[0]._id, {
                    busyDate: newCalendar[0].busyDate,
                    bookingDate: newCalendar[0].bookingDate,
                    uId: uId,
                    pId: pId,
                }, (err, response) => {
                    console.log(err)
                    if (err) {
                        res.json({
                            err: {message: err},
                            response: false,
                            data: {}
                        })
                    }

                    if (response) {
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: newCalendar
                        })
                    }
                })
            } else {
                res.json({
                    err: {message: "No Calendar"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No uId"},
                response: false,
                data: {}
            })
        }
    },

    async checkedDate(req, res) {
        const id = req.params.id
        const dateBody = req.body.calendar;
        // console.log("CHeck")
        Calendar.findById(id, (err, calandar) => {
            console.log(calandar)
            if (err) res.json({err: {message: err}, response: false, data: {}})
            if (calandar) {
                if (calandar.calendar[0].jobDate.length > 0) {
                    for (let i = 0; i < calandar.calendar[0].jobDate.length; i++) {
                        const dateTime = calandar.calendar[0].jobDate[i].split("T")
                        // console.log(dateTime)
                        const date = dateTime[0];
                        // console.log(date)
                        for (var key in dateBody.jobDate) {
                            if (dateBody.jobDate.hasOwnProperty(key)) {
                                // console.log(dateBody.jobDate[key]+"||"+date);
                                const dateBodySplit = dateBody.jobDate[key].split("T");
                                // console.log(dateBodySplit[0])
                                if(dateBodySplit[0] == date) {
                                    res.json({ err: {msg: "Date is Duplicate."}, response: false, data: []})
                                }
                                // console.log(i)
                                if((i+1) == calandar.calendar[0].jobDate.length) {
                                    res.json({ err: {msg: "Date is Empty."}, response: true, data: calandar})
                                }
                            }
                        }
                    }
                }
                if (calandar.calendar[0].employDate.length > 0) {
                    for (let i = 0; i < calandar.calendar[0].employDate.length; i++) {
                        // console.log(calandar.calendar[0].employDate[i])
                        const dateTime = calandar.calendar[0].employDate[i].split("T")
                        // console.log(dateTime)
                        const date = dateTime[0];
                        // console.log(date)
                        for (var key in dateBody.employDate) {
                            if (dateBody.employDate.hasOwnProperty(key)) {
                                // console.log(dateBody.jobDate[key]+"||"+date);
                                const dateBodySplit = dateBody.employDate[key].split("T");
                                // console.log(dateBodySplit[0])
                                if(dateBodySplit[0] == date) {
                                    res.json({ err: {msg: "Date is Duplicate."}, response: false, data: []})
                                }
                                // console.log(i)
                                if((i+1) == calandar.calendar[0].employDate.length) {
                                    res.json({ err: {msg: "Date is Empty."}, response: true, data: calandar})
                                }
                            }
                        }
                    }
                }
                if (calandar.calendar[0].busyDate.length > 0) {
                    for (let i = 0; i < calandar.calendar[0].busyDate.length; i++) {
                        // console.log(calandar.calendar[0].busyDate[i])
                        // console.log(calandar.calendar[0].employDate[i])
                        const dateTime = calandar.calendar[0].busyDate[i].split("T")
                        // console.log(dateTime)
                        const date = dateTime[0];
                        // console.log(date)
                        for (var key in dateBody.busyDate) {
                            if (dateBody.busyDate.hasOwnProperty(key)) {
                                // console.log(dateBody.jobDate[key]+"||"+date);
                                const dateBodySplit = dateBody.busyDate[key].split("T");
                                // console.log(dateBodySplit[0])
                                if(dateBodySplit[0] == date) {
                                    res.json({ err: {msg: "Date is Duplicate."}, response: false, data: []})
                                }
                                // console.log(i)
                                if((i+1) == calandar.calendar[0].busyDate.length) {
                                    res.json({ err: {msg: "Date is Empty."}, response: true, data: calandar})
                                }
                            }
                        }
                    }
                }
            } else {
                res.json({err: {message: "No Calendar ID"}, response: false, data: {}})
            }
        })
    }
};

function getAllCalendar() {
    return new Promise((resolve, reject) => {
        Calendar.find({}, (err, response) => {
            Calendar.find({}, (err, response) => {
                if (err) resolve(false)
                if (response) {
                    resolve(response)
                } else {
                    resolve(false)
                }
            });
        })
    })
}

function getCalendarById(id) {
    return new Promise((resolve, reject) => {
        Calendar.findById(id, (err, response) => {
            console.log(typeof response)
            Calendar.findById(id, (err, response) => {
                if (err) resolve(false)
                if (response) {
                    resolve(response)
                } else {
                    resolve(false)
                }
            });
        })
    })
}

function getCalendarByUId(uId) {
    return new Promise((resolve, reject) => {
        Calendar.find({}, (err, response) => {
            Calendar.find({uId: uId}, (err, response) => {
                if (err) resolve(false)
                if (response) {
                    resolve(response[0])
                } else {
                    resolve(false)
                }
            });
        })
    })
}

function checkCalendarByUId(uId) {
    return new Promise((resolve, reject) => {
        Calendar.find({}, (err, response) => {
            Calendar.find({uId: uId}, (err, response) => {
                if (err) resolve(false)
                if (response) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
        })
    })
}

export default CalendarController;