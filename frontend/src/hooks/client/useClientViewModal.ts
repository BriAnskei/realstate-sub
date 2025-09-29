import { useCallback, useState } from "react";
import { ClientType } from "../../store/slices/clientSlice";

const useClientInfoModal = () => {
  const [isClientInfoModalOpen, setIsClientInfoModalOpen] = useState(false);
  const [data, setData] = useState<ClientType | undefined>(undefined);

  const openClientInfoModal = useCallback((clientData: ClientType) => {
    setData(clientData);
    setIsClientInfoModalOpen(true);
  }, []);
  const closeClientInfoModal = useCallback(() => {
    setIsClientInfoModalOpen(false);
    setData(undefined);
  }, []);
  const toggleClientModal = useCallback(
    () => setIsClientInfoModalOpen((prev) => !prev),
    []
  );

  return {
    isClientInfoModalOpen,
    openClientInfoModal,
    closeClientInfoModal,
    toggleClientModal,
    data,
  };
};

export default useClientInfoModal;
