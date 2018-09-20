const UserSerializer = {

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
        const { _id, email, status, imageURL, firstName, lastName, gender, birthday, tel, lineId, userRegister } = resouce
        return { _id, email, status, imageURL, firstName, lastName, gender, birthday, tel, lineId, userRegister }
    }

};

export default UserSerializer;