import { createContext, useContext, useEffect, useState } from "react";
import { ApplicationType } from "../store/slices/applicationSlice";
import { useLocation } from "react-router";

interface ContextValue {
  editApplication: ApplicationType | undefined;
  setEditApplication: React.Dispatch<
    React.SetStateAction<ApplicationType | undefined>
  >;
  clearUpdateContext: () => void;
}

const ApplicationContext = createContext<ContextValue | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [editApplication, setEditApplication] = useState<
    ApplicationType | undefined
  >(
    JSON.parse(localStorage.getItem("application-update") ?? "null") ||
      undefined
  );

  useEffect(() => {
    if (editApplication) {
      localStorage.setItem(
        "application-update",
        JSON.stringify(editApplication)
      );
    }
  }, [editApplication]);

  const clearUpdateContext = () => {
    console.log("Clearing appcontext");
    setEditApplication(undefined);
    localStorage.removeItem("application-update");
  };

  return (
    <ApplicationContext.Provider
      value={{ editApplication, setEditApplication, clearUpdateContext }}
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
