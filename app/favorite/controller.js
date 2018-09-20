import ProfileHistory from "../favorite/model";
import Professional from "../professional/model";
import Profile from "../profile/model";

import request from 'request';

const ProfileHistoryController = {

    getAll(req, res) {
        ProfileHistory.find({}, (err, response) => {
            console.log(response);
            if (err) {
                res.json({
                    err: {message: err},
                    response: false,
                    data: {}
                });
            }
            res.json({
                err: {message: ''},
                response: true,
                data: response
            });
        })
    },

    get(req, res) {
        ProfileHistory.findById(req.params.id, (err, response) => {
            console.log(response);
            res.json({
                err: {message: ''},
                response: true,
                data: response
            });
        })
    },

    getByUId(req, res) {
        let uId = req.params.id
        // console.log(uId)
        let favoriteArr = []
        ProfileHistory.findOne({uId: uId}, (err, favHistory) => {
            // console.log(response)
            if (err) res.json({err: {message: err}, response: false, data: {}})
            if(favHistory) {
                console.log(favHistory)
                if(favHistory.favId.length > 0) {
                    for(let i=0;i<favHistory.favId.length;i++) {
                        Professional.findById(favHistory.favId[i], (err, professional) => {
                            if(professional) {
                                Profile.findById(professional.uId, (err, profile) => {
                                    console.log("Checked")
                                    if (err) res.json({err: {message: err}, response: false, data: {}})
                                    if(profile) {
                                        let objF = {
                                            profile: {},
                                            Gallery: [],
                                            favCount: "",
                                            createDate: "",
                                            pId:""
                                        }
                                        objF.profile = profile
                                        objF.pId = professional._id
                                        objF.Gallery = professional.portfolio.Gallery
                                        objF.favCount = professional.favCount
                                        objF.createDate = profile.createDate

                                        favoriteArr.push(objF)
                                        if(i == (favHistory.favId.length -1)) {
                                            res.json({
                                                err: {message: ""},
                                                response: true,
                                                data: {
                                                    favorite: favoriteArr
                                                }
                                            })
                                        }
                                    } else {

                                    }
                                })
                            } else {
                                res.json({err: {message: "No Professional Response"}, response: false, data: {}})
                            }
                        })
                    }
                } else {
                    res.json({err: {message: "No Response"}, response: false, data: {}})
                }
            } else {
                res.json({err: {message: "No Favorite Profile"}, response: false, data: {}})
            }
        })
    },

    async getByCatId(req, res) {
        const cId = req.params.cId;
        const uId = req.params.uId;
        let professFavUser = []
        const favorites = await getAllFavorite()
        if (favorites.length > 0) {
            for (let i = 0; i < favorites.length; i++) {
                // console.log(favorites[i].uId)
                if (favorites[i].uId == uId) {
                    // console.log(favorites[i].favId)
                    if(favorites[i].favId.length > 0) {
                        for(let j=0; j<favorites[i].favId.length;j++) {
                            let professional = await getProfessionalsById(favorites[i].favId[j]);
                            let profile = await getProfile(professional.uId)
                            professional.profile = profile
                            console.log("Pro"+professional.categories.catId)
                            console.log("Cat"+cId)
                            if(professional.categories.catId == cId) {
                                let objProfess = {
                                    Gallery: [],
                                    favId: [],
                                    favCount: 0,
                                    createDate: "",
                                    profile: {},
                                    _id: "",
                                    uId: ""
                                }
                                objProfess.profile = professional.profile
                                objProfess.favId = professional.favId
                                objProfess.Gallery = professional.portfolio.Gallery
                                objProfess.favId = professional.favorite
                                objProfess.favCount = professional.favCount
                                objProfess.createDate = professional.createDate
                                objProfess._id = professional._id
                                objProfess.uId = professional.uId
                                professFavUser.push(objProfess)
                            }
                        }
                        res.json({
                            err: {message: ""},
                            response: true,
                            data: professFavUser
                        });
                    } else {
                        res.json({
                            err: {message: "No Favorite User"},
                            response: false,
                            data: {}
                        });
                    }
                }
            }
        } else {
            res.json({
                err: {message: "No Favorite"},
                response: false,
                data: {}
            });
        }

    },

    async addFav(req, res) {
        let uId = req.params.id;
        let pId = req.body.pId;
        let returnFav = {
            err: {message: ""},
            response: false,
            data: {}
        }

        const profile = await getProfile(uId)
        const professional = await getProfessional(pId)
        console.log("Pro")
        console.log(professional)
        const favoriteByUId = await getFavoriteByUId(uId);
        const checkFavId = await checkPIdFavoriteId(pId, favoriteByUId);

        if (profile) {
            console.log("Have Profile")
            if (professional) {
                console.log("Have Professional Id")
                if (favoriteByUId) {
                    console.log("Have Favorite In UserId")
                    if (checkFavId) {
                        favoriteByUId.favId.push(pId);
                        if (updateFav(favoriteByUId)) {
                            returnFav.data = favoriteByUId
                            returnFav.response = true
                            addProfessionalFav(professional)
                            res.send(returnFav)
                        } else {
                            returnFav.err.message = "Update favorite professional's id Failed"
                            res.send(returnFav)
                        }
                    } else {
                        returnFav.err.message = "You are favorite professional's id Now"
                        res.send(returnFav)
                    }
                } else {
                    console.log("Not Have Favorite In UserId")
                    let cbCreate = await createFav(uId, pId)
                    if (cbCreate) {
                        addProfessionalFav(professional)
                        returnFav.response = true;
                        returnFav.data = cbCreate
                        res.send(returnFav)
                    } else {
                        returnFav.err.message = "Not Create Favorite"
                    }
                }
            } else {
                returnFav.err.message = "No User Professional"
                res.send(returnFav)
            }
        } else {
            returnFav.err.message = "No User Profile"
            res.send(returnFav)
        }

    },

    async delFav(req, res) {
        let uId = req.params.id;
        let pId = req.body.pId;
        let returnFav = {
            err: {message: ""},
            response: false,
            data: {}
        }

        const profile = await getProfile(uId)
        const professional = await getProfessional(pId)
        console.log("Pro")
        console.log(professional)
        const favoriteByUId = await getFavoriteByUId(uId);
        const checkFavId = await checkPIdFavoriteId(pId, favoriteByUId);

        if (profile) {
            console.log("Have Profile")
            if (professional) {
                console.log("Have Professional Id")
                if (favoriteByUId) {
                    console.log("Have Favorite In UserId")
                    if (checkFavId) {
                        returnFav.err.message = "No Professional Id in Favorite History"
                        res.send(returnFav)
                    } else {
                        console.log("Delete")
                        let i = 0;
                        favoriteByUId.favId.forEach((favId) => {
                            if (favId == pId) {
                                const index = favoriteByUId.favId.indexOf(pId)
                                favoriteByUId.favId.splice(index, 1)
                                if (updateFav(favoriteByUId)) {
                                    if (deleteProfessionalFav(professional)) {
                                        returnFav.data = favoriteByUId;
                                        returnFav.response = true;
                                        res.send(returnFav)
                                    } else {
                                        returnFav.err.message = "Delete Count Failed"
                                        res.send(returnFav)
                                    }
                                } else {
                                    returnFav.err.message = "Delete Failed"
                                    res.send(returnFav)
                                }
                                console.log(favoriteByUId)
                            } else {
                                console.log("Not Fond Pid")
                            }
                        })
                    }
                } else {
                    returnFav.err.message = "No Favorite History"
                    res.send(returnFav)
                }
            } else {
                returnFav.err.message = "No User Professional"
                res.send(returnFav)
            }
        } else {
            returnFav.err.message = "No User Profile"
            res.send(returnFav)
        }
    }
};


function createFav(uId, pId) {
    return new Promise((resolve, reject) => {
        let newProfileHistory = new ProfileHistory({
            favId: [],
            uId: uId
        })
        newProfileHistory.favId.push(pId);
        newProfileHistory.save((err, ProfileHistory) => {
            if (err) resovle(false)
            if (ProfileHistory) {
                resolve(newProfileHistory)
            } else {
                resolve(false)
            }
        })
        console.log(newProfileHistory)
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

function getProfessionalsById(pId) {
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

function updateFav(favData) {
    console.log("Update")
    console.log(favData)
    return new Promise((resolve, reject) => {
        if (favData.favId.length == 0) {
            favData.favId = []
        }
        ProfileHistory.findByIdAndUpdate(favData._id, {
            favId: favData.favId,
            uId: favData.uId
        }, (err, response) => {
            if (response) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

function getAllFavorite() {
    return new Promise((resolve, reject) => {
        ProfileHistory.find({}, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

function checkPIdFavoriteId(pId, favoriteByUId) {
    return new Promise((resolve, reject) => {
        console.log("Check professional ID in Favorite History")
        console.log(favoriteByUId)
        if (favoriteByUId) {
            favoriteByUId.favId.forEach((favId) => {
                if (favId == pId) {
                    resolve(false)
                }
            })
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

function getFavoriteByUId(uId) {
    return new Promise((resolve, reject) => {
        if (uId) {
            ProfileHistory.findOne({uId: uId}, (err, response) => {
                if (err) resolve(false)
                resolve(response)
            })
        } else {
            resolve(false)
        }
    })
}

function getProfile(uId) {
    console.log("Check UserId Profile")
    return new Promise((resolve, reject) => {
        console.log("Find User")
        Profile.findById(uId, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}


function getProfessional(uId) {
    console.log("Check UserId Profile")
    return new Promise((resolve, reject) => {
        console.log("Find User")
        Professional.findById(uId, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

function findUserHistoryFav(uId) {
    console.log("Find Fav History")
    return new Promise((resolve, reject) => {
        ProfileHistory.findOne({uId: uId}, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                console.log("No User History");
                resolve(null)
            }
        })
    }).catch((err) => {
        reject(err)
    });
}

function addUserHistoryFav(uId, pId) {
    console.log("Add Fav History")
    return new Promise((resolve, reject) => {
        let favIdArray = []
        favIdArray.push(pId);
        let newProfileHistory = new ProfileHistory({
            uId: uId,
            favId: favIdArray
        });

        newProfileHistory.save((err, ProfileHistory) => {
            if (err) {
                reject(err)
            } else {
                resolve(ProfileHistory)
            }
        })
    })
}

function pushUserHistoryFav(uId, pId) {
    console.log("Push Fav History")
    return new Promise((resolve, reject) => {
        findUserHistoryFav(uId).then((result) => {
            if (result) {
                result.favId.push(pId);
                ProfileHistory.findByIdAndUpdate(result._id, result, (err, response) => {
                    if (err) resolve(false)

                    if (response) resolve(result);
                })

            } else {
                resolve(false)
            }
        })
    })
}

function deleteUserHistoryFav(profess, pId, uId) {
    console.log("Delete Fav History")
    return new Promise((resolve, reject) => {
        findUserHistoryFav(uId).then((result) => {
            if (result) {
                let historyFav = []
                let i = 0
                result.favId.forEach((element) => {
                    if (element == pId) {

                    } else {
                        historyFav[i] = element
                    }
                    i++
                });
                let newHistory = {}
                newHistory = {
                    favId: historyFav,
                    _id: result._id,
                    uId: result.uId,
                }
                ProfileHistory.findByIdAndUpdate(newHistory._id, newHistory, (err, response) => {
                    if (response) {
                        resolve(newHistory)
                    } else {
                        resolve(false)
                    }
                })
            } else {
                resolve(false)
            }
        })
        deleteProfessionalFav(profess).then((result) => {
            if (result) {
                resolve(result);
            } else {
                resolve(false)
            }
        })
    })
}

function findProfessional(pId) {
    return new Promise((resolve, reject) => {
        request('http://bookme.bluweo.com:3023/api/professional/' + pId,
            (err, response, body) => {
                console.log("Find Professional Profile")
                if (err) console.log(err)
                if (body) {
                    let profess = {}
                    profess = JSON.parse(body)
                    resolve(profess.data);
                } else {
                    resolve(false);
                }
            })
    })
}

function checkFavorite(favId, pId) {
    console.log("Check Favorite Professional Id")
    return new Promise((resolve, reject) => {
        favId.forEach((element) => {
            if (element == pId) {
                resolve(true)
            }
        })
        resolve(false)
    })
}

function addProfessionalFav(profess) {
    console.log("Add Profess +1")
    return new Promise((resolve, reject) => {
        profess.favCount = profess.favCount + 1;
        console.log(profess.favCount)
        Professional.findByIdAndUpdate(profess._id, profess, (err, response) => {
            if (err) reject(err)
            resolve(true)
        })
    });
}

function deleteProfessionalFav(profess) {
    console.log("Delete Profess favCount -1")
    return new Promise((resolve, reject) => {
        if (profess.favCount > 0) {
            profess.favCount = profess.favCount - 1;
            console.log(profess.favCount)
            Professional.findByIdAndUpdate(profess._id, profess, (err, response) => {
                if (err) reject(err)
                resolve(true)
            })
        } else {
            resolve(false)
        }
    });
}


export default ProfileHistoryController;