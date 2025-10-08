import {
  ApproveIcon,
  DeleteIcon,
  EditIcon,
  RejectIcon,
  ViewIcon,
} from "../../../icons";
import {
  ApplicationType,
  Status,
  updateApplicationStatus,
} from "../../../store/slices/applicationSlice";

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
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import ApplicationInfoModal from "../../modal/applicationModal/ApplicationInfoModal";
import { Dispatch, useState } from "react";
import { useFilteredData } from "../../../hooks/useFilteredData";
import ConfirmationModal from "../../modal/ConfirmtionModal";
import useConfirmationModal from "../../../hooks/useConfirmationModal";
import { NavigateFunction } from "react-router";
import { useApplication } from "../../../context/ApplicationContext";
import { UserType } from "../../../context/UserContext";

import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import ApplicationActionModal from "../../modal/applicationModal/ApplicationActionModal";
import { useActionApplicationModal } from "../../../hooks/projects-hooks/modal/useActionApplicationModal";

function AppTable(payload: {
  application: ApplicationType;
  isEmployee: boolean;
  agentId?: string; // filed only if user is agent
  openApplicationView: (data: ApplicationType) => void;
  openDeleteConfirmation: () => void;
  setApplicationIdDelete: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  editApplication: (application: ApplicationType) => void;
  openAppActionModal: (
    applicationToReject: ApplicationType,
    action: "rejected" | "approved"
  ) => void; // only be filed if user is employee
}) {
  const {
    application,
    isEmployee,
    openApplicationView,
    openDeleteConfirmation,
    setApplicationIdDelete,
    editApplication,
    agentId,
    openAppActionModal,
  } = payload;

  const onDeleteAppllication = () => {
    setApplicationIdDelete(application._id!);
    openDeleteConfirmation();
  };

  // returns 2 wordsif there are 3 words of client name
  function getName() {
    const splitedName: string[] = application.clientName?.trim().split(" ")!;
    let wordsLen = splitedName.length;

    while (wordsLen > 2) {
      splitedName.pop();
      wordsLen--;
    }

    return splitedName.join(" ");
  }

  function getFirstName() {
    return application.clientName?.trim().split(" ").pop();
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

  return (
    <TableRow
      key={application._id}
      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
    >
      <TableCell className="px-2 py-4 lg:px-4 text-start dark:text-gray-50">
        <div className="font-medium text-gray-800 text-sm dark:text-white/90">
          <span className="hidden lg:inline">{getName()}</span>
          <span className="lg:hidden">{getFirstName()}</span>
        </div>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <span className="truncate block max-w-[120px]">
          {application.landName}
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {/* add one to include dealer */}
        <span
          className="truncate block max-w-[200px]"
          title={application.lotIds?.length.toString() || "No notes"}
        >
          {application.otherAgentIds && application.otherAgentIds.length > 0
            ? application.otherAgentIds?.length + 1
            : "—"}
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
            {application.lotIds?.length}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {/* appointment date */}
        <span
          className="truncate block max-w-[100px]"
          title={getFullDateFormat(application.appointmentDate!)}
        >
          <span className="hidden lg:inline">
            {getFullDateFormat(application.appointmentDate!)}
          </span>
          <span className="lg:hidden">
            {getShortDateFormat(application.appointmentDate!)}
          </span>
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <Badge
          size="sm"
          color={
            application.status === Status.pending
              ? undefined
              : application.status === Status.approved
              ? "success"
              : "warning"
          }
        >
          {application.status}
        </Badge>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {/* creation  date */}
        <span
          className="truncate block max-w-[100px]"
          title={getFullDateFormat(application.createdAt!)}
        >
          <span className="hidden lg:inline">
            {getFullDateFormat(application.createdAt!)}
          </span>
          <span className="lg:hidden">
            {getShortDateFormat(application.createdAt!)}
          </span>
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4">
        <div className="flex gap-1 justify-center">
          {isEmployee ? (
            <>
              <ViewIcon
                className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => openApplicationView(application)}
              />
              {/* the application only deletable if it is rejected */}
              {application.status === Status.reject && (
                <DeleteIcon
                  className="w-3.5 h-3.5 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  onClick={onDeleteAppllication}
                />
              )}
              {/* only show for pending application */}
              {application.status === Status.pending && (
                <>
                  <ApproveIcon
                    className="w-3.5 h-3.5 cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    onClick={() => openAppActionModal(application, "approved")}
                  />
                  <RejectIcon
                    className="w-3.5 h-3.5 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    onClick={() => openAppActionModal(application, "rejected")}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <ViewIcon
                className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => openApplicationView(application)}
              />

              {/* if application is pending/rejected, agentDealer can deleting it   */}
              {agentId &&
                agentId === application.agentDealerId &&
                application.status !== Status.approved && (
                  <>
                    <EditIcon
                      className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => editApplication(application)}
                    />
                    <DeleteIcon
                      className="w-3.5 h-3.5 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      onClick={onDeleteAppllication}
                    />
                  </>
                )}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ApplicationTableProp {
  navigate: NavigateFunction;
  deleteApplicationHanlder: (appId: string) => Promise<void>;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFilterStatus?: React.Dispatch<React.SetStateAction<string | undefined>>;
  agentData?: UserType; // only filed when user is agent
  search?: string;
  filter?: string;
  isFiltering?: boolean;
  isEmployee: boolean;
  dispatch: ThunkDispatch<any, undefined, UnknownAction> &
    Dispatch<UnknownAction>;
}

export default function ApplicationTable({
  navigate,
  setSearch,
  deleteApplicationHanlder,
  agentData,
  setFilterStatus,
  search,
  isFiltering,
  filter,
  isEmployee,
  dispatch,
}: ApplicationTableProp) {
  // used in application info modal
  const { fetchedLots, fetchingLoading } = useSelector(
    (state: RootState) => state.lot
  );

  const { setEditApplication } = useApplication();
  const {
    byId,
    allIds,
    loading,
    filterLoading,
    filterById,
    filterIds,
    updateLoading,
  } = useSelector((state: RootState) => state.application);

  // confirmation modal for deletion
  const { isConfirmationOpen, openConfirmationModal, closeConfirmationModal } =
    useConfirmationModal();

  const {
    isAppActionOpen,
    openAppActionModal,
    actionType,
    closeAppActionModal,
    appToAction,
  } = useActionApplicationModal();

  // For application info modal view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationView, setApplicationView] = useState<
    ApplicationType | undefined
  >(undefined);

  // deletion hook from table rows
  const [applicationIdDelete, setApplicationIdDelete] = useState<
    string | undefined
  >(undefined);

  const openAppInfoHandler = (data: ApplicationType) => {
    setApplicationView(data);
    setIsModalOpen(true);
  };

  const editApplicationHanlder = (application: ApplicationType) => {
    setEditApplication(application);

    // navite to application form
    navigate("/application/update");
  };

  const applicationActionHanlder = async (payload: {
    application: ApplicationType;
    note?: string;
    status: "approved" | "rejected";
  }) => {
    try {
      await dispatch(updateApplicationStatus(payload));
    } catch (error) {
      console.log("Failed on applicationActionHanlder", error);
    }
  };

  const resetFilter = () => {
    setSearch(undefined);
  };

  const getDisplayData = useFilteredData<ApplicationType>({
    originalData: { byId, allIds },
    filteredData: { allIds: filterIds, byId: filterById },
    filterOptions: {
      searchInput: search,
      filterStatus: filter,
      filterLoading: loading || isFiltering,
    },
  });

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Application"
        sortTitle="All"
        onSearchChange={setSearch}
        onSortChange={setFilterStatus}
        sortOptions={[
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
          { label: "Pending", value: "pending" },
        ]}
        onClearFilters={resetFilter}
      />

      {/* Main container with proper responsive handling */}
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {(loading || filterLoading || isFiltering) && (
          <LoadingOverlay message="Loading...." />
        )}

        {/* Horizontal scroll container with proper width constraints */}
        <div className="w-full overflow-x-auto">
          {/* Vertical scroll container with fixed height */}
          <div className="h-[500px] overflow-y-auto custom-scrollbar">
            <Table className="w-full min-w-[800px] border-collapse">
              {/* Sticky Table Header */}
              <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[140px]"
                  >
                    <span className="hidden lg:inline">Client Name</span>
                    <span className="lg:hidden">Client</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden md:inline">Land Name</span>
                    <span className="md:hidden">Land</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    Agents
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[80px]"
                  >
                    Lots
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[140px]"
                  >
                    <span className="hidden lg:inline">Appointment</span>
                    <span className="lg:hidden">Appt.</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[100px]"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden lg:inline">Created Date</span>
                    <span className="lg:hidden">Created</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[80px]"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body with sample data for demonstration */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {getDisplayData.allIds.map((id) => {
                  const app: ApplicationType = getDisplayData.byId[id];

                  return (
                    <AppTable
                      key={app._id}
                      application={app}
                      agentId={agentData?._id ?? undefined}
                      isEmployee={isEmployee}
                      setApplicationIdDelete={setApplicationIdDelete}
                      openApplicationView={openAppInfoHandler}
                      openDeleteConfirmation={openConfirmationModal}
                      openAppActionModal={openAppActionModal}
                      editApplication={editApplicationHanlder}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ApplicationInfoModal
        lots={fetchedLots}
        loading={fetchingLoading}
        isOpen={isModalOpen}
        application={applicationView}
        onClose={() => setIsModalOpen(false)}
      />
      {agentData && (
        <ConfirmationModal
          title="Delete Application"
          message="Are you sure you want to delete this application? This action cannot be undone and will permanently remove all associated data from the system."
          buttonText="Delete Application"
          cancelText="Cancel"
          variant="danger"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6 text-red-600"
            >
              <path
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          bgIcon="bg-red-100"
          bgButton="bg-red-600 hover:bg-red-700"
          loading={loading}
          isOpen={isConfirmationOpen}
          onConfirm={() => deleteApplicationHanlder(applicationIdDelete!)}
          onClose={closeConfirmationModal}
        />
      )}

      {!agentData && (
        <ApplicationActionModal
          updateLoading={updateLoading}
          isOpen={isAppActionOpen}
          onClose={closeAppActionModal}
          application={appToAction ?? undefined}
          onSubmit={applicationActionHanlder}
          actionType={actionType}
        />
      )}
    </>
  );
}
