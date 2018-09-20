import Home from './model';
import Professional from "../professional/model";

const HomeController = {
    async getAll(req, res) {
        let homes = await getAllHomes();
        let professionals = await getAllProfessionals()
        if(homes.length > 0) {
            for(let i = 0;i < homes.length; i++) {
                if(professionals.length > 0) {
                    let count = 0;
                    for(let j = 0; j< professionals.length; j++) {
                        if(homes[i]._id == professionals[j].categories.catId) {
                            // console.log(homes[i].catName)
                            // console.log(professionals[j]._id)
                            // console.log("..................")
                            count++;
                        }
                    }
                    homes[i].catProfessCount = count
                    if((i+1) == homes.length) {
                        res.json({
                            err: { message: ""},
                            response: true,
                            data: homes
                        })
                    }
                } else {
                    res.json({
                        err: { message: ""},
                        response: true,
                        data: homes
                    })
                }
            }
        } else {
            res.json({
                err: { message: "No Home Data"},
                response: false,
                data: {}
            })
        }
    },

    get(req, res) {
        Home.findById(req.params.id, (err, response) => {
            console.log(response);
            res.json({
                err: err,
                response: true,
                data: response
            });
        })
    },

    create(req, res) {

        console.log(req.body);

        const newHome = new Home(req.body);

        console.log(newHome);

        newHome.save((err, home) => {
            if(err) {
                res.json({
                    err: err,
                    response: false,
                    date: ""
                });
            } else {
                res.json({
                    err: "",
                    response: true,
                    date: home
                }) ;
            }
        });
    },

    update(req, res) {
        const updateHome = req.body;

        Home.findByIdAndUpdate(req.params.id, updateHome, {new: true}, (err, response) => {
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
                data: updateHome
            });

        })
    },

    delete(req, res) {

        Home.findByIdAndRemove(req.params.id, (err, response) => {
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
                data: "Delete Home Complete"
            });

        })
    }
};

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

function getAllHomes() {
    return new Promise((resolve, reject) => {
        Home.find({}, (err, response) => {
            if (response) {
                resolve(response)
            } else {
                resolve("No Data")
            }
        })
    })
}

export default HomeController;