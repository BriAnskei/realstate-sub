import { useCallback, useState } from "react";
import { LotType } from "../../../store/slices/lotSlice";

const useLotModal = () => {
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [editData, setEditData] = useState<undefined | LotType>(undefined);

  const openLotModal = useCallback(() => setIsLotModalOpen(true), []);
  const closeLotModal = useCallback(() => {
    setIsLotModalOpen(false);
    setEditData(undefined);
  }, []);
  const toggleLotModal = useCallback(
    () => setIsLotModalOpen((prev) => !prev),
    []
  );
  const editLot = useCallback((data: any) => {
    setIsLotModalOpen(true);
    setEditData(data);
  }, []);

  return {
    isLotModalOpen,
    openLotModal,
    closeLotModal,
    toggleLotModal,
    editLot,
    editData,
  };
};

export default useLotModal;
