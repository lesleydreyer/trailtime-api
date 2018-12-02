const mongoose = require('mongoose');
const Joi = require('joi');


var commentSchema = new mongoose.Schema({
    type: String,
    author: String
});
var eventSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    attendees: [String]
});

const trailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },//creator
    trailName: { type: String, required: true },
    trailRating: { type: String },
    trailLocation: { type: String, required: true },
    trailDescription: { type: String },
    images: [String],
    //comments: [commentSchema],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"//own schema
    }],
    events: [eventSchema]//own schema
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
        images: this.images,
        comments: this.comments,
        events: this.events
    };
};


const TrailJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    trailName: Joi.string().min(1).required(),
    trailRating: Joi.string().optional(),
    trailLocation: Joi.string().optional(),
    trailDescription: Joi.string().optional(),
    images: Joi.optional(),
    comments: Joi.optional(),
    events: Joi.optional()
});


const Trail = mongoose.model('trail', trailSchema);
module.exports = { Trail, TrailJoiSchema };