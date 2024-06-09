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
        if (!req.file.originalname.endsWith('.csv')) {
            fs.unlinkSync(path.join('uploads', req.file.filename));
            return false;
         
        }
        return true;
      })
      .withMessage('File must be a Csv')
      .custom((value, { req }) => {
        if (req.file.size > 5 * 1024 * 1024) {
            fs.unlinkSync(path.join('uploads', req.file.filename));
            return false;
        }
        return true;
      })
      .withMessage('File size must be less than 5MB'),
    (req: Request, res: any, next: any) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      res.status(400).json({ errors: errors.array() });
    },
  ];

module.exports = fileValidator2