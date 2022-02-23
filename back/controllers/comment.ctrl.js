const db        = require("../models");
const fs        = require("fs");
const Comment   = db.comment;

exports.getAllComment = (req, res, next) => {
    Comment.findAll()
        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(400).json({ error }));
};

exports.createComment = (req, res, next) => {
    let commentObject = req.file ? 
    {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        //likes: 0,
        //dislikes: 0,
        //userLiked: [],
        //userDisliked: []
    } : {
        ...req.body,
        //likes: 0,
        //dislikes: 0,
        //userLiked: [],
        //userDisliked: []
    }
    Comment.create(commentObject)
        .then(() => res.status(201).json({ message: "Comment created." }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyComment = (req, res, next) => {
    Comment.findOne({ where : { id: req.params.id } })
        .then( comment => {
            if (comment.authorId !== req.authJwt) {
                res.status(400).json({ error: "Unauthorized request." })
            }
            else if (comment.authorId == req.authJwt) {
                if (req.file.filename) {
                    const filename = comment.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) { 
                            console.log(err);
                        } else {
                            console.log('This image is deleted');
                        }
                    });
                };
                let imagePath = "http://localhost:3000/images/" + req.file.filename; 
                Comment.update({ text: req.body.text, imageUrl: imagePath }, { where: { id:req.params.id }})
                    .then(() => res.status(200).json({ message: "Comment modified." }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    Comment.findOne({ where : { id: req.params.id } })
        .then(comment => {
            if (comment.authorId !== req.authJwt) {
                res.status(400).json({ error: "Unauthorized request." })
            }
            else if (comment.authorId == req.authJwt) {
                if (req.body.imageUrl) {
                    const filename = comment.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('This image is deleted');
                        }
                    });
                };
                Comment.destroy({ where: { id: req.params.id }})
                    .then(() => res.status(200).json({ message: "Comment deleted." }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};