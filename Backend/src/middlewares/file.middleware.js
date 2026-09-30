const path = require('path');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();

    if (file.mimetype !== 'application/pdf' || extension !== '.pdf') {
      const err = new Error('Only PDF resumes are supported');
      err.status = 400;
      return cb(err);
    }

    cb(null, true);
  }
});

module.exports = upload;
