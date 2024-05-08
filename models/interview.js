const mongoose = require("mongoose");

// create interview schema
const interviewSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },

      result: {
        type: String,
        enum: ["Pass", "Fail", "Didn't Attempt", "On Hold"],
      },
    },
  ],
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
