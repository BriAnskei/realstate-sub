import { Dispatch, SetStateAction, useState } from "react";
import { ViewIcon } from "../../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { ContractType } from "../../../store/slices/contractSlice";
import {
  ApplicationType,
  getApplicationById,
} from "../../../store/slices/applicationSlice";
import { AppDispatch } from "../../../store/store";
import ApplicationInfoModal from "../../modal/applicationModal/ApplicationInfoModal";
import { getLotsByIds, LotType } from "../../../store/slices/lotSlice";
import { ClientType, getClientById } from "../../../store/slices/clientSlice";
import ClientInfoModal from "../../modal/client/ClientInfoModal";

function ContractTableRow({
  contract,
  viewClientHandler,
  viewApplicationHandler,
  viewContractPDFHandler,
}: {
  contract: ContractType;
  viewClientHandler: (clientId: string) => void;
  viewApplicationHandler: (applicationId: string) => void;
  viewContractPDFHandler: (contractId: string, contractPDF: string) => void;
}) {
  function getDateInstance(date: string) {
    return new Date(date);
  }

  function getFullDateFormat(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(getDateInstance(date));
  }

  function getShortDateFormat(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(getDateInstance(date));
  }

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
      <TableCell className="px-2 py-4 lg:px-4 text-start dark:text-gray-50">
        <div className="font-medium text-gray-800 text-sm dark:text-white/90">
          {contract.clientName}
        </div>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {contract.term}
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => viewClientHandler(contract.clientId!)}
        />
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => viewApplicationHandler(contract.applicationId!)}
        />
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() =>
            viewContractPDFHandler(contract._id, contract.contractPDF!)
          }
        />
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <span
          className="truncate block max-w-[120px]"
          title={getFullDateFormat(contract.createdAt!)}
        >
          <span className="hidden lg:inline">
            {getFullDateFormat(contract.createdAt!)}
          </span>
          <span className="lg:hidden">
            {getShortDateFormat(contract.createdAt!)}
          </span>
        </span>
      </TableCell>
    </TableRow>
  );
}

interface ContractTableProp {
  byId: { [key: string]: ContractType };
  allIds: string[];
  dispatch: AppDispatch;
  loading: boolean;
  filterAgent: React.Dispatch<SetStateAction<string | undefined>>;
}

export default function ContractTable({
  byId,
  allIds,
  dispatch,
  loading,
  filterAgent,
}: ContractTableProp) {
  // application view
  const [application, setApplication] = useState<ApplicationType | undefined>(
    undefined
  );
  const [fetchingAppLoading, setFetchingAppLoading] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [fetchedLots, setFetchLots] = useState<LotType[] | undefined>(
    undefined
  );
  const viewApplicationHandler = handlerApplicationFetch(
    fetchingAppLoading,
    setFetchingAppLoading,
    setIsAppInfoOpen,
    dispatch,
    setApplication,
    setFetchLots
  );

  // cliendVie
  const [client, setClient] = useState<ClientType | undefined>(undefined);
  const [fetchingClient, setFetchingClient] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const viewClientHanlder = async (clientId: string) => {
    try {
      setFetchingClient(true);
      setIsClientModalOpen(true);
      const fetchedClient = await dispatch(getClientById(clientId)).unwrap();
      setClient(fetchedClient);
    } catch (error) {
      console.log("Failed viewClientHanlder ", error);
    } finally {
      setFetchingClient(false);
    }
  };

  const viewContractPDFHandler = (contractId: string, contractPDF: string) => {
    console.log("View contract PDF:", contractPDF);
    window.open(
      `http://localhost:4000/uploads/pdf/${contractId}/${contractPDF}`
    );
  };

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Client name"
        sortTitle="All"
        onSearchChange={filterAgent}
      />
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {loading && <LoadingOverlay message="Loading...." />}

        <div className="w-full overflow-x-auto">
          <div className="h-[500px] overflow-y-auto custom-scrollbar">
            <Table className="w-full min-w-[900px] border-collapse">
              <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[160px]"
                  >
                    <span className="hidden lg:inline">Clients Name</span>
                    <span className="lg:hidden">Client</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[160px]"
                  >
                    <span className="hidden lg:inline">Contract Term</span>
                    <span className="lg:hidden">Term</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden md:inline">View Detials</span>
                    <span className="md:hidden">Client</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[140px]"
                  >
                    <span className="hidden md:inline">View Application</span>
                    <span className="md:hidden">Application</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden md:inline">View Contract PDF</span>
                    <span className="md:hidden">PDF</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[140px]"
                  >
                    <span className="hidden lg:inline">Created Date</span>
                    <span className="lg:hidden">Created</span>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {allIds.map((id) => {
                  const contract: ContractType = byId[id];

                  return (
                    <ContractTableRow
                      key={contract._id}
                      contract={contract}
                      viewClientHandler={viewClientHanlder}
                      viewApplicationHandler={viewApplicationHandler}
                      viewContractPDFHandler={viewContractPDFHandler}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ApplicationInfoModal
        isOpen={isAppInfoOpen}
        lots={fetchedLots}
        onClose={() => setIsAppInfoOpen(false)}
        application={application}
        loading={fetchingAppLoading}
      />
      <ClientInfoModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        isLoading={fetchingClient}
        client={client}
      />
    </>
  );
}
function handlerApplicationFetch(
  fetchingAppLoading: boolean,
  setFetchingAppLoading: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
  setIsAppInfoOpen: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
  dispatch: AppDispatch,
  setApplication: {
    (value: SetStateAction<ApplicationType | undefined>): void;
    (arg0: any): void;
  },
  setFetchLots: {
    (value: SetStateAction<LotType[] | undefined>): void;
    (arg0: any): void;
  }
) {
  return async (applicationId: string) => {
    try {
      if (fetchingAppLoading) return;

      setFetchingAppLoading(true);
      setIsAppInfoOpen(true);

      // appliction
      const fetchedApplication = await dispatch(
        getApplicationById(applicationId)
      ).unwrap();
      setApplication(fetchedApplication);

      // lots
      const fetchLots = await dispatch(
        getLotsByIds(fetchedApplication?.lotIds!)
      ).unwrap();
      setFetchLots(fetchLots!);
    } catch (error) {
      console.log("Error in viewApplicationHandler", error);
    } finally {
      setFetchingAppLoading(false);
    }
  };
}
