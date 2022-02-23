const express           = require("express");
const router            = express.Router();
const postCtrl          = require("../controllers/post.ctrl");
const { authJwt, multerConfig }       = require("../middleware");

router.post("/", multerConfig, postCtrl.createPost);
router.get("/", postCtrl.getAllPosts);
router.put("/:id", [authJwt.verifyToken], multerConfig, postCtrl.modifyPost);
router.delete("/:id", [authJwt.verifyToken], postCtrl.deletePost);

module.exports = router;
