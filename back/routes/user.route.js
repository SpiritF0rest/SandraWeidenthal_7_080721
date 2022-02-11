const express           = require("express");
const router            = express.Router();
const auth              = require("../middleware/authJwt");
const userCtrl          = require("../controllers/user.ctrl");
const { verifySignUp }  = require("../middleware");

router.post("/signup", [verifySignUp.checkUserExisted, verifySignUp.checkRolesExisted], userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getOneUser);

module.exports = router;