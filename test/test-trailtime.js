'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
//const { createAuthToken } = require("../app/auth/authRouter");
const { app, runServer, closeServer } = require('../server');

const { User } = require('../app/user');
const { Trail } = require('../app/trails');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/', function () {
    before(function () {
        return runServer(true);
    });
    after(function () {
        return closeServer();
    })
    it("should return index.html", function () {
        return chai.request(app)
            .get('/')
            .then(res => {
                //debugger;
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                expect(res.text).to.have.string('<!DOCTYPE html');
            })
    });
});
