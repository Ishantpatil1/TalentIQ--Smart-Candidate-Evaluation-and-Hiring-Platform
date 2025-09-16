const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Candidate = require('../models/Candidate.js');
const { parseResume } = require('../utils/resumeParser.js');
const { protect, authorizeRoles } = require('../middleware/authMiddleware.js');

const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ================= Existing Resume Upload ==================
router.post(
  '/upload-resume',
  protect,
  authorizeRoles('candidate'),
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      const filePath = `/uploads/resumes/${req.file.filename}`;
      const parsedData = await parseResume(filePath);

      const candidate = await Candidate.findOneAndUpdate(
        { userId: req.user._id },
        {
          name: req.user.name,
          email: req.user.email,
          resumeUrl: filePath,
          parsedData,
        },
        { new: true, upsert: true }
      );

      res.status(200).json({ success: true, message: 'Resume uploaded & parsed successfully (stored locally)', candidate });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Upload or parsing failed', error: err.message });
    }
  }
);

// ================= New: Get Candidate Profile ==================
router.get(
  '/profile',
  protect,
  authorizeRoles('candidate'),
  async (req, res) => {
    try {
      let candidate = await Candidate.findOne({ userId: req.user._id });

      // If not found → create a minimal profile for this user (so frontend can render safely)
      if (!candidate) {
        candidate = await Candidate.create({
          userId: req.user._id,
          name: req.user.name,
          email: req.user.email,
          education: [],
          skills: [],
          experience: [],
          resumeUrl: null,
          parsedData: { keywords: [], extractedSkills: [], summary: "" }
        });
      }

      return res.json(candidate);
    } catch (err) {
      console.error("Error in GET /profile:", err);
      res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
  }
);

// ================= New: Update Candidate Profile ==================
router.put(
  '/profile',
  protect,
  authorizeRoles('candidate'),
  async (req, res) => {
    try {
      const { education, skills, experience } = req.body;

      const candidate = await Candidate.findOneAndUpdate(
        { userId: req.user._id },
        { education, skills, experience },
        { new: true, upsert: false }
      );

      if (!candidate) return res.status(404).json({ message: 'Profile not found' });

      res.json({ success: true, message: 'Profile updated successfully', candidate });
    } catch (err) {
      res.status(500).json({ message: 'Profile update failed', error: err.message });
    }
  }
);

module.exports = router;
