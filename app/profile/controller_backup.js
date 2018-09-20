import Profile from "./model";

create(req, res) {
    Profile.find({fId: req.body.fId}, (err, response) => {
        let title = req.body.title;
        let firstName = req.body.firstName;
        let lastnNme = req.body.lastName;
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
        console.log(response);
        if(response) {
            console.log(response)
            res.json({
                err: "",
                response: true,
                data: response,
            })
        } else {

            const newProfile = new Profile({
                fId: fId,
                title: title,
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

            newProfile.save((err, Profile) => {
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
                        data: Profile
                    });
                }
            });
        }
    });
}