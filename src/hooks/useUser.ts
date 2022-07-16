// import useSWRImmutable from "swr/immutable";
import axios from "axios";

// export default function useUser() {
//   const { data, mutate, error } = useSWRImmutable("/api/user");

//   return { data, mutate, error };
// }

const getUser = async () => {
  return axios.get("/api/user").then((response) => response.data);
};

import { useQuery } from "react-query";

export default function useUser() {
  const { data, error } = useQuery("user", getUser, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { data, error };
}
