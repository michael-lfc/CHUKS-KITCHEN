// // // import { Request, Response, NextFunction } from "express";
// // // import jwt from "jsonwebtoken";
// // // import { AppError } from "../utils/AppError.js";

// // // export const protect = (req: Request, _res: Response, next: NextFunction) => {
// // //   try {
// // //     const authHeader = req.headers.authorization;

// // //     // 1️⃣ Check header exists and has Bearer token
// // //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// // //       return next(new AppError("Not authorized: Missing token", 401));
// // //     }

// // //     const token = authHeader.split(" ")[1];
// // //     if (!token) return next(new AppError("Not authorized: Token missing", 401));

// // //     // 2️⃣ Check JWT_SECRET exists
// // //     const secret = process.env.JWT_SECRET;
// // //     if (!secret) return next(new AppError("Server error: JWT secret not set", 500));

// // //     // 3️⃣ Verify token safely
// // //     let decoded;
// // //     try {
// // //       decoded = jwt.verify(token, secret) as {
// // //         id: number;
// // //         email: string;
// // //         role: string;
// // //       };
// // //     } catch (err) {
// // //       console.error("JWT verification failed:", err);
// // //       return next(new AppError("Invalid or expired token", 401));
// // //     }

// // //     // 4️⃣ Attach decoded user to request
// // //     req.user = decoded;
// // //     next();
// // //   } catch (err) {
// // //     console.error("Protect middleware unexpected error:", err);
// // //     next(new AppError("Authentication failed", 401));
// // //   }
// // // };

// // import { Request, Response, NextFunction } from "express";
// // import jwt from "jsonwebtoken";
// // import { AppError } from "../utils/AppError.js";

// // export const protect = (req: Request, _res: Response, next: NextFunction) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //       return next(new AppError("Not authorized: Missing token", 401));
// //     }

// //     const token = authHeader.split(" ")[1];
// //     if (!token) return next(new AppError("Not authorized: Token missing", 401));

// //     const secret = process.env.JWT_SECRET;
// //     if (!secret) return next(new AppError("Server error: JWT secret not set", 500));

// //     // Use a nested try/catch so jwt.verify errors never crash Node
// //     try {
// //       const decoded = jwt.verify(token, secret) as { id: number; email: string; role: string };
// //       req.user = decoded;
// //       return next();
// //     } catch (jwtErr) {
// //       console.error("JWT verification failed:", jwtErr);
// //       return next(new AppError("Invalid or expired token", 401));
// //     }
// //   } catch (err) {
// //     console.error("Protect middleware unexpected error:", err);
// //     return next(new AppError("Authentication failed", 401));
// //   }
// // };

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { AppError } from "../utils/AppError.js";

// export const protect = (req: Request, _res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(new AppError("Not authorized: Missing token", 401));
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) return next(new AppError("Not authorized: Token missing", 401));

//     const secret = process.env.JWT_SECRET;
//     if (!secret) return next(new AppError("Server error: JWT secret not set", 500));

//     try {
//       const decoded = jwt.verify(token, secret) as { id: number; email: string; role: string };
//       req.user = decoded;
//       next();
//     } catch (jwtErr) {
//       console.error("JWT verification failed:", jwtErr);
//       next(new AppError("Invalid or expired token", 401));
//     }
//   } catch (err) {
//     console.error("Protect middleware unexpected error:", err);
//     next(new AppError("Authentication failed", 401));
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      console.warn("Protect middleware: No Authorization header");
      return next(new AppError("Not authorized", 401));
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Protect middleware: JWT_SECRET not set");
      return next(new AppError("JWT secret not set", 500));
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.warn("Protect middleware: Invalid token", err);
      return next(new AppError("Invalid or expired token", 401));
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("Protect middleware unexpected error:", err);
    next(new AppError("Authentication failed", 500));
  }
};
