import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";

import Navbar from "./Navbar";
import { useUserContext } from "../context/user";

type Props = {
  children: React.ReactNode;
};

const fetcher = (url: string) =>
  axios.get(url).then((response) => response.data);

const Layout = ({ children }: Props) => {
  const router = useRouter();

  const userNameCheckedRef = useRef<boolean>(false);

  const { setCurrentUser } = useUserContext();

  const { status } = useSession();

  const { data, error } = useSWR("/api/user", fetcher);

  useEffect(() => {
    if (data) {
      setCurrentUser({ username: data.user.username });
    }
  }, [data]);

  if (status === "loading" || !data) {
    return <></>;
  }

  if (error) {
    return <div>An error has ocuurred...</div>;
  }

  if (!userNameCheckedRef.current && data.user && !data.user.username) {
    userNameCheckedRef.current = true;

    router.push("/welcome");
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50/50">{children}</main>
    </>
  );
};

export default Layout;
