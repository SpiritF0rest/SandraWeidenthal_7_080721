const express                   = require("express");
const router                    = express.Router();
const commentCtrl               = require("../controllers/comment.ctrl");
const { authJwt, multerConfig } = require("../middleware");

router.post("/", multerConfig, commentCtrl.createComment);
router.get("/", commentCtrl.getAllComment);
router.put("/:id", [authJwt.verifyToken], multerConfig, commentCtrl.modifyComment);
router.delete("/:id", [authJwt.verifyToken], commentCtrl.deleteComment);

module.exports = router;