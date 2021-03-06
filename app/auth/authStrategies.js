'use strict';
const { Strategy: LocalStrategy } = require('passport-local');
const passport = require('passport');
// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../user/userModel');
const { JWT_SECRET } = require('../../config');

const localStrategy = new LocalStrategy((username, password, callback) => {
    let user;
    User.findOne({ username: username })
        .then(_user => {
            user = _user;
            console.log("here", user);
            if (!user) {
                console.log("user not found");
                // Return a rejected promise so we break out of the chain of .thens.
                // Any errors like this will be handled in the catch block.
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return user.validatePassword(password);
        }).then(isValid => {
            if (!isValid) {
                console.log("not valid");
                // Step 3A: If password doesn't match the stored password hash, reject promise with an error.
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return callback(null, user);
        })
        .catch(err => {
            console.log("catch block");
            if (err.reason === 'LoginError') {
                return callback(null, false, err);
            }
            return callback(err, false);
        });
});

const jwtStrategy = new JwtStrategy({
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
},
    (payload, done) => {
        done(null, payload.user);
    }
);

const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

module.exports = {
    localStrategy,
    jwtStrategy,
    localAuth,
    jwtAuth
};