const multer = require("multer");

// Configure storage with both buffer and disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      storagePath = "../frontend/src/assets/images/profilePicture";
    } else if (file.fieldname === 'groupPicture') {
      storagePath = "../frontend/src/assets/images/groupPicture";
    } else {
      cb(new Error('Invalid field name'), false);
    }
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const storedFileName = `${file.fieldname}-${uniqueSuffix}.${file.originalname.split(".").pop()}`;
    cb(null, storedFileName);
    req.storedFileName = storedFileName;
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  fileFilter,
});

// Middleware to handle Multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).send({ message: err.message,status:false });
  } else if (err) {
    // Handle custom file filter or other errors
    return res.status(400).send({ message: err.message , status:false });
  }
  next();
};

module.exports = {
  upload,
  handleMulterErrors,
};