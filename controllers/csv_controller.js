const { createObjectCsvWriter } = require("csv-writer");
const Student = require("../models/student");
const fs = require("fs");
const path = require("path");

module.exports.downloadCSV = async (req, res) => {
  try {
    // Get all students from the Student model----
    const students = await Student.find();

    // Define the file path to save the CSV file-----
    const filePath = path.join(__dirname, "..", "public", "students.csv");
    const directoryPath = path.dirname(filePath);

    // Create the public folder if it doesn't exist-----
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Create a CSV writer -----
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "college", title: "College" },
        { id: "batch", title: "Batch" },
        { id: "placement_status", title: "Status" },
        { id: "dsaFinalScore", title: "DSA_Final_Score" },
        { id: "webDFinalScore", title: "WebD_Final_Score" },
        { id: "reactFinalScore", title: "React_Final_Score" },
        { id: "company", title: "Company" },
        { id: "date", title: "Date" },
        { id: "result", title: "Result" },
      ],
    });

    // Map student data to CSV records-------
    const records = [];
    students.forEach((student) => {
      if (student.interviews.length === 0) {
        const record = {
          name: student.name,
          email: student.email,
          college: student.college,
          batch: student.batch,
          placement_status: student.placement_status,
          dsaFinalScore: student.courseScores.dsaFinalScore,
          webDFinalScore: student.courseScores.webDFinalScore,
          reactFinalScore: student.courseScores.reactFinalScore,
          company: "NA",
          date: "NA",
          result: "NA",
        };
        records.push(record);
      } else {
        if (student.interviews.length > 0) {
          student.interviews.forEach((interview) => {
            const record = {
              name: student.name,
              email: student.email,
              college: student.college,
              batch: student.batch,
              placement_status: student.placement_status,
              dsaFinalScore: student.courseScores.dsaFinalScore,
              webDFinalScore: student.courseScores.webDFinalScore,
              reactFinalScore: student.courseScores.reactFinalScore,
              company: interview.company,
              date: interview.date.toLocaleDateString("en-GB"),
              result: interview.result,
            };
            records.push(record);
          });
        }
      }
    });

    // Write the records to the CSV file---
    await csvWriter.writeRecords(records);

    // Set the response headers for file download---
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=students.csv");

    // Stream the CSV file to the response----
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Failed to download CSV:", error);
    req.flash("error", "Failed to download CSV");
    return res.redirect("back");
  }
};
