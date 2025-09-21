import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import ClientFormModal from "../components/modal/ClientFormModal";
import ConfirmtionModal from "../components/modal/ConfirmtionModal";

import ClientTable from "../components/tables/Client/ClientTable";
import useClientModal from "../hooks/useClientModal";
import useConfirmationModal from "../hooks/useConfirmationModal";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { ClientType, deleteClient } from "../store/slices/clientSlice";

export default function Client() {
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
      <PageMeta
        title="Client Management"
        description="Client management-manage who are the buyers of lots"
      />
      <div className="space-y-6">
        <ComponentCard
          title="Clients"
          actions={[
            <button
              key="add"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
              onClick={openClientModal}
            >
              Add new client
            </button>,
          ]}
        >
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
