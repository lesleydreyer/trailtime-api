

require('dotenv').config();
const os = require('os');
const express = require('express');
const imageRouter = express.Router();
const cors = require('cors');
const cloudinary = require('cloudinary');
// File handling middleware
const expressFormData = require('express-form-data');
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

imageRouter.use(
    cors({
        origin: process.env.CLIENT_ORIGIN
    })
);

imageRouter.use(upload.any());
imageRouter.get('/wake-up', (req, res) => res.send('👌'));

imageRouter.post('/image-upload', (req, res) => {
    console.log('reqfiles', req.files)
    const values = Object.values(req.files);
    console.log('values', values.files)
    const promises = values.map(image =>
        cloudinary.uploader.upload(image.path)
    );

    Promise.all(promises).then(results => { res.json(results); console.log(res.json) });
});

module.exports = { imageRouter };