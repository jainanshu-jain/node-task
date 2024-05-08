const Interview = require("../models/interview");
const Student = require("../models/student");

module.exports.home = async (req, res) => {
  try {
    //get all students from Student model----
    let students = await Student.find({}).populate("");
    let interviews = await Interview.find({}).populate("students.student");

    return res.render("home", {
      title: "Home Page",
      all_students: students,
      all_interviews: interviews,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
