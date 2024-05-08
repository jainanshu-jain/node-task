const mongoose = require("mongoose");

//setting up student Schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    college: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    placement_status: {
      type: String,
      enum: ["placed", "not_placed"],
      required: true,
    },

    courseScores: {
      dsaFinalScore: {
        type: Number,
        required: true,
      },

      webDFinalScore: {
        type: Number,
        required: true,
      },

      reactFinalScore: {
        type: Number,
        required: true,
      },
    },

    interviews: [
      {
        company: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        result: {
          type: String,
          enum: ["Pass", "Fail", "Didn't Attempt", "On Hold"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
