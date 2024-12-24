const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    HOST : process.env.HOST || 'localhost',
    PORT : process.env.PORT || 5000,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_CODE : process.env.EMAIL_CODE,
    EMAIL_DESTINO : process.env.EMAIL_DESTINO,
    DB_NAME : process.env.DB_NAME,
    DB_USER : process.env.DB_USER,
    DB_PASS : process.env.DB_PASS,
    DB_HOST : process.env.DB_HOST
}