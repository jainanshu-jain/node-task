//import user
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, 
    },
    async function (req, email, password, done) {
      try {
        //find user by email and establish identity
        const user = await User.findOne({ email: email });
        if (!user || user.password != password) {
          req.flash("error", "Invalid Username or Password");
          return done(null, false);
        }

        //if username and password are valid, return the user
        return done(null, user);
      } catch (err) {
        req.flash("error", "Error in finding user ----> passport");
        console.log("Error in finding user ----> passport", err);
        return done(err);
      }
    }
  )
);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});


passport.deserializeUser(async function (id, done) {
  try {
    // Find the user by id
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user ----> passport");
    return done(err);
  }
});

// check user is auhenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  //if user is not signed in
  return res.redirect("/users/signin");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
