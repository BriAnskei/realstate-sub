import { useCallback, useState } from "react";

import { ReserveType } from "../../../store/slices/reservationSlice";

const useContractReservationModal = () => {
  const [isContractReservationModalOpen, setIsContractReservationModalOpen] =
    useState(false);
  const [selectedData, setSelectedData] = useState<ReserveType | undefined>(
    undefined
  );

  const openContractReservationModal = useCallback(
    (reservation: ReserveType) => {
      setSelectedData(reservation);
      setIsContractReservationModalOpen(true);
    },
    []
  );
  const closeContractReservationModal = useCallback(() => {
    setIsContractReservationModalOpen(false);
    setSelectedData(undefined);
  }, []);
  const toggleContractReservationModal = useCallback(
    () => setIsContractReservationModalOpen((prev) => !prev),
    []
  );

  return {
    isContractReservationModalOpen,
    openContractReservationModal,
    closeContractReservationModal,
    toggleContractReservationModal,

    selectedData,
  };
};

export default useContractReservationModal;
