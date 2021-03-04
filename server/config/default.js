/* 
 * Server configuration
 */

const config = {
    mongodb: {
        dbpath: './server/database/db',
        port: '27018',
        dbname: process.env.DB_NAME
    },
    secret: '1234567890'
};

module.exports = config;