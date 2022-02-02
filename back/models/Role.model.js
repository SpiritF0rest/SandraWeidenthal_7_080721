module.exports = (sequelize, Sequelize) => {
    const RoleSchema = sequelize.define("Role", {
        id: {
            type: Sequelize.INTEGER(11), 
            primaryKey: true, 
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            defaultValue: "",
            allowNull: false
        }
    });
    return RoleSchema;
}
