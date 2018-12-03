const express = require('express');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const imageRouter = express.Router();
imageRouter.get('/wake-up', (req, res) => res.send('👌'));
imageRouter.post('/image-upload', (req, res) => {
    const values = Object.values(req.files);
    console.log('values', values)
    const promises = values.map(image =>
        cloudinary.uploader.upload(image.path));
    //console.log(image.path)
    Promise.all(promises).then(results => res.json(results));
});

module.exports = { imageRouter };