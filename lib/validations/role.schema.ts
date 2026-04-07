import * as Yup from "yup";

export const roleSchema = Yup.object({
  name: Yup.string()
    .min(2, "At least 2 characters")
    .required("Role name is required"),
  description: Yup.string().optional(),
});

export type RoleFormValues = Yup.InferType<typeof roleSchema>;
