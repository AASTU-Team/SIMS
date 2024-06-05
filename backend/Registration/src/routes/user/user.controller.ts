import { response } from "app";
import { Request, Response } from "express";
import { any } from "joi";
import mongoose, { Mongoose } from "mongoose";

//const assignCourse = require("../../helper/assignFreshmanCourse");
const assignCourse = require("../../helper/assignCourse");
const deleteCsv = require("../../helper/deleteCsv");
const checkPrerequisite = require("../../helper/checkPrerequisite");
const isCourseTaken = require("../../helper/isCourseTaken");
const getPossibleAddCourses = require("../../helper/getPossibleAddCourses");
async function getCredit(Id: String): Promise<any> {
  const course = await Course.findById(Id);
  if (!course) {
    //console.error("Course not found");
    return 0;
  }
  // console.log(parseInt(course.credits));

  return parseInt(course.credits);
}

const fs = require("fs");
const https = require("https");
const csv = require("csv-parser");
const Csv = require("csv-stringify");
const Json2csvParser = require("json2csv").Parser;

const Joi = require("joi");

let results: any = [];

const Student = require("../../models/student.model");
const Staff = require("../../models/staff.model");
const Status = require("../../models/status.model");
const Department = require("../../models/department.model");
const Course = require("../../models/course.model");
const AddDrop = require("../../models/addDrop.model");
const Curriculum = require("../../models/curriculum.model");
const Assignment = require("../../models/Assignment.model");
const NumberOfStudent = require("../../models/numberOfStudent.model");
const incStudentNumber = require("../../helper/incStudentNumber");

const Registration = require("../../models/registration.model");
const RegistrationStatus = require("../../models/RegistrationStatus.model");
const Withdrawal = require("../../models/Withdrawal.model")

import path from "path";

export const UploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results: any = [];

  const file: any = req.file;
  console.log(file);

  // Process the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data: any) => {
      console.log(data);
      results.push(data);
    })
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

export const registerStaff = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const data = req.body;
    //delete data.role;

    console.log("role", req.body.role);

    try {
      const response: any = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: req.body.email,
          role: req.body.role,
        }),
      });

      if (response.status === 201) {
        ////////////////////////////////////////////////////

        /////////////////////////////////////////////////
        const r = await response.json();
        console.log(r.message);
        delete data.role;
        const newStaff = await new Staff(data);
        await newStaff.save();
        return res
          .status(201)
          .json({ message: "successfully created staff profile" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ message: error.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerDependency = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const data = req.body;

    await Registration.deleteMany({});

    res.status(200).json({ message: data });
  } catch (error: any) {
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
    // console.log(data)
    const currentYear = new Date().getFullYear();
    const subtractedYear = currentYear - 8;
    const year = subtractedYear % 100;

    // console.log(year);

    const count = await Student.countDocuments();
    console.log(`Total number of documents: ${count}`);
    let idPrefix = "ets";
    let id: String = "";

    if (count < 10) {
      id = `${idPrefix}000${count + 1}` + `/${year}`;
    } else if (count < 100) {
      id = `${idPrefix}00${count + 1}` + `/${year}`;
    } else if (count < 1000) {
      id = `${idPrefix}0${count + 1}` + `/${year}`;
    } else {
      id = `${idPrefix}${count + 1}` + `/${year}`;
    }

    try {
      const response: any = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: req.body.email,
          role: ["student"],
          id: id,
        }),
      });

      if (response.status === 201) {
     /*    const department = await Department.findOne({ name: data.department });

         let department_id = "";

         if (department) {
           department_id = department._id;
           console.log("department_id:", department_id);
       } else {
           console.log("Department not found");
         } */
        const r = await response.json();
        console.log(r.message);
        const newStudent = await new Student({
          ...data,
          id: id,
        //  department_id: department_id,
        });
        await newStudent.save();
        const insertedIds: String[] = [];
        const insertedStudents: any[] = [];
        insertedIds.push(newStudent._id);
        insertedStudents.push({
          id: newStudent._id,

          department: data.department,
          type: data.type,
        });
        console.log(data.type);

        //if(data.type =="Undergraduate")
        //  {
        // const registration = await assignCourse(insertedIds);
        // console.log("registration", registration);

        // }
        // else if(data.type =="Masters")
        //  {
          ///////Reeeeeeeeeeeeeegistration///////////
        /* const registration = await assignCourse(insertedStudents);
        console.log("registration", registration); */

        // }

        return res
          .status(201)
          .json({ message: "successfully created student profile" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({
        message: "unable to create student profile! Please try again later",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const registerStudentCsv = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (path.extname(req.file.filename).toLowerCase() !== ".csv") {
    await deleteCsv(req.file.path);
    return res
      .status(400)
      .json({ error: "The uploaded file is not a CSV file" });
  }

  // Check the file size
  if (req.file.size > MAX_FILE_SIZE) {
    await deleteCsv(req.file.path);
    return res.status(400).json({
      error: `The uploaded file exceeds the maximum size of ${
        MAX_FILE_SIZE / (1024 * 1024)
      } MB`,
    });
  }

  const currentYear = new Date().getFullYear();
  const subtractedYear = currentYear - 8;
  const year = subtractedYear % 100;

  console.log(year);
  const insertedIds: String[] = [];
  const insertedStudents: any[] = [];
  const errors: String[] = [];

  /*  const department = await Department.findOne({ name: "Freshman" });

  let department_id = "";

  if (department) {
    department_id = department._id;
    console.log("department_id:", department_id);
  } else {
    console.log("Department not found");
    errors.push("Freshman department not found");
  } */

  const count = await Student.countDocuments();
  console.log(`Total number of documents: ${count}`);
  let idPrefix = "ets";

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data: any) => {
      // Process each row of data
      results.push(data);
    })
    .on("end", async () => {
      try {
        // The parsing is complete
        console.log(results);

        const c = await Student.countDocuments();
        let count = parseInt(c);
        let idPrefix = "ets";
        const emails: String[] = [];

        for (const student of results) {
          // Validate each student object
          emails.push(student.email);
          const { error } = validateStudent(student);
          if (error) {
            console.error("Validation error:", error);
            errors.push(
              error.details[0].message + "for student " + student.name
            );
            continue; // Skip this student and move to the next one
          }

          // Generate an auto-incrementing ID
          let id: String = "";

          if (count < 10) {
            id = `${idPrefix}000${count + 1}` + `/${year}`;
          } else if (count < 100) {
            id = `${idPrefix}00${count + 1}` + `/${year}`;
          } else if (count < 1000) {
            id = `${idPrefix}0${count + 1}` + `/${year}`;
          } else {
            id = `${idPrefix}${count + 1}` + `/${year}`;
          }
          const department = await Department.findOne({
            name: student.department,
          });

          let department_id = "";

          if (department) {
            department_id = department._id;
            console.log("department_id:", department_id);
          } else {
            console.log("Department not found");
            errors.push(" department not found");
          }

          // Insert the student into the database
          // delete student.department
          const newstudent = await Student.create({
            ...student,
            id,
            department_id,
          });
          if (newstudent) {
            // <<<<<<< Refacto_Reg_sec
            //             if (student.type === "Undergraduate") {
            //               insertedIds.push(newstudent._id);
            //               const registration = await assignCourse(insertedIds);
            //               if (!registration) {
            //                 errors.push(
            //                   "Registration failed for student " + newstudent.name
            //                 );
            //               }
            //             } else if (student.type === "Masters") {
            //               insertedStudents.push({
            //                 id: newstudent._id,
            //                 department: student.department,
            //               });
            //               // const theStudent =
            //               const registration = await assignMastersCourse(insertedStudents);
            //               if (!registration) {
            //                 errors.push(
            //                   "Registration failed for student " + newstudent.name
            //                 );
            //               }
            //               console.log("registration master", registration);
            //             }
            // =======

            insertedStudents.push({
              id: newstudent._id,
              department: student.department,
              type: student.type,
            });
            // const theStudent =
            const registration = await assignCourse(insertedStudents);
            if (!registration || registration.length === 0) {
              errors.push("Registration failed for student " + newstudent.name);
            }
            console.log("registration", registration);

            // >>>>>>> main
          } else {
            console.log("error");
          }
          ///////////////////////////////////////////////////////////////////////
          try {
            const response: any = await fetch(
              "http://localhost:5000/auth/register",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: student.email,
                  role: ["student"],
                  id: id,
                }),
              }
            );

            if (response.status === 201) {
              ////////////////////////////////////////////////////

              /////////////////////////////////////////////////
              const r = await response.json();
              console.log("created student auth profile");
              // const newStudent = await new Student({...data,id:id});
              // await newStudent.save()
              //  return res.status(201).json({ message: "successfully created student profile" });
            } else {
              const r = await response.json();

              console.log(r.message);
              //return res.status(400).json({ message: "An error happend please try again" });
              console.log("unable to create student auth profile");
              errors.push(
                "unable to create student auth profile" +
                  "for student" +
                  student.name
              );
            }
          } catch (error: any) {
            console.log(error.message);
            errors.push(
              "unable to create student auth profile" +
                "for student" +
                student.name
            );

            //return res.status(500).json({ message: error.message });
            console.log("unable to create student auth profile");
          }

          ////////////////////////////////////////////////////////////////////'

          insertedIds.splice(0, insertedIds.length);
          insertedStudents.splice(0, insertedStudents.length);

          count++; // Increment the count for the next student
        }

        console.log("Data inserted successfully");
        // const registration = await assignCourse(insertedIds);
        // console.log(registration);
        //console.log(insertedIds);

        res
          .status(200)
          .json({ message: "Data inserted successfully", errors: errors });
        console.log("emails", emails);
      } catch (error: any) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: error.message });
      }
    })
    .on("error", (error: any) => {
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
    gender: Joi.string().valid("MALE", "FEMALE"),
    department: Joi.string().optional(),
    type: Joi.string().optional(),
    status: Joi.string().optional(),
    year: Joi.number().integer(),
    //admission_date: Joi.date().format('YYYY-MM-DD').withMessage('Admission date must be in the format YYYY-MM-DD'),
    //grad_date: Joi.date().format('YYYY-MM-DD').withMessage('Graduation date must be in the format YYYY-MM-DD'),
    contact: Joi.string(),
    address: Joi.string(),
    emergencycontact_name: Joi.string().regex(/^[A-Za-z\s]+$/),
    emergencycontact_relation: Joi.string(),
    phone: Joi.string().regex(/^(\+\d{12}|\d{10})$/),
    birthday: Joi.date(),
    admission_date: Joi.date(),
    grad_date: Joi.date(),
    //emergencycontact_phone: Joi.string().regex(/^\+\d{12}$/).withMessage('Emergency contact phone number must start with "+" and be followed by 12 digits'),
    emergencycontact_phone: Joi.string().regex(/^(\+\d{12}|\d{10})$/),
  });

  return schema.validate(student);
}

export const getAllStudent = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const students = await Student.find().populate("department_id");
    const myStudents = students.map((student: any) => {
      return {
        ...student.toObject(),
        department_name: student.department_id?.name,
        department_id: student.department_id?._id,
      };
    });
    // console.log(myStudents);

    res.status(200).json({ message: myStudents });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportAllStudent = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const students = await Student.find()  .populate({
      path: "department_id",
      select: "name",
    })
    const myStudents = students.map((student: any) => {
      return {
        ...student.toObject(),
        department_name: student.department_id?.name,
        department_id: student.department_id?._id,
      };
    });
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(myStudents);
    const filePath = path.join("./exports", "students.csv");
    
    fs.writeFile(filePath, csvData, function (error: any) {
      if (error) throw error;
      console.log("Write to csv was successfull!");
    });
    
    // Read the CSV file contents
    fs.readFile(filePath, (err:any, data:any) => {
      if (err) {
        console.error("Error reading CSV file:", err);
        res.status(500).json({ error: "Error exporting data" });
        return;
      }
    
      // Create a Blob object from the CSV data
      const blob = new Blob([data], { type: "text/csv" });
    
      // Set the necessary headers to trigger a download
      res.setHeader("Content-Disposition", "attachment; filename=students.csv");
      res.setHeader("Content-Type", "text/csv");
      const file = path.join(
      __dirname,
      "..",
      "..",
      "..",

      "exports",
      "students.csv"
    );
    console.log(__dirname);
    res.download(file);
    
      // Send the Blob in the response
      // res.status(200).send({data:blob});
    });;

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllStaff = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const staffs: any = await Staff.find().populate("department_id");
    const myStaff = staffs.map((staff: any) => {
      return {
        ...staff.toObject(),
        department_name: staff.department_id?.name,
      };
    });
    res.status(200).json({ message: myStaff });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getStaffByDepId = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const staffs: any = await Staff.find({ department_id: id });
    res.status(200).json({ message: "success", data: staffs });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const exportAllStaff = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const staffs: any = await Staff.find().populate("department_id");
    const myStaff = staffs.map((staff: any) => {
      return {
        ...staff.toObject(),
        department_name: staff.department_id?.name,
      };
    });
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(myStaff);
    const filePath = path.join("./exports", "staffs.csv");
    
    fs.writeFile(filePath, csvData, function (error: any) {
      if (error) throw error;
      console.log("Write to csv was successfull!");
    });
    
    // Read the CSV file contents
    fs.readFile(filePath, (err:any, data:any) => {
      if (err) {
        console.error("Error reading CSV file:", err);
        res.status(500).json({ error: "Error exporting data" });
        return;
      }
    
      // Create a Blob object from the CSV data
      const blob = new Blob([data], { type: "text/csv" });
    
      // Set the necessary headers to trigger a download
      res.setHeader("Content-Disposition", "attachment; filename=students.csv");
      res.setHeader("Content-Type", "text/csv");
      const file = path.join(
      __dirname,
      "..",
      "..",
      "..",

      "exports",
      "staffs.csv"
    );
    console.log(__dirname);
    res.download(file);
    
      // Send the Blob in the response
      // res.status(200).send({data:blob});
    });;

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* export const exportAllStaff = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const staffs: any = await Staff.find().populate("department_id");
    const myStaff = staffs.map((staff: any) => {
      return {
        ...staff.toObject(),
        department_name: staff.department_id?.name,
      };
    });
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(myStaff);
    const filePath = path.join("./exports", "staffs.csv");

    fs.writeFile(filePath, csvData, function (error: any) {
      if (error) throw error;
      console.log("Write to csv was successfull!");
    });
    // Get the path to the CSV file on the server
    const csvFilePath = path.join("./exports", "staffs.csv");

    // Set the path to the downloads folder
    const downloadsPath = path.join(
      require("os").homedir(),
      "Downloads",
      "staffs.csv"
    );

    // Create a read stream for the CSV file
    const readStream = fs.createReadStream(csvFilePath);

    // Create a write stream to the downloads folder
    const writeStream = fs.createWriteStream(downloadsPath);

    // Pipe the read stream to the write stream
    readStream.pipe(writeStream);

    // Set the necessary headers to trigger a download
    await writeStream.on("open", () => {
      res.setHeader("Content-Disposition", "attachment; filename=staffs.csv");
      res.setHeader("Content-Type", "text/csv");
      res.status(200).json({ message: "successfully exported" });
    });

    console.log("Data exported to staffs.csv");
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}; */

export const getStudentByDepartment = async (req: Request, res: Response) => {
  const department = req.body.department_id;

  try {
    const students: any = await Student.find({ department_id: department });
    res.status(200).json({ message: students });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getStaffByDepartment = async (req: Request, res: Response) => {
  const department = req.body.department_id;

  try {
    const staffs: any = await Staff.find({ department_id: department });
    res.status(200).json({ message: staffs });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const student = req.body.student_id;
  const email = req.body.email;

  try {
    try {
      const response: any = await fetch("http://localhost:5000/auth/delete", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.status === 200) {
        const r = await response.json();
        console.log(r.message);
        const deleteduser = await Student.deleteOne({ _id: student });
        if (!deleteduser) {
          return res.status(404).json({ message: "Not found" });
        }

        return res.status(200).json({ message: "success" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ message: error.message });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteStaff = async (req: Request, res: Response) => {
  const staff = req.body.staff_id;
  const email = req.body.email;

  try {
    try {
      const response: any = await fetch("http://localhost:5000/auth/delete", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.status === 200) {
        const r = await response.json();
        console.log(r.message);
        const deleteduser = await Staff.deleteOne({ _id: staff });
        if (!deleteduser) {
          return res.status(404).json({ message: "Not found" });
        }

        return res.status(200).json({ message: "success" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ message: error.message });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  //const staff = req.body.staff_id;
  const email = req.body.email;

  try {
    try {
      const response: any = await fetch(
        "http://localhost:5000/auth/deactivate",
        {
          method: "patch",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (response.status === 200) {
        const r = await response.json();
        console.log(r.message);

        return res.status(200).json({ message: "success" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ message: error.message });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  //const staff = req.body.staff_id;
  const email = req.body.email;

  try {
    try {
      const response: any = await fetch(
        "http://localhost:5000/auth/activate",
        {
          method: "patch",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (response.status === 200) {
        const r = await response.json();
        console.log(r.message);

        return res.status(200).json({ message: "success" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ message: error.message });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const documentId = req.query.id;
    const requestData = req.body;

    console.log(requestData);
    console.log(documentId);

    const updates = await Student.findByIdAndUpdate(documentId, requestData, {
      new: true,
    }).exec();
    if (!updates) {
      return res.status(500).json({ message: "An error happened" });
    } else {
      console.log("Document updated successfully!");
      return res.status(200).json({ message: updates });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const documentId = req.query.id;
    const requestData = req.body;

    console.log(requestData);
    console.log(documentId);

    const updates = await Staff.findByIdAndUpdate(documentId, requestData, {
      new: true,
    }).exec();
    if (!updates) {
      return res.status(500).json({ message: "An error happened" });
    } else {
      console.log("Document updated successfully!");
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
      let user;
      if (role.includes("student")) {
        user = await Student.findOne({
          email,
        });
      } else {
        user = await Staff.findOne({
          email,
        });
      }
      return res.status(200).json({
        user: user,
        role: role,
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
  const { student_id } = req.params;
  const courseids: String[] = [];

  const registration = await Registration.find({
    stud_id: student_id,
  }).populate({
    path: "courses.courseID",
    select: "code name credits lec lab description ",
  });

  if (!registration.length) {
    return res.status(404).json({ message: "Courses Not found" });
  }
  console.log(registration);
  const registrationData: any[] = registration;

  registrationData.map((registration) => {
    registration.courses.map((course: any) => {
      // console.log(course)
      if (course.status === "Active") {
        courseids.push(course.courseID);
      }
    });
  });

  return res.status(200).json({ message: courseids });
};
export const getstudentRegistrationCourses = async (
  req: Request,
  res: Response
) => {
  const student_id = req.body.student_id;

  let department_id = "";
  let type = "";
  let newyear = 0;
  let newsemester = 0;

  const courses: String[] = [];
  const CourseStatus: any[] = [];
  const regCourses: any[] = [];
  const total_credit: Number[] = [];

  const student = await Student.findById(student_id);

  const highestYear =  student.year
  const highestSemester =  student.semester


  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }
  department_id = student.department_id;
  type = student.type;

/*   const highestCombination = await Registration.findOne({ stud_id: student_id })
    .sort({ year: -1, semester: -1 })
    .select("year semester")
    .limit(1); */

 // if (highestCombination) {
   // const highestYear = highestCombination.year;
    //const highestSemester = highestCombination.semester;
    //console.log(`Highest combination: Year ${highestYear}, Semester ${highestSemester}`);
    // res.status(200).send(`Highest combination: Year ${highestYear}, Semester ${highestSemester}`)

  /*   const status = await RegistrationStatus.findOne({ year: highestYear,semester:highestSemester,type:student.type });
    if (!status) {
      return res.status(404).json({ message: "Registration data not found" });
    } 

    if (!status.status) {
      return res.status(400).json({
        message: false,
      });
    } */

  /*   if (highestSemester == 1) {
      newyear = highestYear;
      newsemester = highestSemester + 1;
    } else {
      newyear = highestYear + 1;
      newsemester = 1;
    } */

    console.log("semister", highestSemester);
    console.log("year",highestYear);
    console.log("department", department_id);

    const curriculum = await Curriculum.findOne({
      year: highestYear,
      semester: highestSemester,
      department_id: department_id,
      type: type,
    });

    if (!curriculum) {
      return res.status(404).json({ message: "Registration data not found" });
    }

    const allCourses: any[] = curriculum.courses;

    console.log("All courses", allCourses);

    allCourses.map((course: any) => {
      // if (course.semester === newsemester) {
      courses.push(course);
      // }
    });

    for (const course of courses) {
      let coursePreq: any[] = [];
      const status = await checkPrerequisite(course, student_id);
      CourseStatus.push({
        courseId: course,
        status: status,
      });
      if (status) {
        const prerequisites: any[] = [];
        const Thecourse = await Course.findById(course);
        if (!Thecourse) {
          console.log("Course not found");
        }
        if (Thecourse.prerequisites) {
          const Theprerequisites: any[] = Thecourse.prerequisites;

          const prerequisitePromises = Theprerequisites.map(
            async (prerequisite: any) => {
              const prerequisiteCourse = await Course.findById(prerequisite);
              return prerequisiteCourse.name;
            }
          );

          const prerequisites = await Promise.all(prerequisitePromises);
          coursePreq = prerequisites;
        }

        regCourses.push({
          courseID: course,
          name: Thecourse.name,
          code: Thecourse.code,
          credit: Thecourse.credits,
          lec: Thecourse?.lec,
          lab: Thecourse?.lab,
          tut: Thecourse?.tut,
          hs: Thecourse?.hs,
          prerequisites: coursePreq,
        });
        const value = await getCredit(course);
        total_credit.push(value);
      //}
    }
    let sum: number = 0;
    total_credit.map((credit: any) => {
      sum += credit;
    });
    /*  const registration = await new Registration({
      stud_id: student_id,
      year: newyear,
      semester: newsemester,
      courses: regCourses,
      registration_date: new Date(),
      total_credit: sum,
      status:"Pending"
    });

    try {
      const savedRegistration = await registration.save();
      console.log("Registration saved successfully:", savedRegistration);
    } catch (error) {
      console.error("Error saving registration:", error);
    } */

  
  } 
  return res.status(200).json({ message: regCourses });
};

export const studentRegistration = async (req: Request, res: Response) => {
  const student_id = req.body.student_id;

  let department_id = "";
  let type = "";
  let newyear = 0;
  let newsemester = 0;

  const courses: String[] = [];
  const CourseStatus: any[] = [];
  const regCourses: any[] = [];
  const total_credit: Number[] = [];

  const student = await Student.findById(student_id);

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }
  department_id = student.department_id;
  type = student.type;

  const highestCombination = await Registration.findOne({ stud_id: student_id })
    .sort({ year: -1, semester: -1 })
    .select("year semester")
    .limit(1);

  if (highestCombination) {
    const highestYear = highestCombination.year;
    const highestSemester = highestCombination.semester;
    //console.log(`Highest combination: Year ${highestYear}, Semester ${highestSemester}`);
    // res.status(200).send(`Highest combination: Year ${highestYear}, Semester ${highestSemester}`)

    const status = await RegistrationStatus.findOne({ year: highestYear });
    if (!status) {
      return res.status(404).json({ message: "Registration data not found" });
    }

    if (!status.status) {
      return res.status(400).json({
        message: "Registration is not active. contact the administrator",
      });
    }
    if (highestSemester == 1) {
      newyear = highestYear;
      newsemester = highestSemester + 1;
    } else {
      newyear = highestYear + 1;
      newsemester = 1;
    }

    console.log("semister", newsemester);
    console.log("year", newyear);
    console.log("department", department_id);

    const curriculum = await Curriculum.findOne({
      year: newyear,
      semester: newsemester,
      department_id: department_id,
      type: type,
    });

    if (!curriculum) {
      return res.status(404).json({ message: "Registration data not found" });
    }

    const allCourses: any[] = curriculum.courses;

    console.log("All courses", allCourses);

    allCourses.map((course: any) => {
      // if (course.semester === newsemester) {
      courses.push(course);
      // }
    });

    for (const course of courses) {
      const status = await checkPrerequisite(course, student_id);
      CourseStatus.push({
        courseId: course,
        status: status,
      });
      if (status) {
        regCourses.push({
          courseID: course,
          grade: "",
          status: "Active",
          isRetake: false,
        });
        const value = await getCredit(course);
        total_credit.push(value);
      }
    }
    let sum: number = 0;
    total_credit.map((credit: any) => {
      sum += credit;
    });
    const registration = await new Registration({
      stud_id: student_id,
      year: newyear,
      semester: newsemester,
      courses: regCourses,
      registration_date: new Date(),
      total_credit: sum,
      status: "Student",
    });

    try {
      const savedRegistration = await registration.save();
      console.log("Registration saved successfully:", savedRegistration);
    } catch (error) {
      console.error("Error saving registration:", error);
    }

    return res.status(200).json({
      message: "Registerd successfully! please wait for confirmation",
    });
  } else {
    console.log("No registrations found for the given stud_id");
    res.status(200).send(`error`);
  }
};

export const getDepartmentRegistrationStatus = async (
  req: Request,
  res: Response
) => {
  const department = req.body.department;
  const ids: any[] = [];
  const pendingIds: any[] = [];
  const pendingStudents: any[] = [];
  const registrationStatuses: any[] = [];

  const students = await Student.find({ department_id: department });

  if (!students) {
    return res.status(404).json({ message: "students not found" });
  }
  students.map((student: any) => {

    ids.push(student._id);
  });

  for (const id of ids) {
    const registrations = await Registration.findOne({
      $or: [
        { status: "Student",stud_id:id },
        { 
          stud_id:id,
          status: "Rejected",
          "rejections.by": "Registrar"
        },
      ],
    })
    .populate({
      path: "stud_id",
      select: "name",
    })
    if (!registrations) {
      continue;
    }
    pendingIds.push(registrations.stud_id);
    registrationStatuses.push(registrations);
  }
  if (pendingIds.length == 0) {
    return res.status(200).json({ message: "No pending registrations" });
  }

  for (const id of pendingIds) {
    const student = await Student.findById(id);
    pendingStudents.push(student);
  }

  return res.json({ registrations:registrationStatuses,students: pendingStudents });
};

export const confirmDepartmentRegistration = async (
  req: Request,
  res: Response
) => {
  const department = req.body.department;
  const isAll = req.body.isAll;
  const data = req.body.data;

  const ids: any[] = [];
  const errors: any[] = [];
  const success: any[] = [];

  if (isAll == true) {
    const students = await Student.find({ department_id: department });

    if (!students) {
      return res.status(404).json({ message: "students not found" });
    }
    students.map((student: any) => {
      ids.push(student._id);
    });

    for (const id of ids) {
      // console.log(id)
      try {
        const registration = await Registration.findOne({
          stud_id: id,
          status: "Student",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Department";
          await registration.save();
          success.push(`updated student ${id}`);
        } else {
          errors.push(`can't find student ${id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id}: ${error}`);
        errors.push(`can't update student ${id}`);
      }
    }
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  } else {
    /*  const students = await Student.find({department_id:department})


      if (!students) {
        return res.status(404).json({ message: "students not found" });
      }
      students.map((student:any) =>
        {
          ids.push(student._id)
    
        }) */

    for (const id of data) {
      // console.log(id)
      try {
        const registration = await Registration.findOne({
          stud_id: id,
          status: "Student",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Department";
          await registration.save();
          success.push(`updated student ${id}`);
        } else {
          errors.push(`can't find student ${id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id}: ${error}`);
        errors.push(`can't update student ${id}`);
      }
    }
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  }
};


export const rejectDepartmentRegistration = async (
  req: Request,
  res: Response
) => {
  const department = req.body.department;
  const isAll = req.body.isAll;
  const data = req.body.data;

  const ids: any[] = [];
  const errors: any[] = [];
  const success: any[] = [];

  if (isAll == true) {
    const students = await Student.find({ department_id: department });

    if (!students) {
      return res.status(404).json({ message: "students not found" });
    }
    students.map((student: any) => {
      ids.push(student._id);
    });

    for (const id of ids) {
      // console.log(id)
      try {
        const registration = await Registration.findOne({
          stud_id: id,
          status: "Student",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Rejected";
          registration.rejections = {
            "by": "Department",
            "reason": id.reason
          },
          await registration.save();
          success.push(`updated student ${id.id}`);
        } else {
          errors.push(`can't find student ${id.id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id.id}: ${error}`);
        errors.push(`can't update student ${id.id}`);
      }
    }
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  } else {
   

    for (const id of data) {
      // console.log(id)
      try {
        const registration = await Registration.findOne({
          stud_id: id,
          status: "Student",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Rejected";
          registration.rejections = {
            "by": "Department",
            "reason": id.reason
          }
          await registration.save();
          success.push(`updated student ${id.id}`);
        } else {
          errors.push(`can't find student ${id.id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id.id}: ${error}`);
        errors.push(`can't update student ${id.id}`);
      }
    }
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  }
};



export const getRegistrarRegistrationStatus = async (
  req: Request,
  res: Response
) => {
  const department = req.body.department;
  const ids: any[] = [];
  const pendingIds: any[] = [];
  const pendingStudents: any[] = [];
  const registrationStatuses: any[] = [];


  
    const registrations = await Registration.find({
     
      status: "Department",
    })
    .populate({
      path: "stud_id",
      select: "name",
    })
    registrations.map((registration:any )=>{
      pendingIds.push(registration.stud_id);

    })


  
  
    registrationStatuses.push(registrations);
  
  if (pendingIds.length == 0) {
    return res.status(200).json({ message: "No pending registrations" });
  }

  for (const id of pendingIds) {
    const student = await Student.findById(id);
    pendingStudents.push(student);
  }

  return res.json({ registrations:registrations,students: pendingStudents });
};
export const confirmRegistrarRegistration = async (
  req: Request,
  res: Response
) => {
  const department = req.body.department;
  const isAll = req.body.isAll;
  const data = req.body.data;

  const ids: any[] = [];
  const errors: any[] = [];
  const success: any[] = [];

  if (isAll == true) {
   
    


      // console.log(id)
      try {
        const registrations = await Registration.find({
         
          status: "Department",
        });
        if (registrations.length > 0) {
          const updatePromises = registrations.map(async (registration:any) => {
            try {
              registration.status = "Registrar";
              await registration.save();
              success.push(`updated student ${registration.stud_id}`);
            } catch (err:any) {
              errors.push(`failed to update student ${registration.stud_id}: ${err.message}`);
            }
          });
        
          await Promise.all(updatePromises);
        } else {
          res.status(400).json({ error:"unable to find requests "})
        
        }
      } catch (error) {
        console.error(`error updating student status`);
        errors.push(`error updating student status`);
      }
    
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  } else {
    /*  const students = await Student.find({department_id:department})


      if (!students) {
        return res.status(404).json({ message: "students not found" });
      }
      students.map((student:any) =>
        {
          ids.push(student._id)
    
        }) */
    for (const id of data) {
      // console.log(id)
      try {
        const registration = await Registration.findOne({
          stud_id: id,
          status: "Student",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Department";
          await registration.save();
          success.push(`updated student ${id}`);
        } else {
          errors.push(`can't find student ${id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id}: ${error}`);
        errors.push(`can't update student ${id}`);
      }
    }
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  }
};
export const rejectRegistrarRegistration = async (
  req: Request,
  res: Response
) => {
  const department = req.body.department;
  const data = req.body.data;

  const ids: any[] = [];
  const errors: any[] = [];
  const success: any[] = [];


   

    for (const id of data) {
      // console.log(id)
      try {
        const registration = await Registration.findOne({
          stud_id: id,
          status: "Department",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Rejected";
          registration.rejections = {
            "by": "Registrar",
            "reason": id.reason
          }
          await registration.save();
          success.push(`updated student ${id.id}`);
        } else {
          errors.push(`can't find student ${id.id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id.id}: ${error}`);
        errors.push(`can't update student ${id.id}`);
      }
    }
    if (success.length > 0) {
      return res
        .status(200)
        .json({ message: "successfully updated students", errors: errors });
    } else {
      return res
        .status(400)
        .json({ message: "No students were updated", errors: errors });
    }
  
};

export const acceptReject = async (req: Request, res: Response) => {
  const { addDrop_id, status, assignSec, reason } = req.body;
  console.log(addDrop_id);
  const addDrop = await AddDrop.findById(addDrop_id);

  if (!addDrop) {
    return res
      .status(400)
      .send({ message: "The requested action cannot be performed" });
  }

  if (addDrop.status !== "pending") {
    return res
      .status(400)
      .send({ message: "The requested action cannot be performed" });
  }
  console.log(addDrop);
  if (status === "reject") {
    const registration = await AddDrop.findByIdAndUpdate(addDrop_id, {
      status: "rejected",
      reason: reason,
    });
    return res.status(200).send({ message: "rejected" });
  }
  if (assignSec.length !== addDrop.courseToAdd.length) {
    return res.status(400).send({ message: "nor all courses are included" });
  }
  addDrop.courseToAddWithSec = assignSec;
  addDrop.status = "Accepted";
  addDrop.registrarStatus = "pending";
  addDrop.save();
  return res.status(200).send({ message: "accepted" });
};
export const acceptRejectRegistrar = async (req: Request, res: Response) => {
  const { addDrop_id, status, reason } = req.body;

  const addDrop = await AddDrop.findById(addDrop_id);
  if (!addDrop) {
    return res
      .status(400)
      .send({ message: "The requested action cannot be performed" });
  }
  if (addDrop.status != "Accepted") {
    return res.status(400).send({
      message:
        "The requested action cannot be performed departmetn must accept first",
    });
  }
  if (addDrop.status === "Accepted" && addDrop.registrarStatus !== "pending") {
    return res
      .status(400)
      .send({ message: "The requested action cannot be performed" });
  }
  console.log("2", addDrop);
  if (status === "reject") {
    const registration = await AddDrop.findByIdAndUpdate(addDrop_id, {
      status: "pending",
      registrarStatus: "rejected",
      registrarReason: reason,
    });
    return res.status(200).send({ message: "rejected" });
  } else if (status === "accept") {
    let added: any = [];
    let dropped: any = [];

    const addPromises = addDrop?.courseToAddWithSec.map(
      async (element: any) => {
        const add = await addCourse({
          id: addDrop.stud_id,
          course_id: element.course_id.toString(),
          section_id: element.section_id.toString(),
        });
        added.push(add);
        console.log(add);
      }
    );
    // drop logic
    const dropPromises = addDrop.courseToDrop.map(async (element: any) => {
      const drop = await dropCourse({
        id: addDrop.stud_id,
        course_id: element,
      });
      dropped.push(drop);
      console.log(drop);
    });
    await Promise.all([...addPromises, ...dropPromises]);
    console.log("crs", added, "dlt ", dropped);
    // end
    if (
      (addDrop.courseToAdd.length > 0 && added.length > 0) ||
      (addDrop.courseToDrop.length > 0 && dropped.length > 0)
    ) {
      const registration = await AddDrop.findByIdAndUpdate(
        { _id: addDrop_id },
        {
          registrarStatus: "Accepted",
        }
      );
      return res.status(200).send({ message: "success" });
    } else {
      return res
        .status(400)
        .send({ message: "something went wrong check the status manually " });
    }
  } else {
    return res
      .status(400)
      .send({ message: "status should be accept or reject" });
  }
};

export const getAddDrop = async (req: Request, res: Response) => {
  const { skip, limit, status, registrarStatus } = req.query;
  let st = {};
  if (status) {
    st = { status: status };
  } else if (registrarStatus) {
    st = { registrarStatus: registrarStatus };
  }
  console.log(skip, limit);
  const addDrop = await AddDrop.find(st)
    .sort({ status: -1, createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate("courseToAdd", "_id name code")
    .populate("courseToDrop", "_id name code")
    .populate("stud_id", "_id name email")
    .populate("department_id", "_id name")
    .populate({ path: "courseToAddWithSec.course_id", select: "_id name code" })
    .populate({
      path: "courseToAddWithSec.section_id",
      select: "_id name code",
    });
  console.log(addDrop);
  if (!addDrop) {
    return res.status(400).send({ message: "not found" });
  }
  res.status(200).send({ message: "success", data: addDrop });

  // end
};

export const addDropCourse = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  const { add, drop } = req.body;
  const student = await Student.findById(student_id);
  console.log(student);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  const intersection = getArrayIntersection(add, drop);

  if (intersection.length) {
    const inter = Course.find({ $in: intersection });
    return res.status(400).send({
      message: "adding and droping the same course is not allowed",
      data: inter,
    });
  }

  const registration = await Registration.aggregate([
    { $match: { stud_id: new mongoose.Types.ObjectId(student_id) } },
    { $sort: { year: -1, semester: -1 } },
    { $limit: 1 },
  ]);
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }

  const registrationData: any = registration[0];
  const toAdd = await fetchDataByIds(add);
  const toDrop = await fetchDataByIds(drop);
  const addCredits = addValues(toAdd);
  const dropCredits = addValues(toDrop);
  console.log(toAdd, addCredits, dropCredits);
  const creditsValue = addCredits - dropCredits;
  console.log(registrationData.total_credit, creditsValue);
  if (creditsValue > 0) {
    const isOverLoad = checkOverLoad(
      registrationData.total_credit,
      Math.abs(creditsValue),
      true
    );
    if (isOverLoad === "overload") {
      return res.status(400).json({ message: "You are overloading" });
    }
  } else {
    const isOverLoad = checkOverLoad(
      registrationData.total_credit,
      Math.abs(creditsValue),
      false
    );
    if (isOverLoad === "under") {
      return res.status(400).json({ message: "You are underloading" });
    }
  }
  // fuction to check prerequisit
  add.forEach(async (element: any) => {
    const checked = await checkPrerequisite(element, student_id);
    if (!checked) {
      const course = await Course.findById(element);
      return res
        .status(403)
        .send({ message: "You have to take the prerequisite first", course });
    }
  });
  drop.forEach((element: any) => {
    const found = registrationData.courses.find((course: any) => {
      return course.courseID.toString() === element;
    });
    if (!found) {
      return res.status(400).send({ message: "course not found" });
    }
  });

  const addDropCourse = await new AddDrop({
    stud_id: student_id,
    courseToAdd: add,
    courseToDrop: drop,
    department_id: student.department_id,
  });
  await addDropCourse.save();
  await addDropCourse.populate("courseToAdd", "code name");
  await addDropCourse.populate("courseToDrop", "code name");

  return res.status(200).send({
    message: "Request sent successfully",
    data: addDropCourse,
  });
};
function getArrayIntersection(arr1: [], arr2: []) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const intersectionSet = new Set([...set1].filter((item) => set2.has(item)));

  return Array.from(intersectionSet);
}
async function fetchDataByIds(ids: []) {
  try {
    // Convert the input ids to valid MongoDB ObjectIds
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    // Fetch the data using the $in operator
    const data = await Course.find({ _id: { $in: objectIds } }).select(
      "credits"
    );

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
function addValues(arr: []) {
  return arr.reduce((total, obj: any) => total + obj.credits, 0);
}

export const dropCourse = async ({
  id,
  course_id,
}: {
  id: string;
  course_id: any;
}) => {
  const registration = await Registration.aggregate([
    { $match: { stud_id: new mongoose.Types.ObjectId(id) } },
    { $sort: { year: -1, semester: -1 } },
    { $limit: 1 },
  ]);

  if (!registration) {
    return { message: "Registration not found" };
  }

  const registrationData: any = registration[0];
  const course = await Course.findById(course_id).select("credits").lean();

  const courses = registrationData.courses;

  // let found = false;
  const newCourses = courses.filter((course: any) => {
    if (course_id.includes(course.courseID.toString())) {
      // found = true;
      return false;
    } else {
      return true;
    }
  });
  // if (!found) {
  //   return res.status(400).send({ message: "course nor found" });
  // }
  registrationData.courses = newCourses;
  registrationData.total_credit =
    registrationData.total_credit - course.credits;

  const updatedRegistration = await Registration.findByIdAndUpdate(
    registrationData._id,
    registrationData,
    { new: true }
  );

  if (!updatedRegistration) {
    return { message: "Registration not found" };
  }
  const number = await NumberOfStudent.findOne({
    section_id: registrationData.section_id,
    course_id: course,
  });
  if (number) {
    if (number.numberOfStudent.includes(id)) {
      const index = number.numberOfStudent.indexOf(id);
      number.numberOfStudent.splice(index, 1);
      await number.save();
    }
  }
  return { message: "success" };
};

export const addCourse = async ({
  id,
  course_id,
  section_id,
}: {
  id: string;
  course_id: string;
  section_id: string;
}): Promise<{ message: String; data: String } | { error: String }> => {
  const registration = await Registration.aggregate([
    { $match: { stud_id: new mongoose.Types.ObjectId(id) } },
    { $sort: { year: -1, semester: -1 } },
    { $limit: 1 },
  ]);
  // console.log(registration);
  if (!registration) {
    return { error: "registration not found" };
  }
  const registrationData: any = registration[0];
  const courses = registrationData.courses;

  let isRetake = await isCourseTaken(course_id, id);
  const course = await Course.findById(course_id).select("credits").lean();

  const newCourse = {
    courseID: course_id,
    grade: "",
    status: "Active",
    isRetake,
    section: section_id,
  };

  const updatedRegistration = await Registration.findByIdAndUpdate(
    registrationData._id,
    {
      $push: { courses: newCourse },
      total_credit: registrationData.total_credit + course.credits,
    },
    { new: true }
  );

  if (!updatedRegistration) {
    return { error: "Registration not found" };
  }
  await incStudentNumber(section_id, course_id, id);
  return { message: "success", data: course_id };
};

export const ListAddCourses = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  res.status(200).send(await getPossibleAddCourses(student_id));
};

function checkOverLoad(total_credit: Number, credits: Number, add: boolean) {
  if (add) {
    if (Number(total_credit) + Number(credits) > 21) {
      return "overload";
    }
  } else if (Number(total_credit) - Number(credits) < 12) {
    return "under";
  } else {
    return "ok";
  }
}
export const getTemplate = async (req: Request, res: Response) => {
  const file = path.join(
    __dirname,
    "..",
    "..",
    "..",

    "public",
    "students_template.csv"
  );
  console.log(__dirname);
  res.download(file);
};

export const WithdrawalRequest = async (req: Request, res: Response) => {
  const id = req.body.id;
  const reason = req.body.reason;
  const data = req.body

  const student = await Student.findById(id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const withdrawalRequest = await new Withdrawal({stud_id:id,reason:reason,status:"Student"});

  await withdrawalRequest.save()



  return res.status(200).json({ message: "successfully submitted request" });
};

export const getWithdrawalStatus = async (req: Request, res: Response) => {
  const id = req.body.id;

  const withdrawal = await Withdrawal.findOne({stud_id: id});

  if(!withdrawal)
    {
      return res.status(200).json({ message: false });
    }


  return res.status(200).json({ message: withdrawal.status });


  



};

export const getDepartmentWithdrawalRequests = async (req: Request, res: Response) => {
  const department = req.body.department;
  const Ids:any = []
  const Withdrawals:any = []
  const students = await Student.find({ department_id: department });
  students.map((student:any)=>{

    Ids.push(student._id)

  })
  for (const id of Ids) {
    const withdrawal = await Withdrawal.findOne({
      $or: [
        { status: "Student" },
        { 
          status: "Rejected",
          "rejections.by": "Registrar"
        },
      ],
    })
    .populate({
      path: "stud_id",
      select: "name",
    })
    if (!withdrawal) {
      continue;
    }
    Withdrawals.push(withdrawal);
   
  }
  if (Withdrawals.length == 0) {
    return res.status(200).json({ message: "No pending withdrawals" });
  }



  return res.json({ requests:Withdrawals });

};
export const getRegistrarWithdrawalRequests = async (req: Request, res: Response) => {

  const withdrawalRequests = await Withdrawal.find({status:"Department"}).populate({
    path: "stud_id",
    select: "name",
  })

  if(!withdrawalRequests)
    {
      return res.status(400).json({ message: "No pending withdrawals" });
    }

    return res.status(200).json({ message:withdrawalRequests })





}
export const AcceptDepartmentWithdrawalRequest = async (req: Request, res: Response) => {
  const ids = req.body.data;
  const errors:any = []
  const success:any = []

  for(const id of ids) {
  const student = await Student.findById(id);
  let status: Boolean = false;
  if (!student) {
    errors.push(`Could not find student with id ${id}`);
  }

  const updated = await Withdrawal.findOneAndUpdate({stud_id:id}, { status: "Department" });

  if (!updated) {
    errors.push(`Could not update student with name ${student.name}`);
    
  }
  else{
    success.push(` updated student with name ${student.name}`);

  }
}

  return res.status(200).json({ success: success,errors: errors });
};
export const AcceptRegistrarWithdrawalRequest = async (req: Request, res: Response) => {
  const ids = req.body.data;
  const errors:any = []
  const success:any = []

  for(const id of ids) {
  const student = await Student.findById(id);
  let status: Boolean = false;
  if (!student) {
    errors.push(`Could not find student with id ${id}`);
  }
  const highestCombination = await Registration.findOne({ stud_id: id })
  .sort({ year: -1, semester: -1 })
  .select("year semester")
  .limit(1);


if (highestCombination) {
  const highestYear = highestCombination.year;
  const highestSemester = highestCombination.semester;

  const currentRegistration = await Registration.findOne({
    year: highestYear,
    semester: highestSemester,
  });
  const courses: any[] = currentRegistration.courses;

  for (const course of courses) {
    if (course.status !== "Completed") {
      status = true;
      await Registration.deleteOne({ _id: currentRegistration._id });
      break; // Stop further iteration
    }
  }
}


  const updated = await Withdrawal.findOneAndUpdate({stud_id:id}, { status: "Registrar" });

  if (!updated) {
    errors.push(`Could not update student with name ${student.name}`);
    
  }
  else{
    success.push(` updated student with name ${student.name}`);

  }
}

  return res.status(200).json({ success: success,errors: errors });
};
export const RejectDepartmentWithdrawalRequest = async (req: Request, res: Response) => {
  const ids = req.body.data;
  const errors:any = []
  const success:any = []

  for(const id of ids) {
  const student = await Student.findById(id.id);
  let status: Boolean = false;
  if (!student) {
    errors.push(`Could not find student with id ${id.id}`);
  }

  const updated = await Withdrawal.findOneAndUpdate({stud_id:id.id}, { status: "Rejected", rejections: {
    "by": "Department",
    "reason": id.reason
  }, });

  if (!updated) {
    errors.push(`Could not update student with name ${student.name}`);
    
  }
  else{
    success.push(` updated student with name ${student.name}`);

  }
}

  return res.status(200).json({ success: success,errors: errors });
};

export const RejectRegistrarWithdrawalRequest = async (req: Request, res: Response) => {
  const ids = req.body.data;
  const errors:any = []
  const success:any = []

  for(const id of ids) {
  const student = await Student.findById(id.id);
  let status: Boolean = false;
  if (!student) {
    errors.push(`Could not find student with id ${id.id}`);
  }

  const updated = await Withdrawal.findOneAndUpdate({stud_id:id.id}, { status: "Rejected", rejections: {
    "by": "Registrar",
    "reason": id.reason
  }, });

  if (!updated) {
    errors.push(`Could not update student with name ${student.name}`);
    
  }
  else{
    success.push(` updated student with name ${student.name}`);

  }
}

  return res.status(200).json({ success: success,errors: errors });
};

export const AcceptWithdrawalRequest = async (req: Request, res: Response) => {
  const id = req.body.stud_id;

  const student = await Student.findById(id);
  let status: Boolean = false;

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  const highestCombination = await Registration.findOne({ stud_id: id })
    .sort({ year: -1, semester: -1 })
    .select("year semester")
    .limit(1);


  if (highestCombination) {
    const highestYear = highestCombination.year;
    const highestSemester = highestCombination.semester;

    const currentRegistration = await Registration.findOne({
      year: highestYear,
      semester: highestSemester,
    });
    const courses: any[] = currentRegistration.courses;

    for (const course of courses) {
      if (course.status !== "Completed") {
        status = true;
        await Registration.deleteOne({ _id: currentRegistration._id });
        break; // Stop further iteration
      }
    }
  }

  const updated = await Student.findByIdAndUpdate(id, { status: "Withdrawn" });

  if (!updated) {
    return res.status(404).json({ message: "Unable to update" });
  }

  return res.status(200).json({ message: "success" });
};

export const activateStudent = async (req: Request, res: Response) => {
  const id = req.body.id;

  const student = await Student.findById(id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const updated = await Student.findByIdAndUpdate(id, { status: "Active" });

  if (!updated) {
    return res.status(404).json({ message: "Unable to update" });
  }

  return res.status(200).json({ message: "success" });
};
export const getNumberOfStudents = async (req: Request, res: Response) => {
  const { course_id } = req.params;

  const numberOfStudent = await NumberOfStudent.find({ course_id })
    .populate("course_id", "name")
    .populate("section_id", "name");

  if (!numberOfStudent) {
    res.status(400).json({ message: "No student found" });
  }
  const number = numberOfStudent.map((data: any) => {
    return {
      numberOfStudent: data.numberOfStudent.length,
      section: data.section_id,
    };
  });

  res.status(200).send({ message: "success", course_id, data: number });
};
/// if req

// export const addCourse = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { course_id, semester } = req.body;

//   const registration = await Registration.aggregate([
//     { $match: { stud_id: new mongoose.Types.ObjectId(id) } },
//     { $sort: { year: -1, semester: -1 } },
//     { $limit: 1 },
//   ]);
//   // console.log(registration);
//   if (!registration) {
//     return res.status(404).json({ message: "Registration not found" });
//   }

//   const registrationData: any = registration[0];
//   const courses = registrationData.courses;
//   // check pre requisit
//   const checked = await checkPrerequisite(course_id, id);
//   if (!checked) {
//     return res.status(403).send("You have to take the prerequisite first");
//   }
//   if (registrationData.semester !== semester) {
//     return res
//       .status(400)
//       .json({ message: "You can only add courses for the current semester" });
//   }
//   const found = courses.find((course: any) => {
//     return course.courseID.toString() === course_id;
//   });
//   if (found) {
//     return res.status(400).send({ message: "course existes" });
//   }
//   const course = await Course.findById(course_id).select("credits").lean();

//   const isOverLoad = checkOverLoad(
//     registrationData.total_credit,
//     course.credits,
//     true
//   );
//   if (isOverLoad === "overload") {
//     return res.status(400).json({ message: "You are overloading" });
//   }
//   let isRetake = await isCourseTaken(course_id, id);

//   const newCourse = {
//     courseID: course_id,
//     grade: "",
//     status: "Active",
//     isRetake,
//   };
//   const updatedRegistration = await Registration.findByIdAndUpdate(
//     registrationData._id,
//     {
//       $push: { courses: newCourse },
//       total_credit: registrationData.total_credit + course.credits,
//     },
//     { new: true }
//   );

//   if (!updatedRegistration) {
//     return res.status(404).json({ message: "Registration not found" });
//   }
//   return res.status(200).json({ message: "success" });
// };
// export const dropCourse = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const course_id = req.body.course_id;

//   const registration = await Registration.aggregate([
//     { $match: { stud_id: new mongoose.Types.ObjectId(id) } },
//     { $sort: { year: -1, semester: -1 } },
//     { $limit: 1 },
//   ]);

//   if (!registration) {
//     return res.status(404).json({ message: "Registration not found" });
//   }

//   const registrationData: any = registration[0];
//   const course = await Course.findById(course_id).select("credits").lean();

//   const courses = registrationData.courses;

//   let found = false;
//   const newCourses = courses.filter((course: any) => {
//     if (course.courseID.toString() === course_id) {
//       found = true;
//       return false;
//     } else {
//       return true;
//     }
//   });
//   if (!found) {
//     return res.status(400).send({ message: "course nor found" });
//   }
//   registrationData.courses = newCourses;
//   registrationData.total_credit =
//     registrationData.total_credit - course.credits;

//   const updatedRegistration = await Registration.findByIdAndUpdate(
//     registrationData._id,
//     registrationData,
//     { new: true }
//   );

//   if (!updatedRegistration) {
//     return res.status(404).json({ message: "Registration not found" });
//   }

//   return res.status(200).json({ message: "success" });
// };
