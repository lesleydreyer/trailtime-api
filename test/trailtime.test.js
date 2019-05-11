const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonwebtoken = require('jsonwebtoken');
const faker = require('faker');
const {
    JWT_SECRET,
    JWT_EXPIRY,
} = require('../config');
const {
    app,
    runServer,
    closeServer,
} = require('../server.js');
const {
    User,
} = require('../app/user/userModel');
const {
    Trail,
} = require('../app/trails/trailModel');


const expect = chai.expect;
chai.use(chaiHttp);

describe('Integration tests for: /api/trail', () => {
    let testUser;
    let authToken;


    function createFakerUser() {
        return {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            username: `${faker.lorem.word()}${faker.random.number(100)}`,
            password: faker.internet.password(),
            email: faker.internet.email(),
        };
    }

    function createFakerTrail() {
        return {
            trailName: faker.lorem.word(),
            trailRating: faker.lorem.word(),
            trailLocation: faker.address.streetAddress(),
            trailDescription: faker.lorem.sentence(),
            trailImage: faker.image.imageUrl(),
        };
    }

    before(() => runServer(true));

    beforeEach(() => {
        testUser = createFakerUser();

        return User.hashPassword(testUser.password)
            .then(hashedPassword =>
                // Create a randomized test user.
                User.create({
                    username: testUser.username,
                    email: testUser.email,
                    password: hashedPassword
                }).catch((err) => {
                    console.error(err);
                    throw new Error(err);
                }),
            )
            .then((createdUser) => {
                testUser.id = createdUser.id;

                authToken = jsonwebtoken.sign({
                    user: {
                        id: testUser.id,
                        username: testUser.username,
                        email: testUser.email
                    },
                },
                    JWT_SECRET, {
                        algorithm: 'HS256',
                        expiresIn: JWT_EXPIRY,
                        subject: testUser.username,
                    },
                );

                const seedData = [];
                for (let i = 1; i <= 10; i++) {
                    const newTrail = createFakerTrail();
                    newTrail.user = createdUser.id;
                    seedData.push(newTrail);
                }
                return Trail.insertMany(seedData)
                    .catch((err) => {
                        console.error(err);
                        throw new Error(err);
                    });
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

    after(() =>
        closeServer()
    );


    it('Should return user trails', () => {
        debugger;
        return chai.request(app)
            .get('/api/trail')
            .set('Authorization', `Bearer ${authToken}`)
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const trail = res.body[0];
                expect(trail).to.include.keys('user', 'trailName', 'trailRating', 'trailLocation', 'trailDescription', 'trailImage');
            });
    });

    it('Should return a specific trail', () => {
        let foundTrail;
        return Trail.find()
            .then((trails) => {
                expect(trails).to.be.a('array');
                expect(trails).to.have.lengthOf.at.least(1);
                foundTrail = trails[0];

                return chai.request(app)
                    .get(`/api/trail/${foundTrail.id}`)
                    .set('Authorization', `Bearer ${authToken}`);
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('user', 'trailName', 'trailRating', 'trailLocation', 'trailDescription', 'trailImage');
                expect(res.body).to.deep.include({
                    id: foundTrail.id,
                    trailName: foundTrail.trailName,
                    trailRating: foundTrail.trailRating,
                    trailLocation: foundTrail.trailLocation,
                    trailDescription: foundTrail.trailDescription,
                    trailImage: foundTrail.trailImage,
                });
            });
    });

    it('Should update a specific trail', () => {
        let trailToUpdate;
        const newTrailData = createFakerTrail();
        return Trail.find()
            .then((trails) => {
                expect(trails).to.be.a('array');
                expect(trails).to.have.lengthOf.at.least(1);
                trailToUpdate = trails[0];

                return chai.request(app)
                    .put(`/api/trail/${trailToUpdate.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newTrailData);
            })
            .then((res) => {
                expect(res).to.have.status(204);

                return Trail.findById(trailToUpdate.id);
            })
            .then((trail) => {
                expect(trail).to.be.a('object');
                expect(trail).to.deep.include({
                    id: trailToUpdate.id,
                    trailName: newTrailData.trailName,
                    trailRating: newTrailData.trailRating,
                    trailLocation: newTrailData.trailLocation,
                    trailDescription: newTrailData.trailDescription,
                    trailImage: newTrailData.trailImage,
                });
            });
    });


    it('Should update a specific trail', () => {
        let trailToDelete;
        const newTrailData = createFakerTrail();
        return Trail.find()
            .then((trails) => {
                expect(trails).to.be.a('array');
                expect(trails).to.have.lengthOf.at.least(1);
                trailToDelete = trails[0];

                return chai.request(app)
                    .delete(`/api/trail/${trailToDelete.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newTrailData);
            })
            .then((res) => {
                expect(res).to.have.status(204);

                return Trail.findById(trailToDelete.id);
            })
            .then((trail) => {
                expect(trail).to.not.exist;
            });
    });

});