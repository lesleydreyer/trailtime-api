require('dotenv').config();
const os = require('os');
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary');
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });
//const formData = require('express-form-data')

//const { User } = require('../user/userModel');
const imageRouter = express.Router();
//const HTTP_STATUS_CODES = require('../httpStatusCodes');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

imageRouter.use(
    cors({
        origin: process.env.CLIENT_ORIGIN
    })
);

imageRouter.use(upload.any());//or could do formData instead of multer imageRouter.use(formData.parse())
imageRouter.use(express.json());

imageRouter.get('/wake-up', (req, res) => res.send('👌'));

imageRouter.post('/image-upload', (req, res) => {
    const values = Object.values(req.files);
    console.log('values', values)
    const promises = values.map(image =>
        cloudinary.uploader.upload(image.path));
    console.log(image.path)
    Promise.all(promises).then(results => res.json(results));
});

//return User.findById(req.body.trail)
//  .then(user => {
//user
//})


module.exports = { imageRouter };