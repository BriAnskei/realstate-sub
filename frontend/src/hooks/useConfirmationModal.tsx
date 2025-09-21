import { useCallback, useEffect, useState } from "react";

const useConfirmationModal = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const openConfirmationModal = useCallback(() => {
    setIsConfirmationOpen(true);
  }, []);
  const closeConfirmationModal = useCallback(
    () => setIsConfirmationOpen(false),
    []
  );

  const toggleConfirmationModal = useCallback(
    () => setIsConfirmationOpen((prev) => !prev),
    []
  );

  return {
    openConfirmationModal,
    closeConfirmationModal,
    toggleConfirmationModal,
    isConfirmationOpen,
  };
};

export default useConfirmationModal;
