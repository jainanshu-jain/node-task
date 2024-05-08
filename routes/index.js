//entry point for all the routes
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");
const csvController = require("../controllers/csv_controller");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/students", require("./students"));
router.use("/interviews", require("./interviews"));
router.get("/download-report", csvController.downloadCSV);

router.use("/jobs", require("./jobs"));

module.exports = router;
