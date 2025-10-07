import { useEffect, useState } from "react";
import { EditIcon, ViewIcon } from "../../../icons";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import LoadingOverlay from "../../loading/LoadingOverlay";
import ViewRejectionDetailsModal from "../../modal/applicationModal/ViewRejectionDetailsModal";
import { useViewRejectApplictionModal } from "../../../hooks/projects-hooks/modal/useViewRejectApplictionModal";
import { UserType } from "../../../context/UserContext";
import { useApplication } from "../../../context/ApplicationContext";
import { useNavigate } from "react-router";

function RejectedAppTableRow({
  application,
  openApplicationView,
  isAgentDealer,
  editApplicationHanlder,
}: {
  application: ApplicationType;
  openApplicationView: (data: ApplicationType) => void;
  isAgentDealer: boolean;
  editApplicationHanlder?: (appliction: ApplicationType) => void;
}) {
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
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
      <TableCell className="px-2 py-4 lg:px-4 text-start dark:text-gray-50">
        <div className="font-medium text-gray-800 text-sm dark:text-white/90">
          <span className="hidden lg:inline">{getName()}</span>
          <span className="lg:hidden">{getFirstName()}</span>
        </div>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <span className="truncate block max-w-[150px]">
          {application.landName}
        </span>
      </TableCell>

      <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
        <span
          className="truncate block max-w-[120px]"
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
        <span
          className="truncate block max-w-[120px]"
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
          <ViewIcon
            className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={() => openApplicationView(application)}
          />
          {isAgentDealer && (
            <EditIcon
              className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => editApplicationHanlder!(application)} // this will be note unifined if the user is the dealer of this application
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface RejectedApplicationTableProp {
  rejectedApplictions?: ApplicationType[];
  currUser?: UserType;
}

export default function RejectedApplicationTable({
  rejectedApplictions,
  currUser,
}: RejectedApplicationTableProp) {
  const navigate = useNavigate();
  const {
    openAppRejectionViewModal,
    closeAppRejectionViewModal,
    appToView,
    isViewRejectionOpen,
  } = useViewRejectApplictionModal();
  const { setEditApplication } = useApplication();

  const editApplicationHanlder = (appliction: ApplicationType) => {
    setEditApplication(appliction);
    navigate("/application/update");
  };

  const [search, setSearch] = useState<string | undefined>(undefined);
  const [loading] = useState(false);

  const resetFilter = () => {
    setSearch(undefined);
  };

  return (
    <>
      <Filter
        SearchPlaceholder="Search Rejected Applications"
        onSearchChange={setSearch}
        onClearFilters={resetFilter}
      />

      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {loading && <LoadingOverlay message="Loading...." />}

        <div className="w-full overflow-x-auto">
          <div className="h-[500px] overflow-y-auto custom-scrollbar">
            <Table className="w-full min-w-[700px] border-collapse">
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
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[150px]"
                  >
                    <span className="hidden md:inline">Land Name</span>
                    <span className="md:hidden">Land</span>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[140px]"
                  >
                    <span className="hidden lg:inline">Appointment Date</span>
                    <span className="lg:hidden">Appt.</span>
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
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[80px]"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {rejectedApplictions &&
                  rejectedApplictions.map((app) => (
                    <RejectedAppTableRow
                      key={app._id}
                      isAgentDealer={currUser?._id === app.agentDealerId}
                      editApplicationHanlder={editApplicationHanlder}
                      application={app}
                      openApplicationView={openAppRejectionViewModal}
                    />
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ViewRejectionDetailsModal
        isOpen={isViewRejectionOpen}
        onClose={closeAppRejectionViewModal}
        application={appToView}
      />
    </>
  );
}
