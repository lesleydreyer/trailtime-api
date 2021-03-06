const express = require('express');
const Joi = require('joi');
const trailRouter = express.Router();
const HTTP_STATUS_CODES = require('../httpStatusCodes').HTTP_STATUS_CODES;
const { Trail, TrailJoiSchema } = require('./trailModel.js');
const { jwtAuth } = require('../auth/authStrategies');

trailRouter.use(express.json());

trailRouter.post('/', jwtAuth, (request, response) => {
    const newTrail = {
        user: request.user.id,
        trailName: request.body.trailName,
        trailRating: request.body.trailRating,
        trailLocation: request.body.trailLocation,
        trailDescription: request.body.trailDescription,
        trailImage: request.body.trailImage
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

trailRouter.get('/', jwtAuth, (request, response) => {
    Trail.find()//{ user: request.user.id })
        .populate('user')//the key
        .sort({ trailName: 1 })
        .then(trails => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                trails.map(trail => trail.serialize())
            );
        })
        .catch(error => {
            return response.status(500).json(error);
        });
});
/*WAS TRYING TO DO A QUERY
trailRouter.get('/search', jwtAuth, (request, response) => {
    Trail.find({ trailLocation: request.query.trailLocation })//{ user: request.user.id })
        .populate('user')//the key
        .sort({ trailName: 1 })
        .then(trails => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                //{ trailLocation: req.query.trailLocation }
                trails.map(trail => trail.serialize())
            );
        })
        .catch(error => {
            return response.status(500).json(error);
        });
});
trailRouter.get('/:aaa/', function (req, res) {
    res.json({
        trailLocation: req.query.trailLocation,
    });
});
*/

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

trailRouter.put('/:trailid', jwtAuth, (request, response) => {
    const trailUpdate = {
        trailName: request.body.trailName,
        trailRating: request.body.trailRating,
        trailLocation: request.body.trailLocation,
        trailDescription: request.body.trailDescription,
        trailImage: request.body.trailImage
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

trailRouter.delete('/:trailid', jwtAuth, (request, response) => {
    Trail.findByIdAndDelete(request.params.trailid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { trailRouter };