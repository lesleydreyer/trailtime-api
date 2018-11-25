const express = require('express');
const Joi = require('joi');
const commentRouter = express.Router();
const HTTP_STATUS_CODES = require('../httpStatusCodes');
const { Comment, CommentJoiSchema } = require('./commentModel.js');
const { jwtAuth } = require('../auth/authStrategies');

commentRouter.use(express.json());

commentRouter.post('/', jwtAuth, (request, response) => {
    const newComment = {
        // user: request.user.id,
        commentText: request.body.commentText
    };

    const validation = Joi.validate(newComment, CommentJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Comment.create(newComment)
        .then(createdUser => {
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

commentRouter.get('/', jwtAuth, (request, response) => {
    Comment.find()//{ user: request.user.id })
        .populate('user')
        .then(comments => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                comments.map(comment => comment.serialize())
            );
        })
        .catch(error => {
            return response.status(500).json(error);
        });
});


commentRouter.get('/:commentid', (request, response) => {
    Comment.findById(request.params.trailid)
        .populate('user')
        .then(comment => {
            return response.status(HTTP_STATUS_CODES.OK).json(comment.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

commentRouter.put('/:commentid', jwtAuth, (request, response) => {
    const commentUpdate = {
        commentText: request.body.commentText
    };
    const validation = Joi.validate(commentUpdate, CommentJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Comment.findByIdAndUpdate(request.params.commentid, commentUpdate)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

commentRouter.delete('/:commentid', jwtAuth, (request, response) => {
    Comment.findByIdAndDelete(request.params.trailid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { commentRouter };