import { check } from "express-validator";

export const isUserValidator = [
  check("firstName").isString().trim().notEmpty().withMessage("First name is required"),
  check("lastName").isString().trim().notEmpty().withMessage("Last name is required"),
  check("username").isString().trim().notEmpty().withMessage("Username is required"),
  check("password").isString().trim().isLength({ min: 4 }).withMessage("Password must be at least 4 characters"),
  check("email").optional({ checkFalsy: true }).isEmail().trim(),
];
