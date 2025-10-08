import { Dispatch, useState } from "react";
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

export interface ContractType {
  _id: string;
  clientId?: string;
  agentsIds: string[];
  applicaitonId?: string;
  contractPDF?: string;
  term?: string;
  createdAt?: string;
}

function ContractTableRow({
  contract,
  viewClientHandler,
  viewApplicationHandler,
  viewContractPDFHandler,
}: {
  contract: ContractType;
  viewClientHandler: (clientId: string) => void;
  viewApplicationHandler: (applicationId: string) => void;
  viewContractPDFHandler: (contractPDF: string) => void;
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
          {contract.term || "—"}
        </div>
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

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => viewClientHandler(contract.clientId!)}
        />
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => viewApplicationHandler(contract.applicaitonId!)}
        />
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => viewContractPDFHandler(contract.contractPDF!)}
        />
      </TableCell>
    </TableRow>
  );
}

interface ContractTableProp {
  byId: { [key: string]: ContractType };
  allIds: string[];
  dispatch: ThunkDispatch<any, undefined, UnknownAction> &
    Dispatch<UnknownAction>;

  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
}

export default function ContractTable({
  byId,
  allIds,
  dispatch,
  setSearch,
  setFilter,
  loading,
}: ContractTableProp) {
  const viewClientHandler = (clientId: string) => {
    console.log("View client:", clientId);
    // TODO: Implement modal logic here
  };

  const viewApplicationHandler = (applicationId: string) => {
    console.log("View application:", applicationId);
    // TODO: Implement modal logic here
  };

  const viewContractPDFHandler = (contractPDF: string) => {
    console.log("View contract PDF:", contractPDF);
    // TODO: Implement PDF viewer logic here
  };

  const resetFilter = () => {
    setSearch(undefined);
    setFilter(undefined);
  };

  return (
    <>
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
                    Term
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[140px]"
                  >
                    <span className="hidden lg:inline">Created Date</span>
                    <span className="lg:hidden">Created</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden md:inline">View Client</span>
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
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {allIds.map((id) => {
                  const contract: ContractType = byId[id];

                  return (
                    <ContractTableRow
                      key={contract._id}
                      contract={contract}
                      viewClientHandler={viewClientHandler}
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
    </>
  );
}
