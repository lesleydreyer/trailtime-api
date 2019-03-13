const mongoose = require('mongoose');
const Joi = require('joi');


const trailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },//creator
    trailName: { type: String, required: true },
    trailRating: { type: String },
    trailLocation: { type: String, required: true },
    trailDescription: { type: String },
    trailImage: { type: String },
});



trailSchema.methods.serialize = function () {
    let user;
    // serialize user if populated to avoid returning info like hashed password
    if (typeof this.user === 'function') {//if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {
        id: this._id,
        user: user,
        trailName: this.trailName,
        trailRating: this.trailRating,
        trailLocation: this.trailLocation,
        trailDescription: this.trailDescription,
        trailImage: this.trailImage,
    };
};


const TrailJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    trailName: Joi.string().min(1).required(),
    trailRating: Joi.string().optional(),
    trailLocation: Joi.string().optional(),
    trailDescription: Joi.string().optional(),
    trailImage: Joi.string().optional(),
});


const Trail = mongoose.model('trail', trailSchema);
module.exports = { Trail, TrailJoiSchema };