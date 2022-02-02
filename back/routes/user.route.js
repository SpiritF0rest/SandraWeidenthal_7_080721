const express           = require("express");
const router            = express.Router();
const auth              = require("../middleware/authJwt");
const userCtrl          = require("../controllers/user.ctrl");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;