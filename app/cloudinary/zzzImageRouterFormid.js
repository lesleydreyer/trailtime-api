const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary');
const formidable = require('formidable');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const imageRouter = express.Router();
imageRouter.get('/wake-up', (req, res) => res.send('👌'));
imageRouter.post('/image-upload', (req, res) => {

    /*const promises = values.map(image => {
        console.log('IMG PATH ====>', image.path);
        cloudinary.uploader.upload(image.path, (result) => {
            console.log('UPLOADED RESULT =====> ', result);
        })
    }
    );*/

    const uploadPath = path.join(__dirname); // __dirname = cloudinary
    const form = new formidable.IncomingForm();
    // form.uploadDir = './';
    form.keepExtensions = true;
    // return res.json('UPLOADED TEST');

    console.log('TEST PASS');

    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json(err);
        console.log('ALL FILES', files);

        /* if (files.image) {
            return cloudinary.uploader.upload(files.image.path, (result) => {
                console.log('File uploaded successfully', result);
                return res.status(200).json(result);
            });
        }*/

        return res.status(200).json('File uploaded');
    });
    return;
    //console.log(image.path)
    //Promise.all(promises).then(results => res.json(results));
});

module.exports = { imageRouter };