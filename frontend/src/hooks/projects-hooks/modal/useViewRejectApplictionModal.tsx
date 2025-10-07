import { useState, useCallback } from "react";
import { ApplicationType } from "../../../store/slices/applicationSlice";

export const useViewRejectApplictionModal = (initialState: boolean = false) => {
  const [isViewRejectionOpen, setIsViewRejectionOpen] = useState(initialState);
  const [appToView, setAppToView] = useState<ApplicationType | undefined>(
    undefined
  );

  const openAppRejectionViewModal = useCallback(
    (applicationToReject: ApplicationType) => {
      setAppToView(applicationToReject);
      setIsViewRejectionOpen(true);
    },
    []
  );
  const closeAppRejectionViewModal = useCallback(
    () => setIsViewRejectionOpen(false),
    []
  );
  const toggleAppRejectionViewModal = useCallback(
    () => setIsViewRejectionOpen((prev) => !prev),
    []
  );

  return {
    appToView,
    isViewRejectionOpen,
    openAppRejectionViewModal,
    closeAppRejectionViewModal,
    toggleAppRejectionViewModal,
  };
};
