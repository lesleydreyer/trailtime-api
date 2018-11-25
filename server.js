require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { CLIENT_ORIGIN, PORT, DATABASE_URL, TEST_DATABASE_URL } = require('./config');
const HTTP_CODES = require('./app/httpStatusCodes')
console.log('DATABASE_URL', DATABASE_URL);
mongoose.set('useCreateIndex', true);
const bodyParser = require('body-parser');
const { userRouter } = require('./app/user/index');
const { trailRouter } = require('./app/trails/index');
const { imageRouter } = require('./app/cloudinary/index');
const { authRouter, localStrategy, jwtStrategy } = require('./app/auth/index');

let server;

passport.use(localStrategy); // Configure Passport to use our localStrategy when receiving Username + Password combinations
passport.use(jwtStrategy); // Configure Passport to use our jwtStrategy when receving JSON Web Tokens

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(morgan('common'));
app.use('*', (req, res) => {
    return res.status(404).json({
        message: 'Not Found'
    });
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/trail', trailRouter);
app.use('/api/:trailid/images', imageRouter);

const jwtAuth = passport.authenticate('jwt', {
    session: false
});

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'thinkful'
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

//https://stormy-falls-76813.herokuapp.com/ is heroku

module.exports = {
    app,
    runServer,
    closeServer
};