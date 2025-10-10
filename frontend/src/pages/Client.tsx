import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import ClientFormModal from "../components/modal/client/ClientFormModal";
import ConfirmtionModal from "../components/modal/ConfirmtionModal";

import ClientTable from "../components/tables/Client/ClientTable";
import useClientModal from "../hooks/useClientModal";
import useConfirmationModal from "../hooks/useConfirmationModal";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef, useState } from "react";
import {
  addClient,
  ClientType,
  deleteClient,
  resetClientFilter,
  searchClient,
  updateClientData,
} from "../store/slices/clientSlice";
import formDataToObject from "../utils/formDataToObject";
import { debouncer } from "../utils/debouncer";
import ClientInfoModal from "../components/modal/client/ClientInfoModal";
import useClientInfoModal from "../hooks/client/useClientViewModal";
import { userUser } from "../context/UserContext";
import { Role } from "../context/mockData";

export default function Client() {
  const dispatch = useDispatch<AppDispatch>();
  const { updateLoading, filterLoading, loading } = useSelector(
    (state: RootState) => state.client
  );
  const {
    openClientModal,
    closeClientModal,
    isClientModalOpen,
    editData,
    editClient,
  } = useClientModal();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const { curUser } = userUser();

  const {
    isClientInfoModalOpen,
    data,
    openClientInfoModal,
    closeClientInfoModal,
  } = useClientInfoModal();

  const [deleteData, setDeleteData] = useState<ClientType>();

  // filter
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

  // loading
  const [searchLoading, setSearchLoading] = useState(false);

  // refs
  const debouncedSearchRef = useRef<ReturnType<typeof debouncer> | null>(null);

  handlerFilter();

  // Inside your component
  useEffect(() => {
    if (search?.trim() || status) {
      setSearchLoading(true);
      debouncedSearchRef.current!({ searchTerm: search, status });
    } else {
      dispatch(resetClientFilter());
    }
  }, [search, status]);

  const deleteHanlder = async () => {
    try {
      await dispatch(deleteClient(deleteData!)).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  const handleNewClient = async (payload: FormData): Promise<void> => {
    try {
      await dispatch(addClient(payload)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const updateHanlder = async (payload: {
    data: FormData;
    clientId: number;
  }): Promise<void> => {
    try {
      const { clientId, data } = payload;
      const clientJSON = formDataToObject<ClientType>(data);
      await dispatch(updateClientData({ clientId, data: clientJSON })).unwrap();
    } catch (error) {
      throw error;
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
            isEmployee={curUser?.role === Role.Employee}
            status={status}
            openClientInfoModal={openClientInfoModal}
            setFilterStatus={setStatus}
            isLoading={loading}
            filterLoading={filterLoading || searchLoading}
            setSearch={setSearch}
            setDeleteData={setDeleteData}
            openConfirmationModal={openConfirmationModal}
            editClient={editClient}
            search={search}
            searchLoading={searchLoading}
          />
        </ComponentCard>
      </div>

      {/* Adding/Editing */}
      <ClientFormModal
        handleEditClient={updateHanlder}
        handleNewClient={handleNewClient}
        updateLoading={updateLoading}
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        data={editData}
      />

      {/* FullDetails */}
      <ClientInfoModal
        isOpen={isClientInfoModalOpen}
        onClose={closeClientInfoModal}
        client={data}
      />

      {/* for deletion */}
      <ConfirmtionModal
        loading={updateLoading}
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        onConfirm={deleteHanlder}
      />
    </>
  );

  function handlerFilter() {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debouncer(
        async (payload: { searchTerm?: string; status?: string }) => {
          try {
            await dispatch(
              searchClient({
                query: payload.searchTerm,
                status: payload.status,
              })
            ).unwrap();
          } catch (error) {
            console.log("Failed to fetch", error);
          } finally {
            setSearchLoading(false);
          }
        },
        400
      );
    }
  }
}
