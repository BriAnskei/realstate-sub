import { useCallback, useState } from "react";
import { ClientType } from "../../store/slices/clientSlice";

const useClientModal = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editData, setEditData] = useState<ClientType | undefined>(undefined);

  const openClientModal = useCallback(() => setIsClientModalOpen(true), []);
  const closeClientModal = useCallback(() => {
    setIsClientModalOpen(false);
    setEditData(undefined);
  }, []);
  const toggleClientModal = useCallback(
    () => setIsClientModalOpen((prev) => !prev),
    []
  );
  const editClient = useCallback((data: ClientType) => {
    setIsClientModalOpen(true);
    setEditData(data);
  }, []);

  return {
    isClientModalOpen,
    openClientModal,
    closeClientModal,
    toggleClientModal,
    editClient,
    editData,
  };
};

export default useClientModal;
