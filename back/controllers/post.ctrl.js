const db      = require("../models");
const fs      = require("fs");
const Post    = db.post;
const Comment = db.comment;

exports.getAllPosts = (req, res, next) => {
  Post.findAll({ include: Comment })
      .then(posts => res.status(200).json(posts))
      .catch(error => res.status(400).json({ error }));
};

exports.createPost = (req, res, next) => {
  let postObject = req.file ? 
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
  Post.create(postObject)
      .then(() => res.status(201).json({ message: "Post created." }))
      .catch(error => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  Post.findOne({ where : { id: req.params.id } })
    .then( post => {
      if (post.authorId !== req.authJwt) {
        res.status(400).json({ error: "Unauthorized request." })
      } else if (post.authorId == req.authJwt) {
        let imagePath = post.imageUrl;
        if (req.file) {
          const filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) { 
              console.log(err);
            } else {
              console.log('This image is deleted');
            }
          });
          imagePath = "http://localhost:3000/images/" + req.file.filename; 
        };
        Post.update({ text: req.body.text, imageUrl: imagePath }, { where: { id:req.params.id }})
            .then(() => res.status(200).json({ message: "Post modified." }))
            .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ where : { id: req.params.id } })
    .then(post => {
      if (post.authorId == req.authJwt || req.authRole == "ROLE_MODERATOR" || req.authRole == "ROLE_ADMIN") {
        if (post.imageUrl) {
          const filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('This image is deleted');
            };
          });
        };
        Post.destroy({ where: { id: req.params.id }})
            .then(() => res.status(200).json({ message: "Post deleted." }))
            .catch(error => res.status(400).json({ error }));
      } else {
        res.status(400).json({ error: "Unauthorized request." }) 
      };
    })
    .catch(error => res.status(500).json({ error }));
};