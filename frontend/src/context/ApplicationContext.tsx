import { createContext, useContext, useState } from "react";
import { ApplicationType } from "../store/slices/applicationSlice";

interface ContextValue {
  editApplication: ApplicationType | undefined;
  setEditApplication: React.Dispatch<
    React.SetStateAction<ApplicationType | undefined>
  >;
}

const ApplicationContext = createContext<ContextValue | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [editApplication, setEditApplication] = useState<
    ApplicationType | undefined
  >(undefined);

  return (
    <ApplicationContext.Provider
      value={{ editApplication, setEditApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplication must be used within a ApplicationProvider");
  }

  return context;
};
