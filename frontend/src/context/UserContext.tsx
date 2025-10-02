import { createContext, useContext, useEffect, useState } from "react";
import { users } from "./mockData";

export interface UserType {
  _id?: string;
  profilePicc?: string;
  firstName?: string;
  middleName: string;
  lastName?: string;
  email?: string;
  userName?: string;
  passWord?: string;
  role?: string;
  userRole?: string;
}

interface ContextValue {
  users: UserType[];
  curUser: UserType | undefined;
  setCurUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
  login: (data: { role: string; userName: string; password: string }) => {
    success: boolean;
    message?: string;
    type?: string;
  };
  handleSignOut: () => void;
  isUserLogged: boolean;
}

const UserContext = createContext<ContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [curUser, setCurUser] = useState<UserType | undefined>(undefined);
  const [isUserLogged, setIsUserLogged] = useState<boolean>(
    Boolean(localStorage.getItem("user"))
  );

  useEffect(() => {
    const userLogJson = localStorage.getItem("user");

    if (userLogJson) {
      const useData = JSON.parse(userLogJson);

      setCurUser(useData);
    }
  }, []);

  useEffect(() => {
    if (curUser) {
      localStorage.setItem("user", JSON.stringify(curUser));
    }
  }, [curUser]);

  const login = (data: {
    role: string;
    userName: string;
    password: string;
  }) => {
    // Loop through mock users(agent/employees)
    for (const user of users) {
      if (user.role === data.role) {
        if (
          user.userName === data.userName &&
          user.passWord !== data.password
        ) {
          return {
            success: false,
            message: "Incorrect password",
            type: "password",
          };
        } else if (
          user.userName === data.userName &&
          user.passWord === data.password
        ) {
          setCurUser(user);
          setIsUserLogged(true);
          return { success: true };
        }
      }
    }

    return { success: false, message: "there is no match for this username" };
  };

  const handleSignOut = () => {
    setCurUser(undefined);

    localStorage.removeItem("user");
    setIsUserLogged(false);
  };

  return (
    <UserContext.Provider
      value={{ users, curUser, setCurUser, login, handleSignOut, isUserLogged }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const userUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("userUser must be used within a UserProvider");
  }
  return context;
};
