const mongoose = require('mongoose');
const Joi = require('joi');


var commentSchema = new mongoose.Schema({
    commentText: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});


commentSchema.methods.serialize = function () {
    let user;
    // serialize user if populated to avoid returning info like hashed password
    if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {
        id: this._id,
        user: user,
        commentText: this.commentText,
    };
};


const CommentJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    commentText: Joi.string().min(1).required()
});


const Comment = mongoose.model('comment', commentSchema);
module.exports = { Comment, CommentJoiSchema };