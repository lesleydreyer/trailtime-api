require('dotenv').config();

const mongoose = require('mongoose');

const express = require('express');
// Middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const { CLIENT_ORIGIN, PORT, DATABASE_URL, TEST_DATABASE_URL } = require('./config');
const HTTP_CODES = require('./app/httpStatusCodes').HTTP_STATUS_CODES;

const { userRouter } = require('./app/user/index');
const { trailRouter } = require('./app/trails/index');
const { authRouter, localStrategy, jwtStrategy } = require('./app/auth');

console.log('DATABASE_URL', DATABASE_URL);

mongoose.set('useCreateIndex', true);
const app = express();

let server;

passport.use(localStrategy); // Configure Passport to use our localStrategy when receiving Username + Password combinations
passport.use(jwtStrategy); // Configure Passport to use our jwtStrategy when receving JSON Web Tokens

//app.use(cors({ origin: CLIENT_ORIGIN }));
//console.log('CLIENT_ORIGN', CLIENT_ORIGIN);
app.use(morgan('common'));
app.use(express.json()); // You can also use: // app.use(bodyParser.json());


app.use(function (req, res, next) {
    //res.header('Access-Control-Allow-Origin', '*');//don't use this one cause allows anyone to use it
    res.header('Access-Control-Allow-Origin', CLIENT_ORIGIN);
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/trail', trailRouter);

const jwtAuth = passport.authenticate('jwt', {
    session: false
});

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'thinkful'
    });
});
app.use('*', (req, res) => {
    return res.status(404).json({
        message: 'Error - Not Found'
    });
});

function runServer(testEnv) {
    let mongoUrl;

    if (testEnv) {
        mongoUrl = TEST_DATABASE_URL;
    } else {
        mongoUrl = DATABASE_URL;
    }
    console.log(DATABASE_URL);
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoUrl, {
            useNewUrlParser: true
        }, err => {
            if (err) {
                return reject(err);
            }
            server = app
                .listen(PORT, () => {
                    console.log(`Your app is listening on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}
//stormyfalls
module.exports = {
    app,
    runServer,
    closeServer
};