import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useClientModal from "../../../hooks/useClientModal";
import useConfirmationModal from "../../../hooks/useConfirmationModal";
import { ClientType, deleteClient } from "../../../store/slices/clientSlice";
import { AppDispatch, RootState } from "../../../store/store";
import ComponentCard from "../../common/ComponentCard";
import PageMeta from "../../common/PageMeta";
import ClientFormModal from "../../modal/client/ClientFormModal";
import ConfirmtionModal from "../../modal/ConfirmtionModal";
import ClientTable from "../Client/ClientTable";

export default function AvailableLots() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    openClientModal,
    closeClientModal,
    isClientModalOpen,
    editData,
    editClient,
  } = useClientModal();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const [deleteData, setDeleteData] = useState<ClientType>();

  const { allIds, byId, updateLoading } = useSelector(
    (state: RootState) => state.client
  );

  const deleteHanlder = async () => {
    try {
      await dispatch(deleteClient(deleteData!));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="Available Lots">
          <ClientTable
            setDeleteData={setDeleteData}
            openConfirmationModal={openConfirmationModal}
            editClient={editClient}
            allIds={allIds}
            byId={byId}
          />
        </ComponentCard>
      </div>
      <ClientFormModal
        updateLoading={updateLoading}
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        data={editData}
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
