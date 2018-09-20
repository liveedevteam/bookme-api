import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import keys from './config/keys';

export function connectDB() {
    mongoose.Promise = global.Promise;
    mongoose.connect(keys.mongoURI);
}

export function sessionMongo(app) {

    const MongoStore = connectMongo(session);

    app.use(session({
        secret: 'Thisismytestkey',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
}

