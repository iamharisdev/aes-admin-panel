import * as Yup from "yup";
import { optionalPhoneRule } from "./rules";

const baseFields = {
  name: Yup.string()
    .min(2, "At least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: optionalPhoneRule,
  roleId: Yup.string().required("Please select a role"),
  hospitalId: Yup.string().optional(),
  isActive: Yup.mixed<"Y" | "N">()
    .oneOf(["Y", "N"] as const)
    .required(),
};

export const createUserSchema = Yup.object({
  ...baseFields,
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[^A-Za-z0-9]/, "Must include a special character")
    .required("Password is required"),
});

export const updateUserSchema = Yup.object(baseFields);

export type CreateUserFormValues = Yup.InferType<typeof createUserSchema>;
export type UpdateUserFormValues = Yup.InferType<typeof updateUserSchema>;
