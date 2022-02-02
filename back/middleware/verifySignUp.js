const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkUserExisted = (req, res, next) => {
    // Check Username already exist
    User.findOne({
        where: {
            pseudo: req.body.pseudo
        }
    }).then(user => {
        if (user) {
            res.status(400).send({ message: "Username is already used." });
            return;
        }
        // Check Email already exist
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({ message: "Email is already used." });
                return;
            }
            next();
        });
    });
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({ message: "Role does not exist =" + req.body.roles[i] });
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkUserExisted: checkUserExisted,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;