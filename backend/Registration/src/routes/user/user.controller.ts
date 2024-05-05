import { Request, Response } from "express";
import mongoose from "mongoose";
const assignCourse = require("../../helper/assignFreshmanCourse")
const checkPrerequisite = require("../../helper/checkPrerequisite")
const isCourseTaken = require("../../helper/isCourseTaken")
const getPossibleAddCourses = require("../../helper/getPossibleAddCourses")

const fs = require("fs");
const csv = require("csv-parser");
const Joi = require('joi');

let results: any = [];

const Student = require("../../models/student.model");
const Staff = require("../../models/staff.model");
const Status = require("../../models/status.model");
const Department = require("../../models/department.model");
const Course = require("../../models/course.model");
const Curriculum = require("../../models/curriculum.model");
const Assignment = require("../../models/Assignment.model");
const Registration = require("../../models/registration.model");
const RegistrationStatus = require("../../models/RegistrationStatus.model");

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results: any = [];

  const file: any = req.file;

  // Process the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data: any) => results.push(data))
    .on("end", () => {
      // Remove the temporary file
      fs.unlinkSync(file.path);

      // Do something with the parsed CSV data
      console.log(results);

      // Return a response
      res.json({ message: "File uploaded and processed successfully" });
    })
    .on("error", (error: any) => {
      // Handle any errors
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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
        const data = req.body;


        const newValue = new RegistrationStatus(data);
        newValue.save()
   
   
    res.status(200).json({ message: data });
        
    } catch (error:any) {

        res.status(500).json({ message: error.message });
        
    }
  };

export const registerStudent = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

  export const registerStudentCsv = async(req: Request, res: Response) => {
    const currentYear = new Date().getFullYear();
    const subtractedYear = currentYear - 8;
    const year = subtractedYear % 100;
    
    console.log(year);
    const insertedIds:String[] = [];
    
  


    const department = await Department.findOne({ name: "Freshman" });

    let department_id = ""
    
    if (department) {
      department_id = department._id;
      console.log("department_id:", department_id);
    } else {
      console.log("Department not found");
    }
    
    
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
      const newstudent =   await Student.create({ ...student, id,department_id });
      if(newstudent)
        {
          insertedIds.push(newstudent._id);
       

        }
        else{
          console.log("error")
        }
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
    const registration = await assignCourse(insertedIds);
     console.log(registration);
      //console.log(insertedIds);
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

  export const getStudentProfile = async (req: Request, res: Response) => {
    try {
      const response: any = await fetch("http://localhost:5000/auth/me", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.header("Authorization") as string,
        },
      });
  
      if (response.status === 200) {
        const { email, role } = await response.json();
        const student = await Student.findOne({
          email,
        });
        return res.status(200).json({ "student":student
          
          , "role":role 
  
  
        });
      } else {
        return res.status(401).json({ message: "unAuthorized" });
      }
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  };


  ////get student courses

  export const getStudentCourses = async (req: Request, res: Response) => {

    const student_id = req.body.student_id;
    const courseids:String[] =[]

    const registration = await Registration.find({stud_id: student_id})

    if(!registration)
      {
        return res.status(404).json({message:"Courses Not found"})
      }

      const registrationData:any[] = registration

      registrationData.map(registration=>{

       

        registration.courses.map((course:any)=>{
         // console.log(course)

          if(course.status === 'Active'){

            courseids.push(course.courseID);

          }

        })


      })


      return res.status(200).json({ message: courseids });
  




}


export const studentRegistration = async (req: Request, res: Response) => {
  const student_id = req.body.student_id;

  let department_id = ""
  let newyear = 0
  let newsemester = 0

  const courses:String[]  = []
  const CourseStatus:any[]=[]


  const student = await Student.findById(student_id);

  if(!student) {
    return res.status(404).json({message:"student not found"})

  }
  department_id = student.department_id






  const highestCombination = await Registration
  .findOne({ stud_id: student_id })
  .sort({ year: -1, semester: -1 })
  .select('year semester')
  .limit(1);

if (highestCombination) {
  const highestYear = highestCombination.year;
  const highestSemester = highestCombination.semester;
  //console.log(`Highest combination: Year ${highestYear}, Semester ${highestSemester}`);
 // res.status(200).send(`Highest combination: Year ${highestYear}, Semester ${highestSemester}`)

 const status = await RegistrationStatus.findOne({year:highestYear})
 if(!status)
  {
    return res.status(404).json({message:"Registration data not found"})
  }

  if(!status.status)
    {
      return res.status(400).json({message:"Registration is not active. contact the administrator"})
    }
    if(highestSemester == 1)
      {
        newyear = highestYear
        newsemester = highestSemester + 1
      }
      else{
        newyear = highestYear + 1
        newsemester = 1
      }

      console.log("semister", newsemester)
      console.log("year", newyear)
      console.log("department", department_id)


    const curriculum = await Curriculum.findOne({year:newyear,department_id:department_id})

    if(!curriculum)
      {
        return res.status(404).json({message:"Registration data not found"})
      }


      const allCourses:any[]=curriculum.courses

      console.log("All courses", allCourses)


      allCourses.map((course:any)=>{

        if(course.semester === newsemester)
          {
            courses.push(course.courseId)
          }

       

      })

      for (const course of courses) {

        const status = await checkPrerequisite(course,student_id)
        CourseStatus.push({
          courseId:course,
          status:status
        })


      }


    




      return res.status(200).json({message:CourseStatus})
  


 


} else {
  console.log('No registrations found for the given stud_id');
  res.status(200).send(`error`)
}





}


export const ListAddCourses = async (req: Request, res: Response) => {

 


  res.status(200).send(await getPossibleAddCourses("663618696664a0c0488e0a95",))



}









  