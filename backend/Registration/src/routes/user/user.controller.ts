import { Request,Response } from "express";
import mongoose from "mongoose";
const fs = require('fs');
const csv = require('csv-parser');
const Joi = require('joi');

let results:any = [];

const Student = require('../../models/student.model');
const Staff = require('../../models/staff.model');
const Status = require('../../models/status.model');
const Department = require('../../models/department.model');
const Course = require('../../models/course.model');
const Curriculum = require('../../models/curriculum.model');
const Assignment = require('../../models/Assignment.model');

export const uploadFile = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    
      const results:any = [];
  
      const file:any = req.file
    
      // Process the uploaded CSV file
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data:any) => results.push(data))
        .on('end', () => {
          // Remove the temporary file
          fs.unlinkSync(file.path);
    
          // Do something with the parsed CSV data
          console.log(results);
    
          // Return a response
          res.json({ message: 'File uploaded and processed successfully' });
        })
        .on('error', (error:any) => {
          // Handle any errors
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        });
    

   
  };


export const registerStaff = async(req: Request, res: Response) => {
    // Handle student registration logic here
    

    try {
        const data = req.body;
        //delete data.role;

        console.log("role",req.body.role)


        try {
          const response:any = await fetch("http://localhost:5000/auth/register",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              email:req.body.email,
              role:req.body.role,
             
            

            })

          
            
          })

        
          if(response.status === 201)
            {
              ////////////////////////////////////////////////////
            

              /////////////////////////////////////////////////
              const r = await response.json()
              console.log(r.message)
              delete data.role;
              const newStaff = await new Staff(data);
              await newStaff.save()
              return res.status(201).json({ message: "successfully created staff profile" });
      
            
            }
            else{
              const r = await response.json()
              
              console.log(r.message)
              return res.status(400).json({ message: "An error happend please try again" });
            }
         
          
        }
        catch (error:any) {
          console.log(error.message)
          

          return res.status(500).json({ message: error.message });
       
        }
   
   
        
    } catch (error:any) {

        res.status(500).json({ message: error.message });
        
    }
  };

  export const registerDependency = async(req: Request, res: Response) => {
    // Handle student registration logic here


    try {
       // const data = req.body;

       const currentYear = new Date().getFullYear();
const subtractedYear = currentYear - 8;
const year = subtractedYear % 100;

console.log(year);


       const count = await Student.countDocuments();
console.log(`Total number of documents: ${count}`);
let idPrefix = "ets";
    let id = "";

    if (count < 10) {
      id = `${idPrefix}000${count+1}` +`/${year}`;
    } else if (count < 100) {
      id = `${idPrefix}00${count+1}`+`/${year}` ;
    } else if (count < 1000) {
      id = `${idPrefix}0${count+1}` +`/${year}`;
    } else {
      id = `${idPrefix}${count+1}` +`/${year}`;
    }

   
   
    res.status(200).json({ message: id });
        
    } catch (error:any) {

        res.status(500).json({ message: error.message });
        
    }
  };




export const registerStudent = async(req: Request, res: Response) => {
    // Handle student registration logic here


    

    try {
        const data = req.body;

     /*    const student  = await Student.findOne({Stud_Name: data.Stud_Name});

        if(student)
            {
                res.status(400).json({ message: student.Stud_Name });
                return;
            }
 */

   
     /*    const newStatus = await new Status({status:"Active"})
        await newStatus.save() */
        const currentYear = new Date().getFullYear();
        const subtractedYear = currentYear - 8;
        const year = subtractedYear % 100;
        
        console.log(year);
        
        
               const count = await Student.countDocuments();
        console.log(`Total number of documents: ${count}`);
        let idPrefix = "ets";
            let id:String = "";
        
            if (count < 10) {
              id = `${idPrefix}000${count+1}` +`/${year}`;
            } else if (count < 100) {
              id = `${idPrefix}00${count+1}`+`/${year}` ;
            } else if (count < 1000) {
              id = `${idPrefix}0${count+1}` +`/${year}`;
            } else {
              id = `${idPrefix}${count+1}` +`/${year}`;
            }

   

        try {
          const response:any = await fetch("http://localhost:5000/auth/register",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              email:req.body.email,
              role:["student"],
              id:id
            

            })

          
            
          })

        
          if(response.status === 201)
            {
              ////////////////////////////////////////////////////
            

              /////////////////////////////////////////////////
              const r = await response.json()
              console.log(r.message)
              const newStudent = await new Student({...data,id:id});
              await newStudent.save()
              return res.status(201).json({ message: "successfully created student profile" });
      
            
            }
            else{
              const r = await response.json()
              
              console.log(r.message)
              return res.status(400).json({ message: "An error happend please try again" });
            }
         
          
        }
        catch (error:any) {
          console.log(error.message)
          

          return res.status(500).json({ message: error.message });
       
        }
   
   
        
    } catch (error:any) {

        return res.status(500).json({ message: error.message });
        
    }
  };

  export const registerStudentCsv = async(req: Request, res: Response) => {
    const currentYear = new Date().getFullYear();
    const subtractedYear = currentYear - 8;
    const year = subtractedYear % 100;
    
    console.log(year);
    
    
           const count = await Student.countDocuments();
    console.log(`Total number of documents: ${count}`);
    let idPrefix = "ets";
       

    fs.createReadStream('./students.csv')
  .pipe(csv())
  .on('data', (data:any) => {
    // Process each row of data
    results.push(data);
  })
  .on('end', async() => {
    try {
      // The parsing is complete
      console.log(results);

      const c = await Student.countDocuments();
      let count  = parseInt(c)
      let idPrefix = "ets";
      const emails:String[]=[]

      for (const student of results) {
        // Validate each student object
        emails.push(student.email)
        const { error } = validateStudent(student);
        if (error) {
          console.error('Validation error:', error);
          continue; // Skip this student and move to the next one
          
        }

        // Generate an auto-incrementing ID
        let id:String = "";
    
        if (count < 10) {
          id = `${idPrefix}000${count+1}` +`/${year}`;
        } else if (count < 100) {
          id = `${idPrefix}00${count+1}`+`/${year}` ;
        } else if (count < 1000) {
          id = `${idPrefix}0${count+1}` +`/${year}`;
        } else {
          id = `${idPrefix}${count+1}` +`/${year}`;
        }

        // Insert the student into the database
        await Student.create({ ...student, id });
        ///////////////////////////////////////////////////////////////////////
        try {
          const response:any = await fetch("http://localhost:5000/auth/register",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              email:student.email,
              role:["student"],
              id:id
            

            })

          
            
          })

        
          if(response.status === 201)
            {
              ////////////////////////////////////////////////////
            

              /////////////////////////////////////////////////
              const r = await response.json()
              console.log("created student auth profile")
             // const newStudent = await new Student({...data,id:id});
             // await newStudent.save()
            //  return res.status(201).json({ message: "successfully created student profile" });
      
            
            }
            else{
              const r = await response.json()
              
              console.log(r.message)
              //return res.status(400).json({ message: "An error happend please try again" });
              console.log("unable to create student auth profile")
            }
         
          
        }
        catch (error:any) {
          console.log(error.message)
          

          //return res.status(500).json({ message: error.message });
          console.log("unable to create student auth profile")
       
        }






        ////////////////////////////////////////////////////////////////////

        count++; // Increment the count for the next student
      }

      console.log('Data inserted successfully');
      res.status(200).json({ message: "Data inserted successfully" });
      console.log("emails", emails)
    } catch (error:any) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: error.message });
    }
  })
  .on('error', (error:any) => {
    // Handle any errors that occur during the parsing
    console.error(error);
    res.status(500).json({ message: error.message });
  });
    
  };

  function validateStudent(student: any) {
    const schema = Joi.object({
      email: Joi.string().email(),
      name: Joi.string().regex(/^[A-Za-z\s]+$/),
      //birthday: Joi.date().format('YYYY-MM-DD'),
     // phone: Joi.string().regex(/^\+\d{12}$/).withMessage('Phone number must start with "+" and be followed by 12 digits'),
      gender: Joi.string().valid('MALE', 'FEMALE'),
      department_id: Joi.string().optional(),
      status_id: Joi.string().optional(),
      year: Joi.number().integer(),
      //admission_date: Joi.date().format('YYYY-MM-DD').withMessage('Admission date must be in the format YYYY-MM-DD'),
      //grad_date: Joi.date().format('YYYY-MM-DD').withMessage('Graduation date must be in the format YYYY-MM-DD'),
      contact: Joi.string(),
      address: Joi.string(),
      emergencycontact_name: Joi.string().regex(/^[A-Za-z\s]+$/),
      emergencycontact_relation: Joi.string(),
      phone:Joi.string(),
      birthday: Joi.date(),
      admission_date: Joi.date(),  
      grad_date:Joi.date(),
      //emergencycontact_phone: Joi.string().regex(/^\+\d{12}$/).withMessage('Emergency contact phone number must start with "+" and be followed by 12 digits'),
      emergencycontact_phone: Joi.string()

    });

    return schema.validate(student);
  }

  export const getAllStudent = async(req: Request, res: Response) => {
    // Handle student registration logic here
    

    try {


      const students:any = await Student.find();
      res.status(200).json({ message: students });
       

   

       
   
   
        
    } catch (error:any) {

        return res.status(500).json({ message: error.message });
        
    }
  };

  export const getStudentByDepartment = async(req: Request, res: Response) => {

    const department  = req.body.department_id;
    
    

    try {


      const students:any = await Student.find({department_id:department});
      res.status(200).json({ message: students });
       

   

       
   
   
        
    } catch (error:any) {

        return res.status(500).json({ message: error.message });
        
    }
  };

  export const deleteStudent = async(req: Request, res: Response) => {

    const student  = req.body.student_id;
    const email = req.body.email;
    
    

    try {
      try {
        const response:any = await fetch("http://localhost:5000/auth/delete",{
          method:"Delete",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email:email,
          

          })

        
          
        })

      
        if(response.status === 200)
          {
            const r = await response.json()
            console.log(r.message)
            const deleteduser = await Student.deleteOne({_id:student})
            if(!deleteduser)
              {
                return res.status(404).json({message:"Not found"})
              }
        
        
              return res.status(200).json({message:"success"})
          
          
    
          
          }
          else{
            const r = await response.json()
            
            console.log(r.message)
            return res.status(400).json({ message: "An error happend please try again" });
          }
       
        
      }
      catch (error:any) {
        console.log(error.message)
        

        return res.status(500).json({ message: error.message });
     
      }
 



       

   

       
   
   
        
    } catch (error:any) {

        return res.status(500).json({ message: error.message });
        
    }
  };


  export const updateStudent = async (req: Request, res: Response) => {
    try {
      const documentId = req.query.id;
      const requestData = req.body;
  
      console.log(requestData);
      console.log(documentId);
  
      const updates = await Student.findByIdAndUpdate(documentId, requestData, { new: true }).exec();
      if (!updates) {
        return res.status(500).json({ message: "An error happened" });
      } else {
        console.log('Document updated successfully!');
        return res.status(200).json({ message: updates });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  };







  