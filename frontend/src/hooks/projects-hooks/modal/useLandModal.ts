import { useCallback, useState } from "react";
import { LandTypes } from "../../../store/slices/landSlice";

const useLandModal = () => {
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);
  const [editData, setEditData] = useState<undefined | LandTypes>(undefined);

  const openLandModal = useCallback(() => setIsLandModalOpen(true), []);
  const closeLandModal = useCallback(() => {
    setIsLandModalOpen(false);
    setEditData(undefined);
  }, []);
  const toggleLandModal = useCallback(
    () => setIsLandModalOpen((prev) => !prev),
    []
  );
  const editLand = useCallback((data: LandTypes) => {
    setEditData(data);
    setIsLandModalOpen(true);
  }, []);

  return {
    isLandModalOpen,
    openLandModal,
    closeLandModal,
    toggleLandModal,
    editLand,
    editData,
  };
};

export default useLandModal;
