import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import engine from 'ejs-mate';
import FCM from 'fcm-node';

import { connectDB, sessionMongo } from "./connect";
import keys from "./config/keys";

var serverKey = keys.firebaseServerKey;
var fcm = new FCM(serverKey);

function setupRouter(app) {
    const APP_DIR = `${__dirname}/app`;
    const features = fs.readdirSync(APP_DIR).filter(
        file => fs.statSync(`${APP_DIR}/${file}`).isDirectory()
    );

    features.forEach(feature => {
        const router = express.Router();
        const routes = require(`${APP_DIR}/${feature}/routes.js`);

        routes.setup(router);
        app.use(`/api/${feature}`, router);
    })

    app.get('/noti-test', (req, res) => {
        console.log("Test");
        const token = 'eT9lcA6o7HQ:APA91bHdlJhhcdn6nB_vitSRkGuorcrMHmtN_EEJY1D103yrTjWI2EDSw_AcKOEI2OAF-nJLcznHjJgG5QU2PLqoBWfQlR8U9vL48DOCVwh6kdzU0vsZJGqjOcIOs7f5b1MoRbxMhPblj2MX2-hjxImX1_BaVbv1GQ';
        const msg = 'Hello';
        const key = '';
        const send = sendNotification(token, key, msg)
        if(send) {
            res.send("True")
        } else {
            res.send("False")
        }

    })
}

export function setup() {

    const app = express();
    const PORT = 3023;

    connectDB();

    app.use(express.static('public'));
    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());

    sessionMongo(app);
    setupRouter(app);

    app.listen(PORT, () => {
        console.log(process.env.NODE_ENV)
        console.log('App listend on PORT:'+ PORT);
    });


}

function sendNotification(receivpient, key, msg) {
    return new Promise((resolve, reject) => {
        const message = {
            to: receivpient,
            collapse_key: "",

            notification: {
                title: 'Bookme',
                body: msg,
                sound: 'default',
                badge : 1,
                priority:'hight'
                // click_action : "OPEN_WORK_VIEW"
            },

            data: {
                my_key: key,
                my_another_key: 'my another value'
            }
        };

        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
                resolve(false)
            } else {
                console.log("Successfully sent with response: ", response);
                resolve(true)
            }
        });
    });
}