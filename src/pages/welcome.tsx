import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { useFormik } from 'formik';
import { UserNameValidationSchema } from '../lib/validation';
import FadeLoader from 'react-spinners/FadeLoader';

import { prisma } from '../lib/prisma';
import { useCurrentUserState } from '../store';

interface formikValue {
  userName: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwt = await getToken({ req: context.req, secret: process.env.SECRET });

  if (!jwt) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      id: jwt.sub,
    },
  });

  if (user?.username) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const Welcome: NextPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setCurrentUser = useCurrentUserState((state) => state.setCurrentUser);

  const formik = useFormik<formikValue>({
    initialValues: {
      userName: '',
    },
    validationSchema: UserNameValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: formikValue) => {
      const { userName } = values;

      setIsLoading(true);

      try {
        const response = await axios.post('/api/username', { userName });

        setIsLoading(false);
        setCurrentUser(response.data.updatedUser);

        router.push('/');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err?.response?.status === 409) {
            formik.setFieldError('userName', 'The username has already taken.');
            setIsLoading(false);
          }
        }
      }
    },
  });

  return (
    <div className="fixed inset-0 z-30 bg-black/80">
      <div className="absolute left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-10 shadow-lg sm:w-[500px]">
        <h1 className="text-center text-2xl font-semibold ">Welcome to social media!</h1>
        <h1 className="mt-5 text-center text-xl font-semibold">
          To be continued enter a username.
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-5 flex w-full items-center justify-between gap-x-5"
        >
          <input
            disabled={isLoading}
            id="userName"
            name="userName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.userName}
            type="text"
            placeholder="Type here"
            className={`input input-bordered input-primary w-full ${
              formik.errors.userName ? 'input-warning' : ''
            }`}
          />
          {isLoading ? (
            <FadeLoader />
          ) : (
            <button type="submit" className="btn">
              Enter
            </button>
          )}
        </form>
        {formik.errors.userName && (
          <span className="text-sm text-red-500">{formik.errors.userName}</span>
        )}
      </div>
    </div>
  );
};

export default Welcome;
