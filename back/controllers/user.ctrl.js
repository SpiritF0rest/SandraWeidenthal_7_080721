//revoir les catch qui renvoie le foure tout 500
const bcrypt            = require("bcrypt");
const jwt               = require("jsonwebtoken");
const Joi               = require("joi");
const passwordValidator = require("password-validator");
const db                = require("../models");
const config            = require("../config/auth.config");
const dotenv            = require("dotenv").config();

const User              = db.user;
const Role              = db.role;
const Op                = db.Sequelize.Op;

// Schema for password strength
const pvSchema = new passwordValidator();
pvSchema
    .is().min(8)                                                     // Minimum length 8
    .is().max(100)                                                   // Maximum length 100
    .has().uppercase()                                               // Must have uppercase letters
    .has().lowercase()                                               // Must have lowercase letters
    .has().digits()                                                  // Must have digits
    .has().not().spaces()                                            // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Motdepasse123']); // Blacklist these values

exports.signup = (req, res, next) => {
    // Checks the validity of the data entered during the connection.
    const schema = Joi.object().keys({
        pseudo: Joi.string().min(3).required(),
        email: Joi.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/).required(),
        password: Joi.string().min(3).required(),
        roles: Joi.array().items(Joi.string().valid(process.env.MULTIPASS_MODERATOR, process.env.MULTIPASS_ADMIN, ""))
        //repeat_password: Joi.ref('password')
    })
    if (schema.validate(req.body).error) {
        res.send(schema.validate(req.body).error.details)
    } else if(pvSchema.validate(req.body.password) !== true) { // Checks password strength
         res.status(422).json({ message: "Password too weak." })
    } else {
    bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
        .then(hash => {        
            User.create({
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: hash, 
            })
            .then(user => {
                if (req.body.roles) {
                    Role.findAll({
                        where: {
                            multipass: {
                                [Op.or] : req.body.roles
                            }
                        }

                    }).then(roles => {
                        user.setRoles(roles).then(() => {
                            res.send({  message: "User created." });
                        });
                    });
                } else {
                    user.setRoles([1]).then(() => {
                        res.send({ message: "User created" });
                    });
                };
            })
        })
        .catch(error => res.status(500).json({ error }));
    };
};


exports.login = (req, res, next) => {
    User.findOne({ 
        where: {
            pseudo: req.body.pseudo
        }
    })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "User not found." });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Incorrect password." });
                    }
                    let authorities  = [];
                    user.getRoles().then(roles => {
                        for (let i = 0; i < roles.length; i++) {
                            authorities.push("ROLE_" + roles[i].name.toUpperCase());
                        }
                        res.status(200).json({
                            id: user.id,
                            pseudo: user.pseudo,
                            email: user.email,
                            roles: authorities,
                            token: jwt.sign(
                                { id: user.id },
                                config.secret,
                                { expiresIn: 86400 } //24 hours
                            )
                        });
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneUser = (req, res, next) => {
    User.findOne({ 
        where: {
            id: req.params.id
        }
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};

// Test auth
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content")
};