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

type currentUserType = {
  username: string;
};

type userContextType = {
  currentUser: currentUserType;
  setCurrentUser: Dispatch<SetStateAction<currentUserType>>;
};

const defaultValue: userContextType = {
  currentUser: {
    username: "",
  },
  setCurrentUser: () => {},
};

const userContext = createContext(defaultValue);

export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<currentUserType>({
    username: "",
  });

  return (
    <userContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  return useContext(userContext);
}
