// Access Control Middleware (in a different service)
import { Request, Response, NextFunction } from "express";

const Student = require("../../models/student.model");

interface Reqq extends Request {
  user?: {
    email: string;
    role: string[];
  };
}

export const accessAuth = async (
  req: Reqq,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the access token from the request

    const user = await Student.find({ email: req.user?.email });

    if (!user) {
      return res.status(400).send("Forbidden");
    }

    // Attach the user data to the request object
    req.user = user;
    // If the user's role is 'student', call next()
    if (req.user?.role.includes("student")) {
      return next();
    } else {
      // Otherwise, send a 403 Forbidden response
      return res.status(403).send("Forbidden");
    }
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

// // Access Control Middleware (in a different service)
// import { Request, Response, NextFunction } from "express";

// const Student = require("../../models/student.model");

// interface Reqq extends Request {
//   user?: typeof Student
// }

// export const accessAuth = async (
//   req: Reqq,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Extract the access token from the request
//     const accessToken = req.headers.authorization?.split(" ")[1];
//     if (!accessToken) {
//       return res.status(401).send("Unauthorized");
//     }

//     // Call the /me endpoint in the authentication service
//     const response = await fetch("/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       return res.status(response.status).send(await response.text());
//     }

//     const { email, role } = await response.json();

//     const user = await Student.find({ email });

//     if (!user) {
//       return res.status(400).send("Forbidden");
//     }

//     // Attach the user data to the request object
//     req.user = user
//     // If the user's role is 'student', call next()
//     if (req.user.role.includes("student")) {
//       return next();
//     } else {
//       // Otherwise, send a 403 Forbidden response
//       return res.status(403).send("Forbidden");
//     }
//   } catch (e: any) {
//     return res.status(500).send(e.message);
//   }
// };
