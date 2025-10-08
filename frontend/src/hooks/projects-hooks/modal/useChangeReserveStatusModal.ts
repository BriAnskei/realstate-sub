import { useCallback, useState } from "react";
import { ReserveType } from "../../../store/slices/reservationSlice";

const useReserveChangeStatusModal = () => {
  const [isReserveChangeStatusModalOpen, setIsReserveChangeStatusModalOpen] =
    useState(false);
  const [reservationToOpen, setReservationToOpen] = useState<
    undefined | ReserveType
  >(undefined);

  const openReserveChangeStatusModal = useCallback(
    (reservation: ReserveType) => {
      setReservationToOpen(reservation);
      setIsReserveChangeStatusModalOpen(true);
    },
    []
  );

  const closeReserveChangeStatusModal = useCallback(() => {
    setIsReserveChangeStatusModalOpen(false);
    setReservationToOpen(undefined);
  }, []);
  const toggleReserveChangeStatusModal = useCallback(
    () => setIsReserveChangeStatusModalOpen((prev) => !prev),
    []
  );

  return {
    isReserveChangeStatusModalOpen,
    openReserveChangeStatusModal,
    closeReserveChangeStatusModal,
    toggleReserveChangeStatusModal,
    reservationToOpen,
  };
};

export default useReserveChangeStatusModal;
