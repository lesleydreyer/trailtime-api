require('dotenv').config()
const express = require('express')
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const { User } = require('../user/userModel');
const imageRouter = express.Router();
const HTTP_STATUS_CODES = require('../httpStatusCodes');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

imageRouter.use(formData.parse())
imageRouter.use(express.json());

imageRouter.post('/', (req, res) => {
    return User.findById(req.body.trail)
        .then(user => {
            //user
        })
    /*
        const values = Object.values(req.files)
        const promises = values.map(image => cloudinary.uploader.upload(image.path))
    
        Promise
            .all(promises)
            .then(results => res.json(results))*/
});

module.exports = { imageRouter };