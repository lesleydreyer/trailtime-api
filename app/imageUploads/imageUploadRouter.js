const express = require('express');
const imageUploadRouter = express.Router();
const HTTP_STATUS_CODES = require('../httpStatusCodes').HTTP_STATUS_CODES;
const { jwtAuth } = require('../auth/authStrategies');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

imageUploadRouter.use(express.json());

imageUploadRouter.get('/api/upload', (req, res) => {
    console.log('cloudconfig', cloudinary.config)
})

module.exports = { imageUploadRouter };