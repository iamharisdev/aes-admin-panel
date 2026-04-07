import * as Yup from "yup";
import { phoneRule, optionalPhoneRule } from "./rules";

const minIfSet = (min: number, msg: string) =>
  Yup.string().test("min-if-set", msg, (v) => !v || v.length >= min);

export const hospitalSchema = Yup.object({
  name: Yup.string()
    .min(2, "At least 2 characters")
    .required("Hospital name is required"),

  address: Yup.string()
    .min(5, "At least 5 characters")
    .required("Address is required"),

  phone: phoneRule.required("Phone is required"),

  email: Yup.string().email("Enter a valid email").optional(),

  licenseNumber: Yup.string().optional(),

  contactPerson: minIfSet(2, "At least 2 characters").optional(),

  contactPersonPhone: optionalPhoneRule,

  city: minIfSet(2, "At least 2 characters").optional(),

  state: Yup.string().optional(),

  pincode: Yup.string()
    .test("pincode-if-set", "Must be 5–6 digits", (v) =>
      !v || /^[0-9]{5,6}$/.test(v)
    )
    .optional(),

  country: Yup.string().required("Country is required"),

  isActive: Yup.mixed<"Y" | "N">()
    .oneOf(["Y", "N"] as const)
    .required(),
});

export type HospitalFormValues = Yup.InferType<typeof hospitalSchema>;
