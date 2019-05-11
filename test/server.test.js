//WOULD DO SOMETHING LIKE BELOW BUT NO PUBLIC DIRECTORY TO TEST FROM
//SO WON'T WORK SINCE THE PUBLIC FILES ARE ON THE CLIENT REACT SIDE

/*'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {
    app,
    runServer,
    closeServer
} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp); // implements chai http plugin

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
                debugger;
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                expect(res.text).to.have.string('<!DOCTYPE html');
            })
    });
});*/