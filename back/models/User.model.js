
module.exports = (sequelize, Sequelize) => {
    const UserSchema = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER(11), 
            primaryKey: true, 
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING(100),
            defaultValue: "",
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING(100),
            defaultValue: "",
            allowNull: false
        },
        pseudo: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING, 
            unique: true, 
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(64),
        },
        service: {
            type: Sequelize.STRING(100),
            defaultValue: "",
            allowNull: false
        }
    }, {paranoid: true});
    return UserSchema;
}