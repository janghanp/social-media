import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useFormik, FormikHelpers } from 'formik';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import axios from 'axios';

import { useCurrentUserState } from '../store';
import { UserInfoValidationSchema } from '../lib/validation';
import { FadeLoader, SyncLoader } from 'react-spinners';
import Alert from '../components/Alert';
import { getToken } from 'next-auth/jwt';

interface UserInfo {
  name: string;
  userName: string;
  email: string;
  image: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwt = await getToken({ req: context.req, secret: process.env.SECRET });

  if (!jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const Settings: NextPage = () => {
  const router = useRouter();

  const [image, setImage] = useState<File | null>();
  const [preview, setPreview] = useState<string>();
  const [imageError, setImageError] = useState<string>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentUser, setCurrentUser } = useCurrentUserState();

  const formik = useFormik<UserInfo>({
    initialValues: {
      name: currentUser!.name!,
      userName: currentUser!.username!,
      email: currentUser!.email!,
      image: currentUser!.image!,
    },
    validationSchema: UserInfoValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (
      values: UserInfo,
      formikHelpers: FormikHelpers<UserInfo>
    ) => {
      setIsLoading(true);

      try {
        const { data } = await axios.put('/api/user', {
          name: values.name.trim(),
          userName: values.userName.trim(),
        });

        setCurrentUser(data.user);
      } catch (error: any) {
        if (error.response.status === 400) {
          formikHelpers.setErrors({
            userName: 'This username is already taken.',
          });
        }

        return;
      } finally {
        setIsLoading(false);
      }

      router.push('/');
    },
  });

  useEffect(() => {
    const uploadFile = async () => {
      const formData = new FormData();
      formData.append('file', image!);
      formData.append('isProfile', 'isProfile');

      setImageLoading(true);

      const { data } = await axios.post('/api/upload', formData);

      await axios.delete('/api/profile');

      const imageUrl = `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/profile/${data.Key}`;

      const { data: userData } = await axios.patch('/api/user', {
        imageUrl,
      });

      setImageLoading(false);
      setShowAlert(true);

      setCurrentUser(userData.user);
    };

    if (image && !imageError) {
      uploadFile();
    }
  }, [image]);

  const changeFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    if (file) {
      if (file.size > 1000000) {
        setImageError('The image should be less than 1MB.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(file);
        setPreview(reader.result as string);
        setImageError('');
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container relative mx-auto mt-16 flex min-h-screen max-w-4xl flex-col justify-start border px-2 pt-10 lg:px-0">
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        message="The profile image has been updated."
      />
      <div className="mt-5 flex w-full flex-col items-center">
        <div className={`avatar relative mb-3`}>
          <div className={`relative w-28 rounded-full`}>
            <img src={preview || currentUser?.image} />
            {imageLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50 pl-2">
                <FadeLoader margin={5} />
              </div>
            )}
          </div>
        </div>

        {imageError && (
          <span className="mb-2 text-sm text-warning">{imageError}</span>
        )}
        <input
          type="file"
          ref={fileInputRef}
          id="file-upload"
          accept=".jpeg, .jpg, .png"
          className="hidden"
          onChange={changeFileHandler}
        />
        <button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className="flex flex-row items-center justify-center rounded-md border-2 border-primary bg-white p-1 text-sm text-black transition duration-200 hover:bg-black hover:text-white"
        >
          <HiOutlinePencil className="mr-1" />
          Edit
        </button>
        <form
          onSubmit={formik.handleSubmit}
          className="flex w-full flex-col items-center justify-start gap-y-5"
        >
          <div className="w-full max-w-lg">
            <label className="label font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formik.values.email}
              placeholder="email"
              className="input disabled input-bordered input-primary w-full text-gray-500"
              disabled
            />
          </div>
          <div className="w-full max-w-lg">
            <label className="label font-semibold" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="name"
              className={`input input-bordered input-primary w-full ${
                formik.errors.name ? 'input-warning' : 'input-primary'
              } ${isLoading && 'text-gray-500'}`}
              disabled={isLoading}
            />
            {formik.errors.name && (
              <span className="text-sm text-red-500">{formik.errors.name}</span>
            )}
          </div>
          <div className="w-full max-w-lg">
            <label className="label font-semibold" htmlFor="userName">
              UserName
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              placeholder="userName"
              className={`input input-bordered input-primary w-full ${
                formik.errors.userName ? 'input-warning' : 'input-primary'
              } ${isLoading && 'text-gray-500'}`}
              disabled={isLoading}
            />
            {formik.errors.userName && (
              <span className="text-sm text-red-500">
                {formik.errors.userName}
              </span>
            )}
          </div>

          <div className="mt-5 flex max-w-xl flex-row space-x-5">
            <button
              type="submit"
              className={`btn btn-outline border-2 ${
                isLoading && 'btn-disabled'
              }`}
              disabled={
                isLoading ||
                (currentUser!.name === formik.values.name &&
                  currentUser!.username === formik.values.userName)
              }
            >
              {isLoading ? (
                <SyncLoader color="gray" size={8} margin={6} />
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
