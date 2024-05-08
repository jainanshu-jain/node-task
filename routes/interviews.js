const express = require("express");
const router = express.Router();
const interviewsController = require("../controllers/interviews_controller");

router.get("/add-interview", interviewsController.addInterview);
router.post("/create", interviewsController.createInterview);
router.post("/allocate-student/:id", interviewsController.assignInterview);
router.get(
  "/deallocate-student/:studentId/:interviewId",
  interviewsController.deallocate
);

router.post(
  "/update-student/:studentId/:interviewId",
  interviewsController.updateStudent
);

//unscedule interview
router.delete("/unschedule/:interviewId",interviewsController.removeInterview)


module.exports = router;
