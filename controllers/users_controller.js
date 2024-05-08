const { closeDelimiter } = require("ejs");
const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "Profile",
  });
};

//render the signIn page
module.exports.getSignin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signin", {
    title: "Sign In",
  });
};

//render the signUp page
module.exports.getSignup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signup", {
    title: "Sign Up",
  });
};

//get the sign-up data and create user
module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // if password doesn't match
    if (password !== confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "Email already registered!");
      return res.redirect("back");
    }

    // create a new user
    await User.create({
      username,
      email,
      password,
    });

    // success flash message
    req.flash("success", "Account created!");
    return res.redirect("/users/signin");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

// sign in c=and create session for user
module.exports.createSession = function (req, res) {
  req.flash("success", "You are now signed in");
  return res.redirect("/");
};

// destroy session or sign out or clears the cookie
module.exports.destroySession = function (req, res) {
  req.logout((err) => {
    // Clear the authenticated user's session data
    if (err) {
      return next(err);
    }
    req.flash("success", "You are now signed out");
    return res.redirect("/");
  });
};
