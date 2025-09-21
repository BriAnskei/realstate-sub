import { useCallback, useState } from "react";
import { AgentType } from "../store/slices/agentSlice";

const useAgentModal = () => {
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editData, setEditData] = useState<AgentType | undefined>(undefined);

  const openAgentModal = useCallback(() => setIsAgentModalOpen(true), []);
  const closeAgentModal = useCallback(() => {
    setIsAgentModalOpen(false);
    setEditData(undefined);
  }, []);
  const toggleAgentModal = useCallback(
    () => setIsAgentModalOpen((prev) => !prev),
    []
  );
  const editAgent = useCallback((data: AgentType) => {
    setIsAgentModalOpen(true);
    setEditData(data);
  }, []);

  return {
    isAgentModalOpen,
    openAgentModal,
    closeAgentModal,
    toggleAgentModal,
    editAgent,
    editData,
  };
};

export default useAgentModal;
