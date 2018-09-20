import Profile from './model';
import Professional from '../professional/model'
import Favorite from '../favorite/model'

const ProfileController = {
    async getAll(req, res) {
        let profiles = await getAllProfile();
        let favorites = await getAllFav()

        if (profiles.length > 0) {
            if (favorites.length > 0) {
                for (let i = 0; profiles.length > i; i++) {
                    for (let j = 0; favorites.length > j; j++) {
                        if (favorites[j].uId == profiles[i]._id) {
                            for (var key in favorites[j].favId) {
                                if (favorites[j].favId.hasOwnProperty(key)) {
                                    let professional = await getProfessionalById(favorites[j].favId[key])
                                    if (professional) {
                                        profiles[i].favorite.push(professional)
                                    }
                                }
                            }
                        }
                    }
                }
                res.json({
                    err: {message: ""},
                    response: true,
                    data: profiles
                })
            } else {
                res.json({
                    err: {message: "No Favorite Data"},
                    response: false,
                    data: profiles
                })
            }
        } else {
            res.json({
                err: {message: "No Profile"},
                response: false,
                data: {}
            })
        }
    },

    async get(req, res) {
        let uId = req.params.id;
        console.log(uId)
        const profile = await getProfileById(uId);
        const favorites = await getAllFav();
        const professionals = await  getAllProfessional();
        let favPId = []
        let resReturn = {
            err: {message: ""},
            response: false,
            data: {}
        }

        for (let i = 0; i < favorites.length; i++) {
            console.log(favorites[i])
            if (favorites[i].uId == profile._id) {
                for (let j = 0; j < favorites[i].favId.length; j++) {
                    favPId.push(favorites[i].favId[j])
                }
            }
        }

        for (let i = 0; i < favPId.length; i++) {
            let professional = await getProfessionalById(favPId[i]);
            let profileFromProfess = await getProfileById(professional.uId);
            professional.profile = profileFromProfess;
            console.log(professional)
            profile.favorite.push(professional);
        }

        res.json({
            err: {message: ""},
            response: true,
            data: profile
        })
    },

    create(req, res) {
        Profile.findOne({fId: req.body.fId}, (err, profile) => {
            let title = req.body.title;
            let somethingAboutYou = req.body.somethingAboutYou;
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let birthDate = req.body.birthDate;
            let profilePhoto = req.body.profilePhoto;
            let backgroundPhoto = req.body.backgroundPhoto;
            let address = req.body.address;
            let city = req.body.city;
            let country = req.body.country;
            let mobile = req.body.mobile;
            let email = req.body.email;
            let idCard = req.body.idCard;
            let favorite = req.body.favorite;
            let fId = req.body.fId;
            if (profile) {
                console.log(profile);
                res.json({
                    err: "Profile is already Exist.",
                    response: false,
                    data: profile
                })
            } else {
                console.log("profile is not create.");
                const newProfile = new Profile({
                    fId: fId,
                    title: title,
                    somethingAboutYou: somethingAboutYou,
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    profilePhoto: profilePhoto,
                    backgroundPhoto: backgroundPhoto,
                    address: address,
                    city: city,
                    country: country,
                    mobile: mobile,
                    email: email,
                    idCard: idCard,
                    favorite: favorite
                });
                console.log(newProfile);
                newProfile.save((err, saveProfile) => {
                    if (err) {
                        res.json({
                            err: err,
                            response: false,
                            data: null
                        });
                        console.log(err);
                    } else {
                        res.json({
                            err: "",
                            response: true,
                            data: saveProfile
                        });
                    }
                });
            }
        })
    },

    update(req, res) {
        const updateProfile = req.body;
        console.log(updateProfile);

        Profile.findByIdAndUpdate(req.params.id, updateProfile, (err, response) => {
            console.log(err);
            console.log(response);
            if (err) {
                res.json({
                    err: err,
                    response: false,
                    data: null
                });
            }

            res.json({
                err: {message: ""},
                response: true,
                data: response
            });

        })
    },

    delete(req, res) {
        const updateProfile = req.body;
        console.log(updateProfile);

        Profile.findByIdAndRemove(req.params.id, (err, response) => {
            console.log(err);
            if (err) {
                res.json({
                    err: {message: err},
                    response: false,
                    data: null
                });
            }

            res.json({
                err: {message: ""},
                response: true,
                data: "Delete Profile Complete"
            });

        })
    },

    async getPro(req, res) {
        let uId = req.params.id

        const professionals = await getProfessionalByUId(uId)
        if (professionals) {
            res.json({
                err: {
                    message: ""
                },
                response: true,
                data: professionals
            })
        } else {
            res.json({
                err: {
                    message: "No Data"
                },
                response: false,
                data: {}
            })
        }
    },

    updateImage(req, res) {
        const profileImage = req.body.profilePhoto;

        if (profileImage) {
            Profile.findByIdAndUpdate(req.params.id, {profilePhoto: profileImage}, (err, response) => {
                if (err) {
                    res.json({
                        err: {
                            message: err
                        },
                        response: false,
                        data: ''
                    })
                }

                if (response) {
                    res.json({
                        err: {
                            message: err
                        },
                        response: true,
                        data: response
                    })
                }
            })
        } else {
            res.json({
                err: {message: "No Image Profile URL"},
                response: false,
                data: null
            })
        }
    },

    addFav(req, res, next) {
        Profile.findById(req.params.id, (err, response) => {
            if (err) {
                res.json({
                    err: {'message': err},
                    response: false,
                    data: ''
                });
            }
            if (response) {
                let pIdFav = req.body.pId;
                let uId = req.params.id;
                let count = 0;
                response.favorite.forEach(function (element) {
                    console.log("forEach")
                    if (element.pId == pIdFav) {
                        count++;
                    }
                });
                if (count > 0) {
                    res.json({
                        err: {'message': "This Profile has already Professional ID"},
                        response: false,
                        data: ''
                    });
                } else {
                    fetch('http://localhost:3023/api/professional/' + pIdFav)
                        .then(res => res.json())
                        .then(({data}) => {
                            let favData = {
                                pId: pIdFav,
                                profile: data.profile,
                                Gallery: data.portfolio.Gallery
                            };
                            // console.log(response.favorite[0])
                            if (response.favorite[0] == 'favorite') {
                                response.favorite[0] = favData;
                                fetch('http://localhost:3023/api/profile/' + uId, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(response)
                                }).then(res => res.json())
                                    .catch(error => console.log('Error:' + error))
                                    .then(res => console.log(res));
                                res.json({
                                    err: {message: null},
                                    response: true,
                                    data: response
                                });
                            } else {
                                response.favorite.push(favData);
                                // console.log(response);
                                fetch('http://localhost:3023/api/profile/' + uId, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(response)
                                }).then(res => res.json())
                                    .catch(error => next())
                                    .then(resPro => {
                                        console.log(resPro);
                                        res.json({
                                            err: {message: null},
                                            response: true,
                                            data: response
                                        });
                                        next();
                                    });
                            }
                        })
                }
            }
        })
    },
    delFav(req, res) {
        Profile.findById(req.params.id, (err, response) => {
            if (err) {
                res.json({
                    err: {'message': err},
                    response: false,
                    data: ''
                })
            }
            if (response) {
                let pIdFav = req.body.pId;
                let uId = req.params.id;
                let i = 0;
                response.favorite.forEach(function (element) {
                    if (element.pId == pIdFav) {
                        response.favorite.splice(i, 1);
                        i++
                    }
                });
                console.log(i);
                if (i > 0) {
                    console.log(response);
                    fetch('http://localhost:3023/api/profile/' + uId, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(response)
                    }).then(res => res.json())
                        .catch(error => console.log('Error:' + error))
                        .then(res => console.log(res));
                    res.json({
                        err: {message: null},
                        response: true,
                        data: response
                    });
                } else {
                    res.json({
                        err: {'message': "No Professional's User"},
                        response: false,
                        data: null
                    })
                }
            }
        })
    },
    countFav(req, res) {
        Profile.find({}, (err, response) => {
            if (err) {
                res.json({
                    err: err,
                    response: false,
                    data: ''
                })
            }
            if (response) {
                let i = 0;
                response.forEach(function (element) {
                    element.favorite.forEach(function (favElement) {
                        if (favElement.pId == req.params.id) {
                            i++;
                        }
                    })
                });
                res.json({
                    err: null,
                    response: true,
                    data: i
                })
            }
        })
    },

    async updateBank(req, res) {
        const uId = req.params.id;
        const profile = await getProfileById(uId);
        const bankAccountName = req.body.bankAccountName;
        const bankAccountNumber = req.body.bankAccountNumber;
        const bankName = req.body.bankName;
        const bankBookImage = req.body.bankBookImage;
        console.log(bankAccountName + '||' + bankAccountNumber + "||" + bankName + "||" + bankBookImage)

        let docs = {
            documents: {
                bankAccount: {
                    bankAccountName: "",
                    bankAccountNumber: "",
                    bankName: "",
                    bankBookImage: "",
                    verified: false
                },
                idcard: {
                    idCardNumber: "",
                    idCardImage: "",
                    verified: false
                }
            }
        }

        if (profile.documents.idCardNumber && profile.documents.idCardImage) {
            docs = {
                bankAccount: {
                    bankAccountName: bankAccountName,
                    bankAccountNumber: bankAccountNumber,
                    bankName: bankName,
                    bankBookImage: bankBookImage,
                    verified: false
                },
                idCard: {
                    idCardNumber: profile.documents.idCardNumber,
                    idCardImage: profile.documents.idCardImage,
                    verified: false
                }
            }
        } else {
            docs = {
                bankAccount: {
                    bankAccountName: bankAccountName,
                    bankAccountNumber: bankAccountNumber,
                    bankName: bankName,
                    bankBookImage: bankBookImage,
                    verified: false
                },
                idCard: {
                    idCardNumber: "",
                    idCardImage: "",
                    verified: false
                }
            }
        }


        if (uId) {
            if (bankAccountName && bankAccountNumber && bankBookImage && bankName) {

                profile.documents = docs;
                console.log(profile)
                Profile.findByIdAndUpdate(uId, profile, (err, response) => {
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: profile
                    })
                })

            } else {
                res.json({
                    err: {message: "No Data"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No User Id"},
                response: false,
                data: {}
            })
        }
    },

    async updateIdCard(req, res) {
        const uId = req.params.id;
        console.log(uId)
        const profile = await getProfileById(uId);
        const idCardNumber = req.body.idCardNumber;
        const idCardImage = req.body.idCardImage;
        console.log(idCardNumber + "||" + idCardImage)

        let docs = {
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
        }

        console.log(typeof profile.documents.bankAccount.bankAccountName)

        if (profile.documents.bankAccount.bankAccountName && profile.documents.bankAccount.bankAccountNumber && profile.documents.bankAccount.bankName && profile.documents.bankAccount.bankBookImage) {
            console.log("Doc1")
            docs = {
                bankAccount: {
                    bankAccountName: profile.documents.bankAccountName,
                    bankAccountNumber: profile.documents.bankAccountNumber,
                    bankName: profile.documents.bankName,
                    bankBookImage: profile.documents.bankBookImage,
                    verified: false
                },
                idCard: {
                    idCardNumber: idCardNumber,
                    idCardImage: idCardImage,
                    verified: false
                }
            }
        } else {
            console.log("Doc2")
            docs = {
                bankAccount: {
                    bankAccountName: "",
                    bankAccountNumber: "",
                    bankName: "",
                    bankBookImage: "",
                    verified: false
                },
                idCard: {
                    idCardNumber: idCardNumber,
                    idCardImage: idCardImage,
                    verified: false
                }
            }
        }

        if (uId) {
            if (idCardNumber && idCardImage) {
                profile.documents.idCard = docs.idCard
                console.log(profile)
                Profile.findByIdAndUpdate(uId, profile, (err, response) => {
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: profile
                    })
                })

            } else {
                res.json({
                    err: {message: "No Data"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No User Id"},
                response: false,
                data: {}
            })
        }
    },

    async verifyBank(req, res) {
        const uId = req.params.id;
        const profile = getProfileById(uId)

        let docs = {
            documents: {
                bankAccount: {
                    bankAccountName: "",
                    bankAccountNumber: "",
                    bankName: "",
                    bankBookImage: "",
                    verified: false
                },
                idcard: {
                    idCardNumber: "",
                    idCardImage: "",
                    verified: false
                }
            }
        }

        if (profile) {
            if (uId) {
                profile.verify = true;
                Profile.findByIdAndUpdate(uId, profile, (err, response) => {
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: profile
                    })
                })

            } else {
                res.json({
                    err: {message: "No Data"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No Data"},
                response: false,
                data: {}
            })
        }
    },
    async verifyIdCard(req, res) {
        const uId = req.params.id;
        const profile = getProfileById(uId)

        let docs = {
            documents: {
                bankAccount: {
                    bankAccountName: "",
                    bankAccountNumber: "",
                    bankName: "",
                    bankBookImage: "",
                    verified: false
                },
                idcard: {
                    idCardNumber: "",
                    idCardImage: "",
                    verified: false
                }
            }
        }

        if (profile) {
            if (uId) {
                profile.verify = true;
                console.log(profile)
                Profile.findByIdAndUpdate(uId, profile, (err, response) => {
                    res.json({
                        err: {message: ""},
                        response: true,
                        data: profile
                    })
                })

            } else {
                res.json({
                    err: {message: "No Data"},
                    response: false,
                    data: {}
                })
            }
        } else {
            res.json({
                err: {message: "No Data"},
                response: false,
                data: {}
            })
        }

    },

    async updateToken(req, res) {
        let profileId = req.params.id;
        let tokenFirebase = req.body.tokenFirebase
        // console.log(profileId)
        // console.log(tokenFirebase)
        let profile = await getProfileById(profileId);
        if (profile) {
            profile.tokenFirebase = tokenFirebase;
            // console.log(profile)
            Profile.findByIdAndUpdate(profileId, profile, (err, response) => {
                console.log(err)
                if (err) {
                    res.json({err: {message: err}, response: false, data: {}})
                }
                res.json({
                    err: {message: ""},
                    response: true,
                    data: profile
                })
            })
        } else {
            res.json({
                err: {message: "Profile ID is not match!"},
                response: false,
                data: {}
            })
        }

    },

    async logOut(req, res) {
        let uId = req.body.uId
        console.log("Log Out");
        Profile.findByIdAndUpdate(uId,{tokenFirebase: ""}, {new: true}, (err, profile) => {
            if (err) {
                res.json({err: {message: err, response: false, data: {}}})
            }
            if(profile) {
                res.json({
                    err: { message: ""},
                    response: true,
                    data: "Logout Success"
                })
            } else {
                res.json({
                    err: { message: ""},
                    response: false,
                    data: "Logout Failed"
                })
            }
        })
    }
};

async function getAllFav() {
    console.log("Get All Favorites")
    return new Promise((resolve, reject) => {
        Favorite.find({}, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

async function getAllProfessional() {
    console.log("Get All Professionals")
    return new Promise((resolve, reject) => {
        Professional.find({}, (err, response) => {
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}

async function getProfessionalById(pId) {
    console.log("Get Professional by Id")
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

async function getProfessionalByUId(profileId) {
    return new Promise((resolve, reject) => {
        Professional.find({uId: profileId}, (err, response) => {
            console.log("Get Profess By Profile Id")
            if (err) resolve(false)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    })
}


async function getProfileById(uId) {
    console.log("Get Profile By Id")
    return new Promise((resolve, reject) => {
        Profile.findById(uId, (err, result) => {
            if (err) resolve(false)
            if (result) {
                resolve(result);
            } else {
                resolve(false);
            }
        })
    });
}

async function getAllProfile() {
    console.log("Get All Profile")
    return new Promise((resolve, reject) => {
        Profile.find({}, (err, response) => {
            if (err) resolve(false)

            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        });
    });
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

export default ProfileController;