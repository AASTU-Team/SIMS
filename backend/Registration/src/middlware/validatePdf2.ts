import { body, ValidationChain,validationResult } from 'express-validator';
const fs = require("fs");
import path from "path";

const fileValidator2 = [
    body('file')
      .custom((value, { req }) => {
        if (!req.file) {
          return false;
        }
        return true;
      })
      .withMessage('No file provided')
      .custom((value, { req }) => {
        if (!req.file.originalname.endsWith('.pdf')) {
            fs.unlinkSync(path.join('exports',"enrollments", req.file.filename));
            return false;
         
        }
        return true;
      })
      .withMessage('File must be a PDF')
      .custom((value, { req }) => {
        if (req.file.size > 5 * 1024 * 1024) {
            fs.unlinkSync(path.join('exports',"enrollments", req.file.filename));
            return false;
        }
        return true;
      })
      .withMessage('File size must be less than 5MB'),
    (req: any, res: any, next: any) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const newFileName = `${req.body.id}-enroll.pdf`;
        const oldFilePath = path.join('exports', "withdrawals", req.file.filename);
        const newFilePath = path.join('exports', "withdrawals", newFileName);
        fs.renameSync(oldFilePath, newFilePath);
        return next();
       
      }
      res.status(400).json({ errors: errors.array() });
    },
  ];

module.exports = fileValidator2