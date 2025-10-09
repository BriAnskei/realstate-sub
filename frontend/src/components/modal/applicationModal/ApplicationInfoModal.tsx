import React, { useEffect, useRef, useState } from "react";
import {
  ApplicationType,
  Status,
} from "../../../store/slices/applicationSlice";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { getLotsByIds, LotType } from "../../../store/slices/lotSlice";
import { UserType, userUser } from "../../../context/UserContext";

interface ApplicationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationType;
  clientName?: string;
  dealerName?: string;
  otherAgents?: UserType[];
  lots?: LotType[];
  loading: boolean;
}

// Loading skeleton component
const SkeletonBox: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
  />
);

const LoadingContent: React.FC = () => (
  <div className="flex flex-col">
    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
      {/* Land Information Skeleton */}
      <div>
        <SkeletonBox className="mb-5 h-6 w-40 lg:mb-6" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-24" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="col-span-2">
            <SkeletonBox className="mb-2 h-4 w-16" />
            <div className="rounded-md border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
              <SkeletonBox className="mb-3 h-8 w-full" />
              <SkeletonBox className="mb-3 h-12 w-full" />
              <SkeletonBox className="mb-3 h-12 w-full" />
              <SkeletonBox className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Client and Agent Information Skeleton */}
      <div className="mt-7">
        <SkeletonBox className="mb-5 h-6 w-56 lg:mb-6" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-24" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-28" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="col-span-2">
            <SkeletonBox className="mb-2 h-4 w-28" />
            <div className="rounded-md border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
              <SkeletonBox className="mb-3 h-8 w-full" />
              <SkeletonBox className="mb-3 h-12 w-full" />
              <SkeletonBox className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Skeleton */}
      <div className="mt-7">
        <SkeletonBox className="mb-5 h-6 w-44 lg:mb-6" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-28" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-16" />
            <SkeletonBox className="h-8 w-24" />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-36" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <SkeletonBox className="mb-2 h-4 w-28" />
            <SkeletonBox className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
      <SkeletonBox className="h-9 w-20" />
    </div>
  </div>
);

const ApplicationInfoModal: React.FC<ApplicationInfoModalProps> = ({
  isOpen,
  loading,
  onClose,
  application,

  lots = [],
}) => {
  const { getAppDealer } = userUser();
  const [agents, setAgents] = useState<UserType[] | undefined>(undefined);
  const [fetchingAppDetails, setFetchinngAppDetails] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    async function fetchRequredData() {
      try {
        if (
          !isOpen ||
          !application?._id ||
          loading ||
          fetchingAppDetails ||
          hasFetchedRef.current
        )
          return;

        hasFetchedRef.current = true;
        setFetchinngAppDetails(true);

        await dispatch(getLotsByIds(application?.lotIds!));

        if (application.agentDealerId) {
          setAgents(
            getAppDealer({
              otherAgents: application?.otherAgentIds?.map(String) || [],
              dealerId: application?.agentDealerId!,
            })
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetchinngAppDetails(false);
      }
    }

    fetchRequredData();
  }, [isOpen, application, loading]);

  // Reset the ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasFetchedRef.current = false;
    }
  }, [isOpen]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getFullName = (user: UserType) => {
    const parts = [user.firstName, user.middleName, user.lastName].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  const isDealer = (agentId: string) => {
    return application?.agentDealerId === agentId;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Application Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            View application details and related information.
          </p>
        </div>

        {loading || fetchingAppDetails ? (
          <LoadingContent />
        ) : !application ? (
          <div className="flex h-[450px] items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No application data available
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* Land Information */}
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Land Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  {application.landName && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Land Name</Label>
                      <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {application.landName}
                      </div>
                    </div>
                  )}

                  <LotTable Lots={lots} />
                </div>
              </div>

              {/* Client and Agent Information */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Client & Agent Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Client Name</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {application.clientName}
                    </div>
                  </div>

                  {application.otherAgentIds &&
                    application.otherAgentIds?.length > 0 && (
                      <div className="col-span-2">
                        <Label>Other Agents</Label>
                        <div className="overflow-hidden rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                          <div className="max-h-[240px] overflow-y-auto">
                            <Table className="w-full border-collapse">
                              <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                                <TableRow>
                                  <TableCell
                                    isHeader
                                    className="whitespace-nowrap px-3 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-theme-xs"
                                  >
                                    Full Name
                                  </TableCell>
                                  <TableCell
                                    isHeader
                                    className="whitespace-nowrap px-3 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-theme-xs"
                                  >
                                    Email
                                  </TableCell>
                                </TableRow>
                              </TableHeader>
                              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {agents &&
                                  agents.map((agent, index) => (
                                    <TableRow
                                      key={agent._id || index}
                                      className={`transition-colors ${
                                        isDealer(agent._id!)
                                          ? "hover:bg-blue-50  bg-blue-50 dark:bg-blue-900/20"
                                          : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                      }`}
                                    >
                                      <TableCell className="px-3 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                          {getFullName(agent)}
                                          {isDealer(agent._id!) && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                                              Dealer
                                            </span>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="px-3 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                                        {agent.email || "N/A"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Application Information */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Application Details
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  {application._id && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Application ID</Label>
                      <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        #{application._id}
                      </div>
                    </div>
                  )}

                  {application.status && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Status</Label>
                      <div className="flex items-center">
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
                      </div>
                    </div>
                  )}

                  {application.appointmentDate && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Appointment Date</Label>
                      <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {formatDate(application.appointmentDate)}
                      </div>
                    </div>
                  )}

                  {application.createdAt && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Date Created</Label>
                      <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {formatDate(application.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ApplicationInfoModal;

const LotTable = (payload: { Lots: LotType[] }) => {
  const { Lots } = payload;
  return (
    <div className="col-span-2">
      <Label>Lots</Label>
      <div className="overflow-hidden rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
        <div className="max-h-[240px] overflow-y-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-3 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-theme-xs"
                >
                  Block No.
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-3 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-theme-xs"
                >
                  Lot No.
                </TableCell>
                <TableCell
                  isHeader
                  className="whitespace-nowrap px-3 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-theme-xs"
                >
                  Lot Size
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {Lots.map((lot) => (
                <TableRow
                  key={lot._id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-3 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                    {lot.blockNumber || "N/A"}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                    {lot.lotNumber || "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                    {lot.lotSize ? `${lot.lotSize} Sqm` : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
