const mongoose = require('mongoose');
const Joi = require('joi');


var commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [this],
    trail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trail'
    },
    createdAt: { type: Date, default: Date.now }
});

commentSchema.pre('findById', function (next) {
    this.populate('trail');
    next();
})

commentSchema.methods.serialize = function () {
    let user;
    // serialize user if populated to avoid returning info like hashed password
    if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }
    let trail;
    if (typeof this.trail.serialize === 'function') {
        trail = this.trail.serialize();
    } else {
        trail = this.trail;
    }

    console.log(this.trail)

    return {
        id: this._id,
        commentText: this.commentText,
        user: user,
        comments: this.comments,
        trail: this.trailId,
        createdAt: this.createdAt
    };
};


const CommentJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    commentText: Joi.string().min(1).required()
});


const Comment = mongoose.model('comment', commentSchema);
module.exports = { Comment, CommentJoiSchema };