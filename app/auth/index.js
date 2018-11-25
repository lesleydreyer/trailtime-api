'use strict';
const { authRouter } = require('./authRouter');
const { localStrategy, jwtStrategy } = require('./authStrategies');

module.exports = { authRouter, localStrategy, jwtStrategy };