const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { CLIENT_ORIGIN, PORT, DATABASE_URL, TEST_DATABASE_URL } = require('./config');
//const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use(express.json());

app.get('/api/*', (req, res) => {
    return res.json({ ok: true });
});

app.use('*', (req, res) => {
    return res.status(404).json({
        message: 'Not Found'
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


let server;

function runServer(testEnv) {
    let mongoUrl;

    if (testEnv) {
        mongoUrl = TEST_DATABASE_URL;
    } else {
        mongoUrl = DATABASE_URL;
    }
    console.log(mongoUrl);
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

//if (require.main === module) {
//    runServer().catch(err => console.error(err));
//}

//module.exports = { app };
//https://stormy-falls-76813.herokuapp.com/ is heroku

module.exports = {
    app,
    runServer,
    closeServer
};