const express           = require("express");
const router            = express.Router();
const userCtrl          = require("../controllers/user.ctrl");
const { verifySignUp, authJwt }  = require("../middleware");

router.post("/signup", [verifySignUp.checkUserExisted, verifySignUp.checkRolesExisted], userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/",[authJwt.isModeratorOrAdmin] , userCtrl.getAllUsers);
router.get("/:id",[authJwt.isModeratorOrAdmin] , userCtrl.getOneUser);
router.put("/:id", [authJwt.verifyToken], userCtrl.modifyUser);

module.exports = router;