import { createContext, use, useContext, useEffect, useState } from "react";

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
}

export enum Role {
  Agent = "agent",
  Employee = "employee",
}

export enum UserRole {
  Staff = "staff",
  Manager = "manager",
  Admin = "admin",
}

const UserContext = createContext<ContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [curUser, setCurUser] = useState<UserType>();

  // mock users
  const users: UserType[] = [
    // Agents
    {
      _id: "1",
      profilePicc: "https://randomuser.me/api/portraits/men/11.jpg",
      firstName: "John",
      middleName: "A",
      lastName: "Cruz",
      email: "john.cruz@example.com",
      userName: "johncruz",
      passWord: "agent123",
      role: Role.Agent,
      userRole: UserRole.Staff,
    },
    {
      _id: "2",
      profilePicc: "https://randomuser.me/api/portraits/women/12.jpg",
      firstName: "Maria",
      middleName: "B",
      lastName: "Santos",
      email: "maria.santos@example.com",
      userName: "marias",
      passWord: "agent456",
      role: Role.Agent,
      userRole: UserRole.Staff,
    },
    {
      _id: "3",
      profilePicc: "https://randomuser.me/api/portraits/men/13.jpg",
      firstName: "Carlos",
      middleName: "D",
      lastName: "Reyes",
      email: "carlos.reyes@example.com",
      userName: "carlosr",
      passWord: "agent789",
      role: Role.Agent,
      userRole: UserRole.Staff,
    },
    {
      _id: "4",
      profilePicc: "https://randomuser.me/api/portraits/women/14.jpg",
      firstName: "Angela",
      middleName: "E",
      lastName: "Lopez",
      email: "angela.lopez@example.com",
      userName: "angelal",
      passWord: "agent321",
      role: Role.Agent,
      userRole: UserRole.Staff,
    },
    {
      _id: "5",
      profilePicc: "https://randomuser.me/api/portraits/men/15.jpg",
      firstName: "Mark",
      middleName: "F",
      lastName: "Villanueva",
      email: "mark.v@example.com",
      userName: "markv",
      passWord: "agent654",
      role: Role.Agent,
      userRole: UserRole.Staff,
    },

    // Employees
    {
      _id: "6",
      profilePicc: "https://randomuser.me/api/portraits/men/21.jpg",
      firstName: "Joseph",
      middleName: "G",
      lastName: "Garcia",
      email: "joseph.g@example.com",
      userName: "josephg",
      passWord: "emp123",
      role: Role.Employee,
      userRole: UserRole.Manager,
    },
    {
      _id: "7",
      profilePicc: "https://randomuser.me/api/portraits/women/22.jpg",
      firstName: "Sophia",
      middleName: "H",
      lastName: "Dela Cruz",
      email: "sophia.dc@example.com",
      userName: "sophiadc",
      passWord: "emp456",
      role: Role.Employee,
      userRole: UserRole.Staff,
    },
    {
      _id: "8",
      profilePicc: "https://randomuser.me/api/portraits/men/23.jpg",
      firstName: "Anthony",
      middleName: "I",
      lastName: "Torres",
      email: "anthony.t@example.com",
      userName: "anthonyt",
      passWord: "admin123",
      role: Role.Employee,
      userRole: UserRole.Admin,
    },
  ];

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
          return { success: true };
        }
      }
    }

    return { success: false, message: "there is no match for this username" };
  };

  const handleSignOut = () => {
    setCurUser(undefined);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{ users, curUser, setCurUser, login, handleSignOut }}
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
