const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  aadhaar: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  fathersName: { type: String, required: true },
  mothersName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Date, required: true },
  course: { type: String, required: true },
  registerNumber: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  department: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  skills: [{ type: String }],
  agreeToTerms: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  profilePic: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);