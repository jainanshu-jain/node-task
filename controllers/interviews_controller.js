const Interview = require("../models/interview");
const Student = require("../models/student");

module.exports.addInterview = function (req, res) {
  return res.render("add_interview", {
    title: "Schedule an interview",
  });
};

// creation of new Interview
module.exports.createInterview = async (req, res) => {
  try {
    const { company, date } = req.body;

    // Create a regex pattern for the company name
    comapnyPattern = new RegExp(`^${company}$`, 'i');

    const existingInterview = await Interview.findOne({ company: comapnyPattern })

    if(existingInterview){
      // Company already exists, handle as needed
      req.flash("error", `Company ${company} already exists.`);
      return res.redirect("/");
    }

    //create interview
    const interview = new Interview({
      company,
      date,
    });
    await interview.save();
    // console.log(interview);
    req.flash(
      "success",
      `Exciting News! ${company} Company will be Visiting Campus on ${date}`
    );
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Error in creating interview",
    });
  }
};

// allocation of student to an interview----
module.exports.assignInterview = async (req, res) => {
  try {
    // get interview id from parameter passed to the URL----
    const interviewId = req.params.id;

    const { student, result } = req.body;

    let interview = await Interview.findById(interviewId);

    if (interview) {
      // if interview is found----
      const studentData = await Student.findById(student);

      if (studentData) {
        // if student is found---:)
        // check if student already allocated in interview model
        let alreadyAllocated = await Interview.findOne({
          _id: interviewId,
          "students.student": student,
        });

        if (alreadyAllocated) {
          // if student already allocated in interview
          req.flash(
            "error",
            `${studentData.name} already enrolled in ${interview.company} interview!!`
          );

          return res.redirect("back");
        }
        // if student not allocated in interview
        // add student and result into students array
        interview.students.push({
          student: student,
          result,
        });

        await interview.save();

        //need to assign interview company date and result into interviews array of student model
        let assignedInterview = {
          company: interview.company,
          date: interview.date,
          result: result,
        };

        await studentData.updateOne({
          $push: { interviews: assignedInterview },
        });

        req.flash(
          "success",
          `${studentData.name} enrolled in ${interview.company} interview!!`
        );
        return res.redirect("back");
      }

      req.flash("error", "Student not found!");
      return res.redirect("back");
    }

    req.flash("error", "Interview not found!");
    return res.redirect("back");
  } catch (err) {
    console.log("Error:", err);
    req.flash("error", "Error in enrolling interview!");
  }
};

// deallocation of student to an interview
module.exports.deallocate = async (req, res) => {
  try {
    let studentName;
    const { studentId, interviewId } = req.params;

    //remove student from students array in Interview model
    const interview = await Interview.findById(interviewId);

    if (interview) {
      //remove reference of student in inteview schema
      await Interview.findOneAndUpdate(
        { _id: interviewId },
        {
          $pull: {
            students: {
              student: studentId,
            },
          },
        }
      );

      // remove interview from student's schema using interview's company
      const studentData = await Student.findOne({ _id: studentId });
      if (studentData) {
        studentName = studentData.name;
        //remove student from student's interviews array
        await studentData.updateOne({
          $pull: {
            interviews: {
              company: interview.company,
            },
          },
        });
      }

      //add flash message
      req.flash(
        "success",
        `${studentName} removed from ${interview.company} successfully!`
      );
      return res.redirect("back");
    } else {
      req.flash("error", "Interview not found!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Error in removing student");
    console.log("Error:", err);
  }
};

// updation of result in allocated student
module.exports.updateStudent = async (req, res) => {
  try {
    let studentName;
    const { studentId, interviewId } = req.params;
    const { result } = req.body;

    //find interview by id
    const interview = await Interview.findById(interviewId);

    if (interview) {
      //update interview result of student's schema using interviews comapny
      const student = await Student.findById(studentId);

      if (student && student.interviews.length > 0) {
        studentName = student.name;
        await Interview.updateOne(
          {
            _id: interviewId,
            "students.student": studentId,
          },
          {
            $set: {
              //The positional operator $ is used to update the result field of that specific student.
              "students.$.result": result,
            },
          }
        );

        await Student.updateOne(
          {
            _id: studentId,
            "interviews.company": interview.company,
          },
          {
            $set: {
              "interviews.$.result": result,
            },
          }
        );

        //flash message
        req.flash("success", `${studentName} result updated successfully`);
        return res.json({ success: true });
      } else {
        req.flash("error", "No student found");
        return res.json({ success: false });
      }
    } else {
      req.flash("error", "Interview not found!");
      return res.json({ success: false, message: "Interview not found!" }); // Send a JSON response indicating failure
    }
  } catch (err) {
    req.flash("error", "Error in updating result");
    console.log("Error", err);
    return res.json({ success: false, message: "Error in updating result" }); // Send a JSON response indicating failure
  }
};


module.exports.removeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      req.flash("error", "Interview does not exist");
      return res.status(404).json({ success: false, error: "Interview does not exist" });
    }

    // Remove the interview from the database
    await Interview.deleteOne({ _id: interviewId });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: "Error in unscheduling interview" });
  }
};
