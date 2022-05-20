import * as Yup from "yup";

export const PostValidationSchema = Yup.object({
  body: Yup.string()
    .max(50, "Too Long!")
    .required("Required"),
});
