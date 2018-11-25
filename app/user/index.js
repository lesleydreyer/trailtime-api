'use strict';
const { User } = require('./userModel');
const { userRouter } = require('./userRouter');

module.exports = { User, userRouter };