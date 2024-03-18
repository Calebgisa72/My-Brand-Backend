import multer, { Multer } from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, 'uploads/'); // Uploads folder
    },
    filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload: Multer = multer({ storage: storage });

export default upload;
