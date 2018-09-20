import Professional from './model';
import request from 'request';
import Profile from "../profile/model";
import fetch from 'node-fetch';

const ProfessionalController = {
    getAll(req, res) {
        Professional.find({}, (err, response) => {

            let i = 0;
            let obj = {};
            let objInArr = [];

            console.log(response.length);

            if(response.length === 0) {
                response.forEach(function (element) {
                    // console.log(element)
                    fetch('http://bookme.bluweo.com:3023/api/profile/'+element.uId)
                        .then(res => res.json())
                        .then(({data}) => {
                            console.log(i);
                            console.log(response[i] + " // "+ data);

                            // obj = {
                            //     information: data,
                            //     portfolio: response[i].portfolio,
                            //     projects: response[i].projects,
                            //     packages: response[i].packages,
                            //     createDate: response[i].createDate,
                            //     _id: response[i]._id,
                            //     uId: response[i].uId,
                            //     __v: 0
                            // };
                            //
                            // objInArr[i] = obj;
                            //
                            // if(i+1 === response.length) {
                            //     res.json({
                            //         err: err,
                            //         response: true,
                            //         data: objInArr
                            //     })
                            // }
                            i = i+1;
                        })
                });
            } else {
                res.json({
                    err: "No data.",
                    response: false,
                    data: []
                })
            }

        });
    },

    get(req, res) {
        Professional.findById(req.params.id, (err, response) => {
            console.log(typeof response);
            const professionalData = response;
            console.log(professionalData.uId);
            request({
                url: 'http://bookme.bluweo.com:3023/api/profile/'+response.uId,
                json: true
            }, function (error, resstatus, body) {

                if (!error && resstatus.statusCode === 200) {
                    console.log(typeof body) // Print the json response
                    // response.title = body;
                    response.information = body.data;
                    res.json({
                        err: err,
                        response: true,
                        data: response
                    })
                }

            });
        })
    },

    create(req, res) {

        console.log(req.body.portfolio);

        const newProfessional = new Professional({
            uId: req.body.uId,
            portfolio: req.body.portfolio,
            projects: req.body.projects,
            packages: req.body.packages
        });

        console.log(newProfessional);

        newProfessional.save((err, professional) => {
            if (err) {
                res.json({
                    err: err,
                    response: false,
                    data: ""
                });
                console.log(err);
            } else {
                res.json({
                    err: err,
                    response: true,
                    data: professional
                });
            }
        });
    },

    update(req, res) {
        const updateProfessional = req.body;
        console.log(updateProfessional);

        Professional.findByIdAndUpdate(req.params.id, updateProfessional, (err, response) => {
            console.log(err);
            if(err) {
                res.json({
                    err: err,
                    response: false,
                    data: ""
                });
            }

            res.json({
                err: err,
                response: true,
                data: response
            });

        })
    },

    delete(req, res) {

        Profile.findByIdAndRemove(req.params.id, (err, response) => {
            console.log(err);
            if(err) {
                res.json({
                    err: err,
                    response: false,
                    data: ""
                });
            }

            res.json({
                err: err,
                response: true,
                data: "Delete Professional Profile Complete"
            });

        })
    }
};


export default ProfessionalController;