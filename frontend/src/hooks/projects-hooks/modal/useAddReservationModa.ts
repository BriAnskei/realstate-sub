import { useCallback, useState } from "react";

const useReservationAddModal = () => {
  const [isReservationAddModalOpen, setIsReservationAddModalOpen] =
    useState(false);

  const openReservationAddModal = useCallback(
    () => setIsReservationAddModalOpen(true),
    []
  );
  const closeReservationAddModal = useCallback(() => {
    setIsReservationAddModalOpen(false);
  }, []);
  const toggleReservationAddModal = useCallback(
    () => setIsReservationAddModalOpen((prev) => !prev),
    []
  );

  return {
    isReservationAddModalOpen,
    openReservationAddModal,
    closeReservationAddModal,
    toggleReservationAddModal,
  };
};

export default useReservationAddModal;
