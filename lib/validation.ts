import * as Yup from "yup";

export const PostValidationSchema = Yup.object({
  body: Yup.string().required("This field is required."),
});
