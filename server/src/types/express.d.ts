// declare namespace Express {
//   export interface Request {
//     user?: {
//       id: number;
//       email: string;
//       role: string;
//     };
//   }
// }

// src/types/express.d.ts

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };

      file?: Express.Multer.File; // ⭐ REQUIRED for multer
    }
  }
}

export {};
