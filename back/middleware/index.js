const { config } = require("dotenv");
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const multerConfig = require("./multerConfig");

module.exports = {
    authJwt,
    verifySignUp,
    multerConfig
};