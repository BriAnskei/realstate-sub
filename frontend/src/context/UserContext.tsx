import { createContext, use, useContext, useState } from "react";

interface UserType {
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
  curUser: UserType;
  setCurUser: React.Dispatch<React.SetStateAction<UserType>>;
  login: (data: { role: string; userName: string; password: string }) => {
    success: boolean;
    message?: string;
    type?: string;
  };
}

const UserContext = createContext<ContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [curUser, setCurUser] = useState<UserType>({} as UserType);

  // mock users
  const users: UserType[] = [
    // Agents
    {
      profilePicc: "https://randomuser.me/api/portraits/men/11.jpg",
      firstName: "John",
      middleName: "A",
      lastName: "Cruz",
      email: "john.cruz@example.com",
      userName: "johncruz",
      passWord: "agent123",
      role: "agent",
      userRole: "staff",
    },
    {
      profilePicc: "https://randomuser.me/api/portraits/women/12.jpg",
      firstName: "Maria",
      middleName: "B",
      lastName: "Santos",
      email: "maria.santos@example.com",
      userName: "marias",
      passWord: "agent456",
      role: "agent",
      userRole: "staff",
    },
    {
      profilePicc: "https://randomuser.me/api/portraits/men/13.jpg",
      firstName: "Carlos",
      middleName: "D",
      lastName: "Reyes",
      email: "carlos.reyes@example.com",
      userName: "carlosr",
      passWord: "agent789",
      role: "agent",
      userRole: "staff",
    },
    {
      profilePicc: "https://randomuser.me/api/portraits/women/14.jpg",
      firstName: "Angela",
      middleName: "E",
      lastName: "Lopez",
      email: "angela.lopez@example.com",
      userName: "angelal",
      passWord: "agent321",
      role: "agent",
      userRole: "staff",
    },
    {
      profilePicc: "https://randomuser.me/api/portraits/men/15.jpg",
      firstName: "Mark",
      middleName: "F",
      lastName: "Villanueva",
      email: "mark.v@example.com",
      userName: "markv",
      passWord: "agent654",
      role: "agent",
      userRole: "staff",
    },

    // Employees
    {
      profilePicc: "https://randomuser.me/api/portraits/men/21.jpg",
      firstName: "Joseph",
      middleName: "G",
      lastName: "Garcia",
      email: "joseph.g@example.com",
      userName: "josephg",
      passWord: "emp123",
      role: "employee",
      userRole: "manager",
    },
    {
      profilePicc: "https://randomuser.me/api/portraits/women/22.jpg",
      firstName: "Sophia",
      middleName: "H",
      lastName: "Dela Cruz",
      email: "sophia.dc@example.com",
      userName: "sophiadc",
      passWord: "emp456",
      role: "employee",
      userRole: "staff",
    },
    {
      profilePicc: "https://randomuser.me/api/portraits/men/23.jpg",
      firstName: "Anthony",
      middleName: "I",
      lastName: "Torres",
      email: "anthony.t@example.com",
      userName: "anthonyt",
      passWord: "admin123",
      role: "employee",
      userRole: "admin", // 👈 Admin inside employee group
    },
  ];

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

  return (
    <UserContext.Provider value={{ users, curUser, setCurUser, login }}>
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
