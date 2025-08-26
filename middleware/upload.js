const multer = require("multer");
const path = require("path");

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder me save hoga
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
