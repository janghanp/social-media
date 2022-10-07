import * as Yup from 'yup';

export const PostValidationSchema = Yup.object({
  body: Yup.string().required('This field is required.'),
  files: Yup.array().min(1, 'you need to upload at least one photo.')
});

export const UserNameValidationSchema = Yup.object({
  userName: Yup.string().required('This field is required.'),
});

export const UserInfoValidationSchema = Yup.object({
  name: Yup.string().required('This field is required'),
  userName: Yup.string().required('This field is required.'),
});
