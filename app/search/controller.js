import Profile from '../profile/model';
import Professional from '../professional/model'
import Favorite from '../favorite/model'
import Home from '../home/model'

const SearchController = {
    async getAll(req, res) {
        // const profiles = await getAllProfile();
        const professionals = await getAllProfessional();
        // const favorites = await getAllFav();
        const home = await getAllHome();

        let search = {
            name: "",
            categories: "",
            subCat: []
        }

        let searchArr = []


    }
};

async function getAllHome(pId) {
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

async function getAllFav(pId) {
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

async function getAllProfile() {
    return new Promise((resolve, reject) => {
        Profile.find({}, (err, response) => {
            console.log("Get All Profile Fn")
            if (err) resolve(false)
            if(response) {
                resolve(response)
            } else {
                resolve(false)
            }
        });
    });
}

export default SearchController;