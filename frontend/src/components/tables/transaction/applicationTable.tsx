import {
  ApproveIcon,
  DeleteIcon,
  EditIcon,
  RejectIcon,
  ViewIcon,
} from "../../../icons";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import { UserType } from "../../../context/UserContext";

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

interface ApplicationTableProp {
  openConfirmationModal: () => void;
  editApplication: (data: ApplicationType) => void;
  setDeleteData: (data: ApplicationType) => void;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFilterStatus?: React.Dispatch<React.SetStateAction<string | undefined>>;
  search: string | undefined;
  searchLoading: boolean;
  isLoading: boolean;
  filterLoading: boolean;
  status?: string;
  openApplicationInfoModal: (applicationData: ApplicationType) => void;
  isEmployee: boolean;
}

export default function ApplicationTable({
  search,
  searchLoading,
  status,
  openConfirmationModal,
  editApplication,
  setDeleteData,
  setSearch,
  setFilterStatus,
  openApplicationInfoModal,
  isEmployee,
}: ApplicationTableProp) {
  const deleteHandler = (data: ApplicationType) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  const resetFilter = () => {
    setSearch(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return "No Client";
    // You'll need to get client data from your client store
    const clientState = useSelector((state: RootState) => state.client);
    const client = clientState.byId[clientId];
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };

  const getAgentName = (agent?: UserType) => {
    if (!agent) return "No Agent";
    return agent.firstName && agent.lastName
      ? `${agent.firstName} ${agent.lastName}`
      : agent.email || "Unknown Agent";
  };

  const formatAppointmentDate = (dateString?: string) => {
    if (!dateString) return "No Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        {false && <LoadingOverlay message="Filtering results..." />}

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
                    className="px-2 py-3 font-medium text-gray-500 text-start text-xs lg:px-4 lg:text-theme-xs dark:text-gray-400 whitespace-nowrap w-[120px]"
                  >
                    <span className="hidden md:inline">Land Name</span>
                    <span className="md:hidden">Land</span>
                  </TableCell>

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
                {/* Sample rows - replace with your actual data mapping */}
                {Array.from({ length: 5 }, (_, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="px-2 py-4 lg:px-4 text-start dark:text-gray-50">
                      <div className="font-medium text-gray-800 text-sm dark:text-white/90">
                        <span
                          className="truncate block max-w-[100px]"
                          title={`LAND-${index + 1}`}
                        >
                          LAND-{index + 1}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      <span
                        className="truncate block max-w-[120px]"
                        title={`Client ${index + 1}`}
                      >
                        Client {index + 1}
                      </span>
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      4
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                          {index + 2}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      <span
                        className="truncate block max-w-[120px]"
                        title="Dec 15, 2024, 10:00 AM"
                      >
                        <span className="hidden lg:inline">
                          Dec 15, 2024, 10:00 AM
                        </span>
                        <span className="lg:hidden">Dec 15</span>
                      </span>
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          index % 3 === 0
                            ? "success"
                            : index % 3 === 1
                            ? "error"
                            : "warning"
                        }
                      >
                        {index % 3 === 0
                          ? "Approved"
                          : index % 3 === 1
                          ? "Rejected"
                          : "Pending"}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      <span
                        className="truncate block max-w-[100px]"
                        title="Dec 10, 2024"
                      >
                        <span className="hidden lg:inline">Dec 10, 2024</span>
                        <span className="lg:hidden">Dec 10</span>
                      </span>
                    </TableCell>

                    <TableCell className="px-2 py-4 lg:px-4">
                      <div className="flex gap-1 justify-center">
                        {isEmployee ? (
                          <>
                            <ApproveIcon className=" cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors" />
                            <RejectIcon className="cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors" />
                          </>
                        ) : (
                          <>
                            <ViewIcon
                              className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={() => console.log("View clicked")}
                            />
                            <EditIcon className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                            <DeleteIcon
                              className="w-3.5 h-3.5 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                              onClick={() => console.log("Delete clicked")}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
