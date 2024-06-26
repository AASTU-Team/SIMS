import { response, search } from "app";
import { Request, Response } from "express";
import { any } from "joi";
import mongoose, { Mongoose } from "mongoose";
import axios from "axios";

//const assignCourse = require("../../helper/assignFreshmanCourse");
const assignCourse = require("../../helper/assignCourse");
const deleteCsv = require("../../helper/deleteCsv");
const checkPrerequisite = require("../../helper/checkPrerequisite");
const isCourseTaken = require("../../helper/isCourseTaken");
const getCourseToAdd = require("../../helper/getCoursetoAdd");
const Notification = require("../../helper/Notification");
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
const Withdrawal = require("../../models/Withdrawal.model");

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
        return res.status(400).json({ message: r.message });
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

  /*  if (path.extname(req.file.filename).toLowerCase() !== ".csv") {
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
  } */

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

            /*  insertedStudents.push({
              id: newstudent._id,
              department: student.department,
              type: student.type,
            });
            // const theStudent =
            const registration = await assignCourse(insertedStudents);
            if (!registration || registration.length === 0) {
              errors.push("Registration failed for student " + newstudent.name);
            }
            */
            console.log("Ok");

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
    semester: Joi.number().optional(),
    CGPA: Joi.number().optional(),
    //admission_date: Joi.date().format('YYYY-MM-DD').withMessage('Admission date must be in the format YYYY-MM-DD'),
    //grad_date: Joi.date().format('YYYY-MM-DD').withMessage('Graduation date must be in the format YYYY-MM-DD'),
    contact: Joi.string(),
    address: Joi.string(),
    emergencycontact_name: Joi.string().regex(/^[A-Za-z\s]+$/),
    emergencycontact_relation: Joi.string(),
    phone: Joi.string().regex(/^(\+\d{12}|\d{10}|\d{9})$/),
    birthday: Joi.date(),
    admission_date: Joi.date(),
    grad_date: Joi.date(),
    //emergencycontact_phone: Joi.string().regex(/^\+\d{12}$/).withMessage('Emergency contact phone number must start with "+" and be followed by 12 digits'),
    emergencycontact_phone: Joi.string().regex(/^(\+\d{12}|\d{10}|\d{9})$/),
  });

  return schema.validate(student);
}

/* export const getAllStudent = async (req: Request, res: Response) => {
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
}; */

export const UploadStudentImage = async (req: Request, res: Response) => {
  const file = req.file;
  const id = req.body.id;

  console.log(id);

  if (file) {
    const fileName = `${id}.jpg`;
    const filePath = path.join(__dirname, "../exports", "images", fileName);
  }

  return res.status(200).json({ message: "successfully uploaded image" });
};

export const getStudentImage = async (req: Request, res: Response) => {
  const id = req.body.id;

  return res
    .status(200)
    .json({ message: `http://localhost:3000/profile-images/${id}-image.jpg` });
};

export const getAllStudent = async (req: Request, res: Response) => {
  try {
    const { year, semester, search, department_id } = req.query;
    const filter: any = {};
    const page: any = req.query.page;
    const limit: any = req.query.limit;

    if (year) {
      filter.year = year;
    }

    if (semester) {
      filter.semester = semester;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (department_id) {
      filter.department_id = department_id;
    }

    const totalItems = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (Number(page) - 1) * limit;

    const students = await Student.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "department_id",
        select: "name",
      });

    const data: any = await Promise.all(
      students.map(async (student:any) => {
        let authStatus = "";
        try {
          const params = {
            email: student.email,
          };
          const queryString = new URLSearchParams(params).toString();
          const response = await fetch(`http://localhost:5000/auth/status/${student.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          if (response.ok) {
            const user = await response.json();
            authStatus = user.status;
          }
        } catch (error) {
          console.log(error);
        }

        return {
          ...student.toObject(),
          department_name: student.department_id?.name,
          department_id: student.department_id?._id,
          userStatus: authStatus,
        };
      })
    );

    res.status(200).json({
      message: data,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: totalItems,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportAllStudent = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const students = await Student.find().populate({
      path: "department_id",
      select: "name",
    });
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
    fs.readFile(filePath, (err: any, data: any) => {
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
    });

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportLogFile = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const filePath = path.join("./exports", "app.log");

    // Read the CSV file contents
    fs.readFile(filePath, (err: any, data: any) => {
      if (err) {
        console.error("Error reading Log file:", err);
        res.status(500).json({ error: "Error exporting data" });
        return;
      }

      // Create a Blob object from the CSV data

      // Set the necessary headers to trigger a download
      res.setHeader("Content-Disposition", "attachment; filename=app.log");
      res.setHeader("Content-Type", "text/csv");
      const file = path.join(
        __dirname,
        "..",
        "..",
        "..",

        "exports",
        "app.log"
      );
      console.log(__dirname);
      res.download(file);

      // Send the Blob in the response
      // res.status(200).send({data:blob});
    });

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
/* export const getAllStaff = async (req: Request, res: Response) => {
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
}; */
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const { year, department_id, search } = req.query;
    const page: any = req.query.page;
    const limit: any = req.query.limit;
    const filter: any = {};

    if (year) {
      filter.birthday = {
        $gte: new Date(Number(year) - 1, 0, 1),
        $lte: new Date(Number(year), 11, 31),
      };
    }

    if (department_id) {
      filter.department_id = department_id;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const totalItems = await Staff.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (Number(page) - 1) * limit;

    const staff = await Staff.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "department_id",
        select: "name",
      });

    const myStaff = staff.map((person: any) => {
      return {
        ...person.toObject(),
        department_name: person.department_id?.name,
        department_id: person.department_id?._id,
      };
    });
    const data: any = await Promise.all(
      staff.map(async (student:any) => {
        let authStatus = "";
        try {
         
          const response = await fetch(`http://localhost:5000/auth/status/${staff.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          if (response.ok) {
            const user = await response.json();
            authStatus = user.status;
          }
        } catch (error) {
          console.log(error);
        }

        return {
          ...student.toObject(),
          department_name: student.department_id?.name,
          department_id: student.department_id?._id,
          userStatus: authStatus,
        };
      })
    );

    res.status(200).json({
      message: data,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: totalItems,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getStaffByDepId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { inst } = req.query;
  const search: any = {
    department_id: id,
  };
  if (inst) {
    search["isInstructor"] = inst;
  }
  console.log(id);
  try {
    const staffs: any = await Staff.find(search);
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
    fs.readFile(filePath, (err: any, data: any) => {
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
    });

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
  const staff = req.query.staff_id;
  const email = req.query.email;
  console.log(staff, email);
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
  const email = req.body.email;

  try {
    const response = await fetch("http://localhost:5000/auth/deactivate", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      return res.status(200).json({ message: "success" });
    } else {
      const error = await response.json();
      console.log(error.message);
      return res
        .status(400)
        .json({ message: "An error happened, please try again" });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  const email = req.body.email;

  try {
    const response = await fetch("http://localhost:5000/auth/activate", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      return res.status(200).json({ message: "success" });
    } else {
      const error = await response.json();
      console.log(error.message);
      return res
        .status(400)
        .json({ message: "An error happened, please try again" });
    }
  } catch (error: any) {
    console.log(error.message);
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
    return res.status(200).json({ message: "Courses Not found" });
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

export const getStudentCourseStatus = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  const completed: any[] = [];
  const enrolled: any[] = [];
  let left: any[] = [];
  const incomplete: any[] = [];
  const fail: any[] = [];
  const Allcourses: any[] = [];

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
      Allcourses.push(course.courseID);
      if (course.status === "Active") {
        enrolled.push(course.courseID);
      } else if (course.status === "Completed") {
        completed.push(course.courseID);
      } else if (course.status === "Incomplete" || course.grade == "NG") {
        incomplete.push(course.courseID);
      } else if (course.grade === "F") {
        fail.push(course.courseID);
      }
    });
  });
  const student = await Student.findById(student_id);
  if (!student) return;
  const departmentId = student.department_id;
  const type = student.type;
  const highestCombination = await Registration.findOne({ stud_id: student_id })
    .sort({ year: -1, semester: -1 })
    .select("year semester")
    .limit(1);

  if (highestCombination) {
    const highestYear = highestCombination.year;
    const highestSemester = highestCombination.semester;
    try {
      const curricula = await Curriculum.find({
        year: { $gte: highestYear },
        semester: { $gte: highestSemester },
        department_id: departmentId,
        type: type,
      })
        .sort({ year: 1, semester: 1 })
        .populate({
          path: "courses",
          select: "code name credits lec lab description ",
        });

      const courses = curricula.reduce((allCourses: any, curriculum: any) => {
        return [...allCourses, ...curriculum.courses];
      }, []);

      courses.map((course: any) => {
        left.push(course);
      });
      left = left.filter(
        (course) => !Allcourses.some((c) => c.code === course.code)
      );
    } catch (error) {
      console.error("Error getting curriculum courses:", error);
      throw error;
    }
  }

  return res
    .status(200)
    .json({
      enrolled: enrolled,
      left: left,
      completed: completed,
      incomplete: incomplete,
      fail: fail,
    });
};
export const getstudentRegistrationCourses = async (
  req: Request,
  res: Response
) => {
  const student_id = req.params.student_id;
  let department_id = "";
  let type = "";
  let newyear = 0;
  let newsemester = 0;

  const courses: String[] = [];
  const CourseStatus: any[] = [];
  const regCourses: any[] = [];
  const regCourses2: any[] = [];
  const total_credit: Number[] = [];

  const student = await Student.findById(student_id);

  const highestYear = student.year;
  const highestSemester = student.semester;
  let status = "";

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }
  if (student.status !== "Active") {
    return res.status(200).json({ message: "Student is not Active" });
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
  console.log("year", highestYear);
  console.log("department", department_id);

  const RegData = await Registration.findOne({
    stud_id: student._id,
    year: highestYear,
    semester: highestSemester,
  });
  if (RegData) {
    status = RegData.status;
  }

  const curriculum = await Curriculum.findOne({
    year: highestYear,
    semester: highestSemester,
    department_id: department_id,
    type: type,
  });

  if (!curriculum) {
    return res.status(200).json({ message: [] });
  }

  const allCourses: any[] = curriculum.courses;

  console.log("All courses", allCourses);

  allCourses.map((course: any) => {
    // if (course.semester === newsemester) {
    courses.push(course);
    // }
  });
  let sum: number = 0;

  for (const course of courses) {
    let coursePreq: any[] = [];
    const status = await checkPrerequisite(course, student_id);
    console.log(status);
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
      regCourses2.push({
        courseID: course,
        grade: "",
        status: "Active",
        isRetake: false,
      });

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

    total_credit.map((credit: any) => {
      sum += credit;
    });
  }
  if (!RegData) {
    const registration = await new Registration({
      stud_id: student_id,
      year: highestYear,
      semester: highestSemester,
      courses: regCourses2,
      registration_date: new Date(),
      total_credit: sum,
      status: "Pending",
    });

    try {
      const savedRegistration = await registration.save();
      console.log("Registration saved successfully:", savedRegistration);
      status = savedRegistration.status;
    } catch (error) {
      console.error("Error saving registration:", error);
    }
  }

  return res.status(200).json({ message: regCourses, status: status });
};

export const getStudentRegistrationHistory = async (
  req: Request,
  res: Response
) => {
  const student_id = req.params.student_id;

  const registrations = await Registration.find({
    stud_id: student_id,
  }).populate({
    path: "courses.courseID",
    select: "name code credits lec lab tut",
  });

  if (!registrations) {
    return res.status(200).json({ message: [] });
  }

  return res.status(200).json({ message: registrations });
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
  const highestYear = student.year;
  const highestSemester = student.semester;

  /*     if (highestSemester == 1) {
      newyear = highestYear;
      newsemester = highestSemester + 1;
    } else {
      newyear = highestYear + 1;
      newsemester = 1;
    } */

  /*  console.log("semister", newsemester);
    console.log("year", newyear);
    console.log("department", department_id);
 */
  /*  const curriculum = await Curriculum.findOne({
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
    }); */

  /*    for (const course of courses) {
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
    }); */
  /*    const registration = await new Registration({
      stud_id: student_id,
      year: newyear,
      semester: newsemester,
      courses: regCourses,
      registration_date: new Date(),
      total_credit: sum,
      status: "Student",
    }); */

  console.log("student", student._id);
  console.log("year", highestYear);
  console.log("semester", highestSemester);

  try {
    const savedRegistration = await Registration.findOneAndUpdate(
      { stud_id: student._id, year: highestYear, semester: highestSemester },
      { status: "Student" }
    );
    if (savedRegistration) {
      console.log("Registration saved successfully:", savedRegistration);
      ////////////////////////////////////////////////////////////////

      const modifiedCourses: any = [];
      const courses: any = savedRegistration.courses;

      courses.map((course: any) => {
        modifiedCourses.push({
          course_id: course.courseID,
          instructor_id: "",
        });
      });

      const response = await axios.post(
        "http://localhost:9000/grades/multiple",
        {
          students: [
            {
              studentId: savedRegistration.stud_id,
              courses: modifiedCourses,
            },
          ],
        }
      );

      // Handle the response
      console.log(response.data);
      const data = response.data;

      ///////////////////////////////////////////////////////////////////////////
      return res.status(200).json({
        message: "Registered successfully! please wait for confirmation",
      });
    } else {
      return res.status(400).json({
        message: "Unable to register",
      });
    }
  } catch (error) {
    console.error("Error saving registration:", error);
    return res.status(500).json({
      message: "Unable to register",
    });
  }
};

export const getStudentSemesters = async (req: Request, res: Response) => {
  const id = req.params.student_id;
  //const data:any = []

  const student = await Student.findById(id);
  if (!student) {
    res.status(200).send({ message: [] });
  }
  const CGPA = student.CGPA;

  const registrations = await Registration.find({ stud_id: id }).populate({
    path: "courses.courseID",
    select: "code name credits lec lab description ",
  });
  if (!registrations) {
    res.status(200).send({ message: [] });
  }

  const data = registrations.map((registration: any) => ({
    year: registration.year,
    semester: registration.semester,
    status: registration.status,
    GPA: registration.GPA,
    courses: registration.courses.filter(
      (course: any) => course.status === "Complete"
    ),
  }));

  res.status(200).send({ message: data, CGPA: CGPA });
};

export const getDepartmentRegistrationStatus = async (
  req: Request,
  res: Response
) => {
  const department = req.params.department;
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
        { status: "Student", stud_id: id },
        {
          stud_id: id,
          status: "Rejected",
          "rejections.by": "Registrar",
        },
      ],
    })
      .populate("stud_id", "name")
      .populate({
        path: "courses",
        populate: {
          path: "courseID",
          select: "name credits type code lec lab tut hs",
        },
      });
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

  return res.json({
    registrations: registrationStatuses,
    students: pendingStudents,
  });
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
  const department: any = req.body.department;
  const isAll: Boolean = req.body.isAll;
  const data: any[] = req.body.data;

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
          registration.status = "Student";
          (registration.rejections = {
            by: "Department",
            reason: id.reason,
          }),
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
          stud_id: id.id,
          status: "Student",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Student";
          registration.rejections = {
            by: "Department",
            reason: id.reason,
          };
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
  const department = req.params.department;
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
    .populate({
      path: "courses",
      populate: {
        path: "courseID",
        select: "name credits type code lec lab tut hs",
      },
    });
  registrations.map((registration: any) => {
    pendingIds.push(registration.stud_id);
  });

  registrationStatuses.push(registrations);

  if (pendingIds.length == 0) {
    return res.status(200).json({ message: "No pending registrations" });
  }

  for (const id of pendingIds) {
    const student = await Student.findById(id);
    pendingStudents.push(student);
  }

  return res.json({ registrations: registrations, students: pendingStudents });
};
export const confirmRegistrarRegistration = async (
  req: Request,
  res: Response
) => {
  const department: any = req.body.department;
  const isAll: any = req.body.isAll;
  const data: any[] = req.body.data;
  const emails: any[] = [];

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
        const updatePromises = registrations.map(async (registration: any) => {
          try {
            registration.status = "Registrar";
            await registration.save();
            success.push(`updated student ${registration.stud_id}`);
            const student = await Student.findById(registration.stud_id);
            if (student) emails.push(student.email);
          } catch (err: any) {
            errors.push(
              `failed to update student ${registration.stud_id}: ${err.message}`
            );
          }
        });

        await Promise.all(updatePromises);
        const data = {
          data: {
            srecipient: emails,
            message: "Registration is Accepted",
            type: "Registration",
          },
          name: "student",
          dept_id: "6627f1cb16bcc35f5d498f30",
        };
        await Notification(data);
      } else {
        res.status(400).json({ error: "unable to find requests " });
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
          status: "Department",
        });
        if (registration) {
          console.log(registration);
          registration.status = "Registrar";
          await registration.save();
          success.push(`updated student ${id}`);
          const student = await Student.findById(id);
          if (student) emails.push(student.email);
        } else {
          errors.push(`can't find student ${id}`);
        }
      } catch (error) {
        console.error(`Error updating student ${id}: ${error}`);
        errors.push(`can't update student ${id}`);
      }
    }
    const datas = {
      data: {
        srecipient: emails,
        message: "Registration is Accepted",
        type: "Registration",
      },
      name: "student",
      dept_id: "6627f1cb16bcc35f5d498f30",
    };
    await Notification(datas);
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
  const data: any = req.body.data;

  const ids: any[] = [];
  const errors: any[] = [];
  const success: any[] = [];
  const emails: any[] = [];

  for (const id of data) {
    // console.log(id)
    try {
      const registration = await Registration.findOne({
        stud_id: id.id,
        status: "Department",
      });
      if (registration) {
        console.log(registration);
        registration.status = "Department";
        registration.rejections = {
          by: "Registrar",
          reason: id.reason,
        };
        await registration.save();
        success.push(`updated student ${id.id}`);
        const student = await Student.findById(id.id);
        if (student) emails.push(student.email);
      } else {
        errors.push(`can't find student ${id.id}`);
      }
    } catch (error) {
      console.error(`Error updating student ${id.id}: ${error}`);
      errors.push(`can't update student ${id.id}`);
    }
  }
  const datas = {
    data: {
      srecipient: emails,
      message: "Registration denied",
      type: "Registration Request",
    },
    name: "student",
    dept_id: "6627f1cb16bcc35f5d498f30",
  };
  await Notification(datas);
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

export const getActiveAddDrop = async (req: Request, res: Response) => {
  const { stud_id } = req.params;
  const addDrop = await AddDrop.findOne({
    stud_id: stud_id,
    status: "pending",
  });
  const addDropR = await AddDrop.findOne({
    stud_id: stud_id,
    registrarStatus: "pending",
  });
  if (!addDrop && !addDropR) {
    return res.status(200).send({ message: "no active request" });
  }
  res.status(200).send({ message: "success", data: addDrop || addDropR });
};

export const getAddDrop = async (req: Request, res: Response) => {
  const { stud_id, department_id, skip, limit, status, registrarStatus } =
    req.query;
  let st: any = {};
  if (status) {
    st = { status: status };
  } else if (registrarStatus) {
    st = { registrarStatus: registrarStatus };
  }
  if (department_id) {
    st["department_id"] = department_id;
  }
  if (stud_id) {
    st["stud_id"] = stud_id;
  }
  console.log(skip, limit);
  const addDrop = await AddDrop.find(st)
    .sort({ status: -1, createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate("stud_id")
    .populate("courseToAdd")
    .populate("courseToDrop")
    .populate("department_id")
    .populate({ path: "courseToAddWithSec.course_id" })
    .populate({
      path: "courseToAddWithSec.section_id",
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
  for (const element of add) {
    const checked = await checkPrerequisite(element, student_id);
    if (!checked) {
      const course = await Course.findById(element);
      return res
        .status(403)
        .send({ message: "You have to take the prerequisite first", course });
    }
  }
  // add.forEach(async (element: any) => {
  //   const checked = await checkPrerequisite(element, student_id);
  //   if (!checked) {
  //     const course = await Course.findById(element);
  //     return res
  //       .status(403)
  //       .send({ message: "You have to take the prerequisite first", course });
  //   }
  // });
  const dropdata = [];
  drop.forEach((element: any) => {
    const found = registrationData.courses.find((course: any) => {
      return course.courseID.toString() === element;
    });
    if (!found) {
      dropdata.push("1");
    }
  });
  console.log(drop);
  if (dropdata.length) {
    return res.status(400).send({ message: "course not found" });
  }
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
    const index = number.numberOfStudent.findIndex((item: any) => {
      return item.student.toString() == id;
    });
    if (index) {
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
  const isOutOfBatch = true;
  await incStudentNumber(section_id, course_id, id, isOutOfBatch);
  return { message: "success", data: course_id };
};

export const ListAddCourses = async (req: Request, res: Response) => {
  const { student_id } = req.params;
  try{
  const course = await getCourseToAdd(student_id)
  res.status(200).send(course)
}catch(e){
  return res.status(500).send({})
}
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
  const data = req.body;
  const file = req.file;

  console.log(req.body);

  const student = await Student.findById(id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  if (student.status !== "Active") {
    return res.status(200).json({ message: "Student is not Active" });
  }

  const withdrawalRequest = await new Withdrawal({
    stud_id: id,
    reason: reason,
    status: "Student-Withdrawal",
  });

  await withdrawalRequest.save();
  if (file) {
    const fileName = `${id}_${Date.now()}.pdf`;
    const filePath = path.join(
      __dirname,
      "../exports",
      "withdrawals",
      fileName
    );
  }

  return res.status(200).json({ message: "successfully submitted request" });
};
export const exportWithdrawalFile = async (req: Request, res: Response) => {
  // Handle student registration logic here

  const id = req.params.id;

  try {
    const filePath = path.join("./exports", "withdrawals", `${id}-withdrawal.pdf`);

    // Read the CSV file contents
    fs.readFile(filePath, (err: any, data: any) => {
      if (err) {
        console.error("Error reading Log file:", err);
        res.status(500).json({ error: "Error exporting data" });
        return;
      }

      // Create a Blob object from the CSV data

      // Set the necessary headers to trigger a download
      res.setHeader("Content-Disposition", `attachment; filename=${id}.pdf`);
      res.setHeader("Content-Type", "application/pdf");
      const file = path.join(
        __dirname,
        "..",
        "..",
        "..",

        "exports",
        "withdrawals",
        `${id}-withdrawal.pdf`
      );
      console.log(__dirname);
      res.download(file);

      // Send the Blob in the response
      // res.status(200).send({data:blob});
    });

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const EnrollmentRequest = async (req: Request, res: Response) => {
  const id = req.body.id;
  const reason = req.body.reason;
  const data = req.body;
  const file = req.file;

  const student = await Student.findById(id);
  const withdrawal = await Withdrawal.findOne({
    stud_id: id,
    status: "Registrar-withdrawal",
  });
  if (!withdrawal) {
    return res.status(200).json({ message: "Can't Ask for Enrollment" });
  }

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
/*   if (student.status !== "Withdrawn") {
    return res.status(200).json({ message: "Cant Ask for Enrollment" });
  } */

  const withdrawalRequest = await new Withdrawal({
    stud_id: id,
    reason: reason,
    status: "Student-enroll",
  });

  await withdrawalRequest.save();
  if (file) {
    const fileName = `${id}_${Date.now()}.pdf`;
    const filePath = path.join(
      __dirname,
      "../exports",
      "withdrawals",
      fileName
    );
  }

  return res.status(200).json({ message: "successfully submitted request" });
};
export const exportEnrollmentFile = async (req: Request, res: Response) => {
  // Handle student registration logic here

  const id = req.params.id;

  try {
    const filePath = path.join("./exports", "enrollments", `${id}.pdf`);

    // Read the CSV file contents
    fs.readFile(filePath, (err: any, data: any) => {
      if (err) {
        console.error("Error reading Log file:", err);
        res.status(500).json({ error: "Error exporting data" });
        return;
      }

      // Create a Blob object from the CSV data

      // Set the necessary headers to trigger a download
      res.setHeader("Content-Disposition", `attachment; filename=${id}.pdf`);
      res.setHeader("Content-Type", "application/pdf");
      const file = path.join(
        __dirname,
        "..",
        "..",
        "..",

        "exports",
        "enrollments",
        `${id}-enroll.pdf`
      );
      console.log(__dirname);
      res.download(file);

      // Send the Blob in the response
      // res.status(200).send({data:blob});
    });

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getWithdrawalStatus = async (req: Request, res: Response) => {
  const id = req.params.id;

  const withdrawal = await Withdrawal.findOne({ stud_id: id });

  if (!withdrawal) {
    return res.status(200).json({ message: false });
  }

  return res.status(200).json({ message: withdrawal });
};

export const getDepartmentWithdrawalRequests = async (
  req: Request,
  res: Response
) => {
  const department = req.params.department;
  const Ids: any = [];
  const Withdrawals: any = [];
  const students = await Student.find({ department_id: department });
  students.map((student: any) => {
    Ids.push(student._id);
  });
  for (const id of Ids) {
    const withdrawal = await Withdrawal.findOne({
      $or: [
        { status: "Student-Withdrawal", stud_id: id },
        {
          stud_id: id,
          status: "Department-Withdrawal",
          "rejections.by": "Registrar",
        },
      ],
    }).populate({
      path: "stud_id",
      select: "name id phone email",
    });
    if (!withdrawal) {
      continue;
    }
    Withdrawals.push(withdrawal);
  }
  if (Withdrawals.length == 0) {
    return res.status(200).json({ message: "No pending withdrawals" });
  }

  return res.json({ requests: Withdrawals });
};
export const getDepartmentEnrollmentRequests = async (
  req: Request,
  res: Response
) => {
  const department = req.params.department;
  const Ids: any = [];
  const Withdrawals: any = [];
  const students = await Student.find({ department_id: department });
  students.map((student: any) => {
    Ids.push(student._id);
  });
  for (const id of Ids) {
    const withdrawal = await Withdrawal.findOne({
      $or: [
        { status: "Student-enroll", stud_id: id },
        {
          status: "Department-enroll",
          stud_id: id,
          "rejections.by": "Registrar",
        },
      ],
    }).populate({
      path: "stud_id",
      select: "name id phone email",
    });
    if (!withdrawal) {
      continue;
    }
    Withdrawals.push(withdrawal);
  }
  if (Withdrawals.length == 0) {
    return res.status(200).json({ message: "No pending withdrawals" });
  }

  return res.json({ requests: Withdrawals });
};
export const getRegistrarWithdrawalRequests = async (
  req: Request,
  res: Response
) => {
  const withdrawalRequests = await Withdrawal.find({
    status: "Department-Withdrawal",
  }).populate({
    path: "stud_id",
    select: "name id phone email",
  });

  if (!withdrawalRequests) {
    return res.status(400).json({ message: "No pending withdrawals" });
  }

  return res.status(200).json({ message: withdrawalRequests });
};

export const getRegistrarEnrollmentRequests = async (
  req: Request,
  res: Response
) => {
  const withdrawalRequests = await Withdrawal.find({
    status: "Department-enroll",
  }).populate({
    path: "stud_id",
    select: "name id phone email",
  });

  if (!withdrawalRequests) {
    return res.status(400).json({ message: "No pending withdrawals" });
  }

  return res.status(200).json({ message: withdrawalRequests });
};
export const AcceptDepartmentWithdrawalRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  console.log(ids);
  const errors: any = [];
  const success: any = [];

  for (const id of ids) {
    const student = await Student.findById(id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id}`);
    }

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id },
      { status: "Department-Withdrawal" }
    );

    if (!updated) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }

  return res.status(200).json({ success: success, errors: errors });
};

export const AcceptDepartmentEnrollmentRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  console.log(ids);
  const errors: any = [];
  const success: any = [];

  for (const id of ids) {
    const student = await Student.findById(id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id}`);
    }

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id },
      { status: "Department-enroll" }
    );

    if (!updated) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }

  return res.status(200).json({ success: success, errors: errors });
};
export const AcceptRegistrarWithdrawalRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  const errors: any = [];
  const success: any = [];
  const emails: any = [];

  for (const id of ids) {
    const student = await Student.findById(id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id}`);
    }
    emails.push(student.email);
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

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id },
      {
        status: "Registrar-withdrawal",
        history: { type: "Withdrawal", date: new Date() },
      }
    );
    const updatedstudent = await Student.findByIdAndUpdate(id, {
      status: "Withdrawn",
    });

    if (!updated || !updatedstudent) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }
  const data = {
    data: {
      srecipient: emails,
      message: "Withdrawal request is Accepted",
      type: "Withdrawal Request",
    },
    name: "student",
    dept_id: "6627f1cb16bcc35f5d498f30",
  };
  await Notification(data);

  return res.status(200).json({ success: success, errors: errors });
};
export const AcceptRegistrarEnrollmentRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  const errors: any = [];
  const success: any = [];
  const emails: any = [];

  for (const id of ids) {
    const student = await Student.findById(id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id}`);
    }
    emails.push(student.email);

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id },
      {
        status: "Registrar-enroll",
        history: { type: "Enrollment", date: new Date() },
      }
    );
    const updatedstudent = await Student.findByIdAndUpdate(id, {
      status: "Active",
    });

    if (!updated || !updatedstudent) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }
  const data = {
    data: {
      srecipient: emails,
      message: "Enrollment request is Accepted",
      type: "Enrollment Request",
    },
    name: "student",
    dept_id: "6627f1cb16bcc35f5d498f30",
  };
  await Notification(data);

  return res.status(200).json({ success: success, errors: errors });
};
export const RejectDepartmentWithdrawalRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  const errors: any = [];
  const success: any = [];

  for (const id of ids) {
    const student = await Student.findById(id.id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id.id}`);
    }

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id.id },
      {
        status: "Student-Withdrawal",
        rejections: {
          by: "Department",
          reason: id.reason,
        },
      }
    );

    if (!updated) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }

  return res.status(200).json({ success: success, errors: errors });
};

export const RejectRegistrarWithdrawalRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  const errors: any = [];
  const success: any = [];
  const emails: any = [];

  for (const id of ids) {
    const student = await Student.findById(id.id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id.id}`);
    }
    emails.push(student.email);

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id.id },
      {
        status: "Department-Withdrawal",
        rejections: {
          by: "Registrar",
          reason: id.reason,
        },
      }
    );

    if (!updated) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }
  const data = {
    data: {
      srecipient: emails,
      message: "Withdrawal request is Rejected",
      type: "Withdrawal Request",
    },
    name: "student",
    dept_id: "6627f1cb16bcc35f5d498f30",
  };
  await Notification(data);

  return res.status(200).json({ success: success, errors: errors });
};

export const RejectRegistrarEnrollmentRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  const errors: any = [];
  const success: any = [];
  const emails: any = [];

  for (const id of ids) {
    const student = await Student.findById(id.id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id.id}`);
    }
    emails.push(student.email);

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id.id },
      {
        status: "Department-enroll",
        rejections: {
          by: "Registrar",
          reason: id.reason,
        },
      }
    );

    if (!updated) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }
  const data = {
    data: {
      srecipient: emails,
      message: "enrollment request is rejected",
      type: "Enrollment Request",
    },
    name: "student",
    dept_id: "6627f1cb16bcc35f5d498f30",
  };
  await Notification(data);

  return res.status(200).json({ success: success, errors: errors });
};
export const RejectDepartmentEnrollmentRequest = async (
  req: Request,
  res: Response
) => {
  const ids: any = req.body.data;
  const errors: any = [];
  const success: any = [];

  for (const id of ids) {
    const student = await Student.findById(id.id);
    let status: Boolean = false;
    if (!student) {
      errors.push(`Could not find student with id ${id.id}`);
    }

    const updated = await Withdrawal.findOneAndUpdate(
      { stud_id: id.id },
      {
        status: "Student-enroll",
        rejections: {
          by: "Department",
          reason: id.reason,
        },
      }
    );

    if (!updated) {
      errors.push(`Could not update student with name ${student.name}`);
    } else {
      success.push(` updated student with name ${student.name}`);
    }
  }

  return res.status(200).json({ success: success, errors: errors });
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
