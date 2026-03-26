const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CREATE with file upload
router.post("/", upload.single("profilePic"), async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      dob: req.body.dateOfBirth,
      skills: req.body.skills ? JSON.parse(req.body.skills) : [],
      profilePic: req.file?.filename || null
    };
    delete studentData.dateOfBirth;
    
    const student = new Student(studentData);
    const saved = await student.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePic = req.file.filename;
    }
    updateData.dob = req.body.dateOfBirth;
    updateData.skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    delete updateData.dateOfBirth;
    
    const updated = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;