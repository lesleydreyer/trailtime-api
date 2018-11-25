const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../app/user');

const expect = chai.expect;

chai.use(chaiHttp);


describe('/api/users', () => {
    let testUser;

    function createFakeUser() {
        return {
            username: `${faker.lorem.word()}${faker.random.number(100)}`,
            password: faker.internet.password(),
            email: faker.internet.email()
        };
    }

    before(() => runServer(true));


    beforeEach(() => {
        testUser = createFakeUser();
        return User.create(testUser)
            .then(() => { })
            .catch((err) => {
                console.error(err);
            });
    });


    afterEach(() => new Promise((resolve, reject) => {
        mongoose.connection.dropDatabase()
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
    }));


    after(() => closeServer());


    it('Should return all users', () => chai.request(app)
        .get('/api/users')
        .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            expect(res.body[0]).to.include.keys('id', 'username', 'email');
            expect(res.body[0]).to.not.include.keys('password');
        }));

    it('Should return a specific user', () => {
        let foundUser;
        // debugger;
        return chai.request(app)
            .get('/api/users')
            .then((res) => {
                console.log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                foundUser = res.body[0];
                return chai.request(app).get(`/api/users/${foundUser.id}`);
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.equal(foundUser.id);
            });
    });

    it('Should create a new user', () => {
        const newUser = createFakeUser();
        return chai.request(app)
            .post('/api/users')
            .send(newUser)
            .then((res) => {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'username', 'email');
                expect(res.body.username).to.equal(newUser.username);
                expect(res.body.email).to.equal(newUser.email);
            });
    });
});