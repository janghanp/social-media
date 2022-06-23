import {
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

type Props = {
  children: React.ReactNode;
};

type userContextType = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

const defaultValue: userContextType = { username: "", setUsername: () => {} };

const userContext = createContext(defaultValue);

export function UserProvider({ children }: Props) {
  const [username, setUsername] = useState<string>("");

  return (
    <userContext.Provider value={{ username, setUsername }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  return useContext(userContext);
}
