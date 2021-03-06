const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.PORT,
        dialect: config.dialect,
        operatorsAliases: 0,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user     = require("../models/User.model")(sequelize, Sequelize);
db.role     = require("../models/Role.model")(sequelize, Sequelize);
db.post     = require("../models/Post.model")(sequelize, Sequelize);
db.comment  = require("../models/Comment.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.comment.belongsTo(db.post, {
    onDelete: "CASCADE",
});
db.post.hasMany(db.comment);

db.MultipassWords = ["", process.env.MULTIPASS_MODERATOR, process.env.MULTIPASS_ADMIN];

module.exports = db;