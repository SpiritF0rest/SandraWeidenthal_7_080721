module.exports = (sequelize, Sequelize) => {
    const CommentSchema = sequelize.define("Comment", {
        id: {
            type: Sequelize.INTEGER(11), 
            primaryKey: true, 
            autoIncrement: true
        },
        text: {
            type: Sequelize.TEXT,
            defaultValue: "",
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
        author: {
            type: Sequelize.STRING(100),
            allowNull: false
        }, 
        authorId: {
            type: Sequelize.INTEGER(11),
            allowNull: false
        }
        /*likes: {
            type: Sequelize.INTEGER
        },
        dislikes: {
            type: Sequelize.INTEGER
        },
        usersLiked: {
            type: Sequelize.JSON
        },
        usersDisliked: {
            type: Sequelize.JSON
        }*/
    });
    return CommentSchema;
}