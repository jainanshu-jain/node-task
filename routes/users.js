const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_controller");
const passport = require("passport");

router.get("/profile", passport.checkAuthentication, usersController.profile);

//router for sign-up and sign-in pages
router.get("/signup", usersController.getSignup);
router.get("/signin", usersController.getSignin);

router.post("/create", usersController.create);
//use passport as middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/signin" }),
  usersController.createSession
);

router.get("/logout", usersController.destroySession);

module.exports = router;
