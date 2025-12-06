const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/'));

 },
 filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }

});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG allowed'), false);
  }
};

// Initialize upload

const upload = multer({ storage, fileFilter });

module.exports = upload;