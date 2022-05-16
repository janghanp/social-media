import type { NextPage, GetServerSideProps } from "next";

import { prisma } from "../lib/prisma";

const Home: NextPage = () => {
  return <div className="">home</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await prisma.user.findMany();

  return {
    props: { users },
  };
};

export default Home;
