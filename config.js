exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
exports.DATABASE_URL = process.env.DATABASE_URL ||
    'mongodb://localhost/trail-time-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/test-trail-time-db';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'thinkful';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';