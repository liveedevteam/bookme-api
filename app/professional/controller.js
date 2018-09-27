import  Professional from './model';
import Profile from '../profile/model'
import Home from '../home/model';
import fetch from 'node-fetch';

function comp(a, b) {
    return new Date(b.createDate) - new Date(a.createDate);
}


const ProfessionalController = {
    async getAll(req, res) {

        let professReturn = {
            err: {message: ""},
            response: false,
            data: []
        }
        const professionals = await getAllProfessionals();

        if (professionals.length > 0) {

            const profiles = await getAllProfiles();

            if (profiles.length > 0) {
                let i = 0;
                professionals.forEach((professional) => {
                    let j = 0;
                    profiles.forEach((profile) => {
                        if (professional.uId == profile._id) {
                            professionals[i].profile = profile
                        } else {
                            professionals[i].profile = []
                        }
                    })
                    i++;
                })
                professReturn.data = professionals
                professReturn.response = true
                res.send(professReturn)
            } else {
                professReturn.err.message = "No Profiles Data";
                res.send(professReturn)
            }
        } else {
            professReturn.err.message = "No Professionals Data";
            res.send(professReturn)
        }
    },

    async get(req, res) {
        const pId = req.params.id
        console.log(pId);
        if (pId) {
            Professional.findById(pId, (err, response) => {
                let professional = response;
                console.log(professional)
                Profile.findById(professional.uId, (err, response) => {
                    let profile = response;
                    if (profiles.length > 0) {
                        professional.profile = profile
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: professional
                        });
                    } else {
                        professional.profile = []
                        res.json({
                            err: {message: "No Profile Data"},
                            response: true,
                            data: professional
                        });
                    }

                })

            })
        } else {
            res.json({
                err: {message: "No Professional Id"},
                response: false,
                data: null
            });
        }
    },

    create(req, res) {

        console.log(req.body.portfolio);

        const newProfessional = new Professional({
            uId: req.body.uId,
            portfolio: req.body.portfolio,
            projects: req.body.projects,
            packages: req.body.packages,
            categories: req.body.categories
        });

        console.log(newProfessional);

        newProfessional.save((err, professional) => {
            if (err) {
                res.json({
                    err: {message: err},
                    response: false,
                    data: null
                });
                console.log(err);
            } else {
                res.json({
                    err: {message: ''},
                    response: true,
                    data: newProfessional
                });
            }
        });
    },

    update(req, res) {
        const professId = req.params.id
        console.log(professId)

        Professional.findByIdAndUpdate(professId, req.body, (err, response) => {
                // console.log(err);
                if (err) {
                    res.json({
                        err: {message: err},
                        response: false,
                        data: null
                    });
                }
                if(response) {
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: {message: "Update Success"}
                    });
                }
            })
        // console.log(typeof professId)
        // Professional.findByIdAndUpdate(professId, {recommend: false,}, (err, response) => {
        //         console.log(err)
        //         console.log(response);
        //     });
    },

    delete(req, res) {
        Professional.findByIdAndRemove(req.params.id, (err, response) => {
            console.log(err);
            if (err) {
                res.json({
                    err: {message: err},
                    response: false,
                    data: null
                });
            }

            res.json({
                err: {message: null},
                response: true,
                data: "Delete Professional Profile Complete"
            });

        })
    },

    async getByCatId(req, res) {
        const cId = req.params.cId;
        if (cId) {
            const professionals = await getAllProfessionals();
            let professionalArray = []
            if (professionals) {
                for (let i = 0; i < professionals.length; i++) {
                    if (professionals[i].categories.catId == cId) {
                        let profile = await getProfileById(professionals[i].uId)
                        professionals[i].profile = profile[0]
                        professionalArray.push(professionals[i])
                    }
                }

                res.json({
                    err: {message: ""},
                    response: true,
                    data: professionalArray
                });
            } else {
                res.json({
                    err: {message: "No Professional Profiles"},
                    response: false,
                    data: null
                });
            }
        } else {
            res.json({
                err: {message: "No Categories or Professional ID"},
                response: false,
                data: null
            });
        }
    },

    async updateRecommend(req, res) {
        const pId = req.params.id;

        if (pId) {
            const professional = await getProfessionalById(pId);
            if (professional) {
                professional.recommend = true
                Professional.findByIdAndUpdate(pId, professional, (err, response) => {
                    if (err) {
                        res.json({
                            err: {message: err},
                            response: false,
                            data: null
                        });
                    } else {
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: professional
                        });
                    }
                })
            } else {
                res.json({
                    err: {message: "Can not find Professional Id"},
                    response: false,
                    data: null
                });
            }
        } else {
            res.json({
                err: {message: "No Professional ID"},
                response: false,
                data: null
            });
        }
    },

    async unUpdateRecommend(req, res) {
        const pId = req.params.id;

        if (pId) {
            const professional = await getProfessionalById(pId);
            if (professional) {
                professional.recommend = false
                Professional.findByIdAndUpdate(pId, professional, (err, response) => {
                    if (err) {
                        res.json({
                            err: {message: err},
                            response: false,
                            data: null
                        });
                    } else {
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: professional
                        });
                    }
                })
            } else {
                res.json({
                    err: {message: "Can not find Professional Id"},
                    response: false,
                    data: null
                });
            }
        } else {
            res.json({
                err: {message: "No Professional ID"},
                response: false,
                data: null
            });
        }
    },

    async getByFilter(req, res) {
        const filter = req.body.filter;
        console.log(filter)

        if ((filter == 0) || (filter == 1) || (filter == 2) || (filter == 3)) {
            console.log("Go to Filter")
            let professionals = await getAllProfessionals();
            for (let i = 0; i < professionals.length; i++) {
                let profile = await getProfileById(professionals[i].uId)
                professionals[i].profile = profile[0]
                console.log(profile)
            }
            if (professionals.length) {
                if (filter == 0) {
                    professionals = professionals.sort((a, b) => {
                        return new Date(b.createDate) - new Date(a.createDate)
                    })
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: professionals
                    });
                }

                if (filter == 1) {
                    professionals = professionals.sort((a, b) => {
                        return (b.favCount) - (a.favCount)
                    })
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: professionals
                    });
                }

                if (filter == 2) {
                    professionals = professionals.sort((a, b) => {
                        return (b.recommend) - (a.recommend)
                    })
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: professionals
                    });
                }

                if (filter == 3) {
                    professionals = professionals.sort((a, b) => {
                        return (b.review) - (a.review)
                    })
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: professionals
                    });
                }
            } else {
                res.json({
                    err: {message: "No Professional Profiles"},
                    response: false,
                    data: null
                });
            }
        } else {
            res.json({
                err: {message: "No Filter ID"},
                response: false,
                data: null
            });
        }
    },

    async smartSearch(req, res) {
        let keyword = req.body.keyword;
        if (keyword) {
            let objSearch = {}
            objSearch = {
                searchKey: [],
                searchValue: []
            }
            keyword = keyword.toLowerCase()
            fetch('http://bookme.bluweo.com:3023/api/professional')
                .then(res => res.json())
                .then(({data}) => {
                    for (let i = 0; data.length > i; i++) {
                        if (data[i].profile.firstName.toLowerCase().search(keyword) > -1) {
                            objSearch.searchKey.push(data[i].profile.firstName)
                            objSearch.searchValue.push(data[i])
                        }
                    }
                    fetch('http://bookme.bluweo.com:3023/api/home')
                        .then(res => res.json())
                        .then(({data}) => {
                            data.forEach((cat) => {
                                if (cat.catName.toLowerCase() == keyword) {
                                    fetch('http://bookme.bluweo.com:3023/api/professional/categories/' + cat._id)
                                        .then(res => res.json())
                                        .then(({data}) => {
                                            let i = 0;
                                            data.forEach((subData) => {
                                                objSearch.searchKey.push(cat.catName)
                                                objSearch.searchValue.push(subData)
                                                console.log(objSearch)
                                                console.log(i);
                                                if (i == (data.length - 1)) {
                                                    res.json({
                                                        err: {message: ""},
                                                        response: true,
                                                        data: objSearch
                                                    })
                                                }
                                                i++
                                            })
                                        })
                                        .catch((err) => {
                                            res.json({
                                                err: {message: ""},
                                                response: true,
                                                data: objSearch
                                            })
                                        })
                                } else {
                                    res.json({
                                        err: {message: ""},
                                        response: true,
                                        data: objSearch
                                    })
                                }
                            })
                        }).catch((err) => {
                            console.log("Hello")
                            res.json({
                                err: {message: "No Data"},
                                response: false,
                                data: {}
                            })
                        }
                    )
                })
                .catch((err) => {
                        res.json({
                            err: {message: "No Data"},
                            response: false,
                            data: {}
                        })
                    }
                )
        } else {
            res.json({
                err: {message: "No Keyword Data"},
                response: false,
                data: null
            });
        }
    },

    async dateSearch(req, res) {

    }

};

function getAllProfiles() {
    return new Promise((resolve, reject) => {
        Profile.find({}, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve("No Data")
            }
        })
    })
}

function getProfileById(uId) {
    return new Promise((resolve, reject) => {
        Profile.find({_id: uId}, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve("No Data")
            }
        })
    })
}

function getAllProfessionals() {
    return new Promise((resolve, reject) => {
        Professional.find({}, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve("No Data")
            }
        })
    })
}

function getProfessionalById(pId) {
    return new Promise((resolve, reject) => {
        Professional.findById(pId, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve("No Data")
            }
        })
    })
}

function getAllHome() {
    return new Promise((resolve, reject) => {
        Home.find({}, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

function searchKeyWord(keyword) {
    return new Promise((resolve, reject) => {
    })
}

export default ProfessionalController;