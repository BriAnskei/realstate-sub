import { useState, useCallback } from "react";
import { ApplicationType } from "../../../store/slices/applicationSlice";

type action = "approved" | "rejected";

export const useActionApplicationModal = (initialState: boolean = false) => {
  const [isAppActionOpen, setIsAppActionOpen] = useState(initialState);
  const [actionType, setActionType] = useState<action>("rejected"); // default reject
  const [appToAction, setApptoAction] = useState<ApplicationType | undefined>(
    undefined
  );

  const openAppActionModal = useCallback(
    (applicationToAction: ApplicationType, action: action) => {
      setActionType(action);
      setApptoAction(applicationToAction);
      toggleAppActionModal();
    },
    []
  );
  const closeAppActionModal = useCallback(() => {
    setIsAppActionOpen(false);
    setActionType("rejected"); // back to defualt
  }, []);
  const toggleAppActionModal = useCallback(
    () => setIsAppActionOpen((prev) => !prev),
    []
  );

  return {
    appToAction,
    actionType,
    isAppActionOpen,
    openAppActionModal,
    closeAppActionModal,
    toggleAppActionModal,
  };
};
