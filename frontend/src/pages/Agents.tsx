import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import ClientFormModal from "../components/modal/ClientFormModal";
import ConfirmtionModal from "../components/modal/ConfirmtionModal";
import useConfirmationModal from "../hooks/useConfirmationModal";
import { AppDispatch, RootState } from "../store/store";
import { useState } from "react";
import AgentsTable from "../components/tables/agents/AgentsTable";
import { AgentType, deleteAgent } from "../store/slices/agentSlice";
import useAgentModal from "../hooks/useAgentModal";
import AgentFormModal from "../components/modal/AgentFormModal";

export default function Agents() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isAgentModalOpen,
    openAgentModal,
    closeAgentModal,

    editAgent,
    editData,
  } = useAgentModal();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const [deleteData, setDeleteData] = useState<AgentType>();

  const { allIds, byId, updateLoading } = useSelector(
    (state: RootState) => state.agent
  );

  const deleteHanlder = async () => {
    try {
      await dispatch(deleteAgent(deleteData!));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      <PageMeta title="Client Management" description="Sales Agents" />
      <div className="space-y-6">
        <ComponentCard
          title="Agents"
          actions={[
            <button
              key="add"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
              onClick={openAgentModal}
            >
              Add new agent
            </button>,
          ]}
        >
          <AgentsTable
            setDeleteData={setDeleteData}
            openConfirmationModal={openConfirmationModal}
            editAgent={editAgent}
            allIds={allIds}
            byId={byId}
          />
        </ComponentCard>
      </div>

      <AgentFormModal
        isOpen={isAgentModalOpen}
        onClose={closeAgentModal}
        data={editData}
        updateLoading={updateLoading}
      />

      <ConfirmtionModal
        loading={updateLoading}
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        onConfirm={deleteHanlder}
      />
    </>
  );
}
