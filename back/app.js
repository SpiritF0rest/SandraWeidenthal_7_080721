const express       = require("express");

const app           = express();

const db            = require("./models");
const Role          = db.role;

const path          = require("path");

const userRoutes    = require("./routes/user.route");
const postRoutes    = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");

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

// Database synchronization
db.sequelize
    .sync() 
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

// Method to manage the image ressource statiscally.
app.use("/images", express.static(path.join(__dirname, "images")));

// Add the router to the middleware management path, specifying a path.
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;