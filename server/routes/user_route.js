const router = require("express").Router();

const { wrapAsync, authentication } = require("../util/util");

const {
  signUp,
  signIn,
  getUserProfile,
} = require("../controllers/user_controller");

router.route("/user").post(wrapAsync(signUp));

router.route("/user").get(wrapAsync(signIn));

router.route("/user").get(wrapAsync(getUserProfile));

module.exports = router;
