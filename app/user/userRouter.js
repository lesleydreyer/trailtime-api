const express = require('express');
const Joi = require('joi');

const HTTP_STATUS_CODES = require('../httpStatusCodes');
const { User, UserJoiSchema } = require('./userModel');

const userRouter = express.Router();

userRouter.post('/', (request, response) => {
    const newUser = {
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    };

    const validation = Joi.validate(newUser, UserJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    User.findOne({
        $or: [
            { email: newUser.email },
            { username: newUser.username }
        ]
    }).then(user => {
        if (user) {
            return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Database Error: A user with that username and/or email already exists.' });
        }
        return User;//.hashPassword(newUser.password);
    }).then(passwordHash => {
        newUser.password = passwordHash;
        User.create(newUser)
            .then(createdUser => {
                return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
            })
            .catch(error => {
                console.error(error);
                return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error.message
                });
            });
    });
});

userRouter.get('/', (request, response) => {
    User.find()
        .then(users => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                users.map(user => user.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

userRouter.get('/:userid', (request, response) => {
    User.findById(request.params.userid)
        .then(user => {
            return response.status(HTTP_STATUS_CODES.OK).json(user.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { userRouter };