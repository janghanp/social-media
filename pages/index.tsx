import type { NextPage, GetServerSideProps } from "next";

import { prisma } from "../lib/prisma";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const users = await prisma.user.findMany();
//
//   return {
//     props: { users },
//   };
// };

const Home: NextPage = () => {
  return <div className="container mx-auto border h-full">home</div>;
};

export default Home;
