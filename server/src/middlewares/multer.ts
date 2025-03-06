import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";

interface MulterRequest extends Request {
  storedFileName?: string;
}

// Configure storage with both buffer and disk storage
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let storagePath: string;
    
    if (file.fieldname === "profilePicture") {
      storagePath = path.join(process.cwd(),"/public/assets/userAssets");
    } else if (file.fieldname === "groupPicture") {
      storagePath = path.join(process.cwd(),"/public/assets/groupAssets");
    } else {
      return cb(new Error("Invalid field name"),'');
    }
    cb(null, storagePath);
  },
  filename: (req: MulterRequest, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const storedFileName = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, storedFileName);
    req.storedFileName = storedFileName;
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  fileFilter,
});

// Middleware to handle Multer errors
const handleMulterErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message, status: false });
    return;
  } else if (err) {
    res.status(400).json({ message: err.message, status: false });
    return;
  }
  next();
};

export { upload, handleMulterErrors };