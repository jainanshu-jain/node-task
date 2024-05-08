const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/students_controller");
const passport = require("passport");

router.get(
  "/add-student",
  passport.checkAuthentication,
  studentsController.addStudent
);

router.post("/create", studentsController.createStudent);

//editing student details
router.get(
  "/edit-student/:id",
  passport.checkAuthentication,
  studentsController.editStudent
);

router.post("/update-student/:id", studentsController.updateStudent);

//delete student
router.get("/delete-student/:id", studentsController.deleteStudent);

module.exports = router;
