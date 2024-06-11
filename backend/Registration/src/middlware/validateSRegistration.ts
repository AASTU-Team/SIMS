const { body, validationResult } = require('express-validator');
import { Request,Response } from "express";


// Validation middleware
const validateSRegistration = [

 
  body('email').isEmail().withMessage('Invalid email address'),
  body('name')
  .matches(/^[A-Za-z\s]+$/)
  .withMessage('Name must contain only letters and whitespace'),
  body('birthday')
  .isDate({ format: 'YYYY-MM-DD' })
  .withMessage('Birthday must be in the format YYYY-MM-DD'),
  body('phone')
  .matches(/^(\+\d{12}|\d{10}|\d{9})$/)
  .withMessage('Phone number must be 10 digits, 9 digits, or start with "+" and be followed by 12 digits'),
  body('gender')
  .isIn(['MALE', 'FEMALE'])
  .withMessage('Gender must be either "male" or "female"'),
  body('department_id')
    .optional()
    .isString()
    .withMessage('Department ID must be a string'),




    body('address')
    .optional()
    .isString()
    .withMessage('address must be a string'),


    



  (req:Request, res:Response, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  },
]

module.exports = validateSRegistration