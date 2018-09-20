import Review from './model';
import Profile from "../profile/model";
import Professional from "../professional/model";
import Calendar from "../calendar/model";

const ReviewController = {

    getAll(req, res) {
        Review.find({}, (err, response) => {
            res.json({
                err: err,
                response: true,
                data: response
            });
        });
    },

    get(req, res) {
        Review.findById(req.params.id, (err, response) => {
            console.log(response);
            res.json({
                err: err,
                response: true,
                data: response
            });
        })
    },

    create(req, res) {
        const review = req.body
        const newReview = new Review({
            uId: review.uId,
            bookingId: review.bookingId,
            reviewTitle: review.reviweTitle,
            reviewText: review.reviewText,
            reviewRate: review.reviewRate,
            reviewReply : review.reviweReply
        })

        if(review.uId && review.bookingId) {
             newReview.save((err, newReview) => {
                 if (err) {
                     res.json({
                         err: err,
                         response: false,
                         date: ""
                     });
                 } else {
                     res.json({
                         err: {message: ""},
                         response: true,
                         date: newReview
                     });
                 }
             })
        } else {
            res.json({
                err: { message: "UID or BookingId is not Defined."},
                response: false,
                data: {}
            })
        }
    },

    update(req, res) {
        const id = req.params.id;
        const updateBody = req.body
        Review.findByIdAndUpdate(id, updateBody, (err, response) => {
            if(err) res.json({err: { message: err}, resonse: false, data: {}})
            if(response) {
                res.json({
                    err: { messasge: ""},
                    response: true,
                    data: {
                        message: "Update reply complete"
                    }
                })
            } else {
                res.json({
                    err: { message: "Update is not complete."},
                    response: false,
                    data: {}
                })
            }
        })
    },

    updateReply(req, res) {
        const id = req.params.id;
        const replyReviewTitle = req.body.replyReviewTitle;
        const replyReviewText = req.body.replyReviewText;
        const replyObj = {
            replyReviewTitle: replyReviewTitle,
            replyReviewText: replyReviewText
        }
        // console.log(id);
        Review.findById(id, (err, response) => {
            console.log(response)
            if(response) {
                response.reviewReply.push(replyObj);
                // console.log(response)
                Review.findByIdAndUpdate(id, response, (err, response) => {
                    if(err) {
                        res.json({
                            err: { messasge: err},
                            response: false,
                            data: {}
                        })
                    }

                    if(response) {
                        res.json({
                            err: { messasge: ""},
                            response: true,
                            data: {
                                message: "Update reply complete"
                            }
                        })
                    } else {
                        res.json({
                            err: { messasge: "Update is not complete!"},
                            response: false,
                            data: {}
                        })
                    }
                })
            } else {
                res.json({
                    err: { message: "No Booking Id"},
                    response: false,
                    data: {}
                })
            }
        })
    },

    delete(req, res) {
        const id = req.params.id;
        Review.findByIdAndRemove(id, (err, response) => {
            if(err) res.json({err: { message: err}, resonse: false, data: {}})
            if(response) {
                res.json({
                    err: { messasge: ""},
                    response: true,
                    data: {
                        message: "Delete complete"
                    }
                })
            } else {
                res.json({
                    err: { message: "Delete is not complete."},
                    response: false,
                    data: {}
                })
            }
        })
    }
}

export default ReviewController;