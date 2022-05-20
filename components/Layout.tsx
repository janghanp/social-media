import React from "react";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { status } = useSession();

  if (status === "loading") {
    return <></>;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50/50">{children}</main>
    </>
  );
};

export default Layout;
