import multer from "multer";
import path from "path";

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, next) => {
    const ext = path.extname(file.originalname);
    const supported = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
    if (!supported.includes(ext)) {
      next(
        new Error(`file type not supported\ntry ${supported} are supported`)
      );
    }
    next(null, true);
  },
});

export const cvMulter = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, next) => {
    const ext = path.extname(file.originalname);
    const supported = [".pdf", ".docs"];
    if (!supported.includes(ext)) {
      next(
        new Error(`file type not supported\ntry ${supported} are supported`)
      );
    }
    next(null, true);
  },
});

// import multer, { Multer } from 'multer';
// import { Request } from 'express';

// const storage = multer.diskStorage({
//     destination: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
//         cb(null, 'uploads/');
//     },
//     filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload: Multer = multer({ storage: storage, fileFilter: (req, file, next) => {
//     const ext = path.extname(file.originalname);
//     const supported = ['.png', '.jpg', '.jpeg', '.webp'];
//     if (!supported.includes(ext)) {
//       next(new Error(`file type not supported\ntry ${supported} are supported`));
//     }
//     next(null, true);
//   }, });

// export default upload;
