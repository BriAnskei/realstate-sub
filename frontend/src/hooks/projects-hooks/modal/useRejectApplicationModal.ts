import { useState, useCallback } from "react";
import { ApplicationType } from "../../../store/slices/applicationSlice";

export const useRejectApplicationModal = (initialState: boolean = false) => {
  const [isAppRejectionOpen, setIsAppRejectionOpen] = useState(initialState);
  const [appToReject, setApptoReject] = useState<ApplicationType | undefined>(
    undefined
  );

  const openAppRejectionModal = useCallback(
    (applicationToReject: ApplicationType) => {
      setApptoReject(applicationToReject);
      setIsAppRejectionOpen(true);
    },
    []
  );
  const closeAppRejectionModal = useCallback(
    () => setIsAppRejectionOpen(false),
    []
  );
  const toggleAppRejectionModal = useCallback(
    () => setIsAppRejectionOpen((prev) => !prev),
    []
  );

  return {
    appToReject,
    isAppRejectionOpen,
    openAppRejectionModal,
    closeAppRejectionModal,
    toggleAppRejectionModal,
  };
};
