const express       = require("express");

const app           = express();

const db            = require("./models");
const Role          = db.role;

const userRoutes    = require("./routes/user.route");

const helmet        = require("helmet");
const rateLimit     = require("express-rate-limit");

const dotenv        = require("dotenv").config();

// Method to parse the incoming requests with JSON playloads.
app.use(express.json());

// General middleware defining headers.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

function initial() {
    Role.findOrCreate({where: {
        id: 1,
        name: "user",
        multipass: ""
    }});
    Role.findOrCreate({where: {
        id: 2,
        name: "moderator",
        multipass: process.env.MULTIPASS_MODERATOR
    }});
    Role.findOrCreate({where: {
        id: 3,
        name: "admin",
        multipass: process.env.MULTIPASS_ADMIN
    }});
};

db.sequelize
    .sync() // { force: true } 
    .then(() => {
    console.log("Sync to db successful");
    initial();
});

// Security against brute force attacks.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
});

// Configure headers for better security.
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Add the router to the middleware management path, specifying a path.
app.use("/api/auth", userRoutes);

module.exports = app;