const { body, validationResult } = require('express-validator');
import { Request,Response } from "express";


// Validation middleware
const validateRegistration = [
   /*  body('id')
    
    .isString()
    .withMessage(' ID must be a string'), */
 
  body('email').isEmail().withMessage('Invalid email address'),
  body('name')
  .matches(/^[A-Za-z\s]+$/)
  .withMessage('Name must contain only letters and whitespace'),
  body('birthday')
  .isDate({ format: 'YYYY-MM-DD' })
  .withMessage('Birthday must be in the format YYYY-MM-DD'),
  body('phone')
  .matches(/^(\+\d{12}|\d{10})$/)
  .withMessage('Phone number must be 10 digits or start with "+" and be followed by 12 digits'),
  body('gender')
  .isIn(['MALE', 'FEMALE'])
  .withMessage('Gender must be either "male" or "female"'),
  body('department_id')
    .optional()
    .isString()
    .withMessage('Department ID must be a string'),

 body('status')
    .optional()
    .isString()
    .withMessage('Starus ID must be a string'),

 body('year')
    .isNumeric()
    .withMessage('year must be a number'),

    body('admission_date')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('addmission date must be in the format YYYY-MM-DD'),

    body('grad_date')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('graduation date must be in the format YYYY-MM-DD'),

    body('contact')
   
    .isString()
    .withMessage('contact must be a string'),

    body('address')
   
    .isString()
    .withMessage('address must be a string'),

    body('emergencycontact_name')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name must contain only letters and whitespace'),

    body('emergencycontact_relation')
   
    .isString()
    .withMessage(' must be a string'),

    body('emergencycontact_phone')
  .matches(/^\+\d{12}$/)
  .withMessage('Phone number must start with "+" and be followed by 12 digits'),

    



  (req:Request, res:Response, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  },
]

module.exports = validateRegistration