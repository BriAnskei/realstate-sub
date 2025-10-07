import { Dispatch, useState } from "react";
import {
  ViewIcon,
  EditIcon,
  DeleteIcon,
  FinilizeIcon,
  CancelContractIcon,
} from "../../../icons";
import { ReserveType } from "../../../store/slices/reservationSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import Badge from "../../ui/badge/Badge";
import LoadingOverlay from "../../loading/LoadingOverlay";
import ApplicationInfoModal from "../../modal/applicationModal/ApplicationInfoModal";
import {
  ApplicationType,
  getApplicationById,
} from "../../../store/slices/applicationSlice";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

function ReservationTableRow({
  reservation,
  openReservationView,
  openEditModal,
  openDeleteConfirmation,
  viewApplicatonInfoHanlder,
}: {
  viewApplicatonInfoHanlder: (applivationId: string) => Promise<void>;
  reservation: ReserveType;
  openReservationView: (data: ReserveType) => void;
  openEditModal: (data: ReserveType) => void;
  openDeleteConfirmation: (data: ReserveType) => void;
}) {
  function getName() {
    const splitedName: string[] = reservation.clientName?.trim().split(" ")!;
    let wordsLen = splitedName.length;

    while (wordsLen > 2) {
      splitedName.pop();
      wordsLen--;
    }

    return splitedName.join(" ");
  }

  function getFirstName() {
    return reservation.clientName?.trim().split(" ").pop();
  }

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

  function getStatusColor() {
    switch (reservation.status) {
      case "no show":
        return "success";
      case "pending":
        return undefined;
      case "on contract":
        return "warning";

      default:
        return undefined;
    }
  }

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
      <TableCell className="px-2 py-4 lg:px-4 text-start dark:text-gray-50">
        <div className="font-medium text-gray-800 text-sm dark:text-white/90">
          <span className="hidden lg:inline">{getName()}</span>
          <span className="lg:hidden">{getFirstName()}</span>
        </div>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <ViewIcon
          className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => viewApplicatonInfoHanlder(reservation.applicationId!)}
        />
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <Badge size="sm" color={getStatusColor()}>
          {reservation.status}
        </Badge>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <span
          className="truncate block max-w-[200px]"
          title={reservation.notes || "No notes"}
        >
          {reservation.notes || "—"}
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <span
          className="truncate block max-w-[120px]"
          title={getFullDateFormat(reservation.createdAt!)}
        >
          <span className="hidden lg:inline">
            {getFullDateFormat(reservation.createdAt!)}
          </span>
          <span className="lg:hidden">
            {getShortDateFormat(reservation.createdAt!)}
          </span>
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4">
        <div className="flex gap-1 justify-center">
          {reservation.status === "pending" && (
            <FinilizeIcon
              className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => openReservationView(reservation)}
            />
          )}

          <CancelContractIcon
            className="text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
            onClick={() => openDeleteConfirmation(reservation)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ReservationTableProp {
  byId: { [key: string]: ReserveType };
  allIds: string[];
  dispatch: ThunkDispatch<any, undefined, UnknownAction> &
    Dispatch<UnknownAction>;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
}

export default function ReservationTable({
  byId,
  allIds,
  dispatch,
  setSearch,
  setFilter,
  loading,
}: ReservationTableProp) {
  const { fetchedLots, fetchingLoading } = useSelector(
    (state: RootState) => state.lot
  );

  // view application
  const [applicaionToView, setApplicationToView] = useState<
    ApplicationType | undefined
  >(undefined);
  const [isApplicationModal, setIsApplicationModal] = useState(false);
  const [fetchingApplicationLoading, setFetchingApplicationLoading] =
    useState(false);

  const viewApplicatonInfoHanlder = fetchApplicationById();

  const openReservationInfoHandler = (data: ReserveType) => {
    console.log("View reservation:", data);
    // TODO: Implement modal logic here
  };

  const openEditHandler = (data: ReserveType) => {
    console.log("Edit reservation:", data);
    // TODO: Implement edit logic here
  };

  const openDeleteHandler = (data: ReserveType) => {
    console.log("Delete reservation:", data);
    // TODO: Implement delete confirmation here
  };

  const resetFilter = () => {
    setSearch(undefined);
    setFilter(undefined);
  };

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Client Name"
        sortTitle="All"
        onSearchChange={setSearch}
        onSortChange={setFilter}
        sortOptions={[
          { label: "Pending", value: "pending" },
          { label: "Cancelled", value: "cancelled" },
          { label: "On Contract", value: "on contract" },
          { label: "No show", value: "no show" },
        ]}
        onClearFilters={resetFilter}
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
                    <span className="hidden lg:inline">Client Name</span>
                    <span className="lg:hidden">Client</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden md:inline">View Application</span>
                    <span className="md:hidden">View App</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[100px]"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[220px]"
                  >
                    Notes
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
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[100px]"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {allIds.map((id) => {
                  const reservation: ReserveType = byId[id];

                  return (
                    <ReservationTableRow
                      viewApplicatonInfoHanlder={viewApplicatonInfoHanlder}
                      key={reservation._id}
                      reservation={reservation}
                      openReservationView={openReservationInfoHandler}
                      openEditModal={openEditHandler}
                      openDeleteConfirmation={openDeleteHandler}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ApplicationInfoModal
        isOpen={isApplicationModal}
        onClose={() => setIsApplicationModal(false)}
        application={applicaionToView}
        lots={fetchedLots}
        loading={fetchingApplicationLoading || fetchingLoading}
      />
    </>
  );

  function fetchApplicationById() {
    return async (applivationId: string) => {
      try {
        setIsApplicationModal(true);
        setFetchingApplicationLoading(true);

        const fetchApplication = await dispatch(
          getApplicationById(applivationId)
        ).unwrap();

        setApplicationToView(fetchApplication);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setFetchingApplicationLoading(false);
      }
    };
  }
}
