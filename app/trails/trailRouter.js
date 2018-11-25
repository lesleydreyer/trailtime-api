const express = require('express');
const Joi = require('joi');
const trailRouter = express.Router();
//const passport = require('passport');
const HTTP_STATUS_CODES = require('../httpStatusCodes');
//const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Trail, TrailJoiSchema } = require('./trailModel.js');

trailRouter.use(express.json());

trailRouter.post('/', (request, response) => {//('/', jwtPassportMiddleware, (request, response)
    const newTrail = {
        // user: request.user.id,
        trailName: request.body.trailName,
        trailRating: request.body.trailRating,
        trailLocation: request.body.trailLocation,
        trailDescription: request.body.trailDescription
    };

    const validation = Joi.validate(newTrail, TrailJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Trail.create(newTrail)
        .then(createdUser => {
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

trailRouter.get('/', (request, response) => {//jwtPassportMiddleware, (request,
    Trail.find()//{ user: request.user.id })
        .populate('user')
        .then(trails => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                trails.map(trail => trail.serialize())
            );
        })
        .catch(error => {
            return response.status(500).json(error);
        });
});


trailRouter.get('/:trailid', (request, response) => {
    Trail.findById(request.params.trailid)
        .populate('user')
        .then(trail => {
            return response.status(HTTP_STATUS_CODES.OK).json(trail.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

trailRouter.put('/:trailid', (request, response) => {//jwtPassportMiddleware, (requ
    const trailUpdate = {
        trailName: request.body.trailName,
        trailRating: request.body.trailRating,
        trailLocation: request.body.trailLocation,
        trailDescription: request.body.trailDescription
    };
    const validation = Joi.validate(trailUpdate, TrailJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Trail.findByIdAndUpdate(request.params.trailid, trailUpdate)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

trailRouter.delete('/:trailid', (request, response) => {// jwtPassportMiddleware,
    Trail.findByIdAndDelete(request.params.trailid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { trailRouter };