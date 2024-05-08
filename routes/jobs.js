const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job_controller");
const passport = require("passport");
// passport.checkAuthentication,
router.get("/joblist", passport.checkAuthentication, jobController.getJobList);

module.exports = router;
