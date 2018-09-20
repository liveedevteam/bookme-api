const ProfileSerializer = {

    for(method, resouce) {
        return this[method](resouce)
    },

    getAll(resouce) {
        return resouce.map(user => this.serialize(user));
    },

    get(resouce) {
        return this.serialize(resouce);
    },

    serialize(resouce) {
        const { _id, email, title, firstName, lastName, birthday, profilephoto, backgroundphoto, gender, mobile } = resouce
        return { _id, email, title, firstName, lastName, birthday, profilephoto, backgroundphoto, gender, mobile }
    }

};

export default ProfileSerializer;