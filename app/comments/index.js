'use strict';

const {
    Comment
} = require('./commentModel');
const {
    commentRouter
} = require('./commentRouter');

module.exports = {
    Comment,
    commentRouter
};