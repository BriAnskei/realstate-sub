import React from "react";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Badge from "../../ui/badge/Badge";

interface ApplicationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationType;
  clientName?: string;
  dealerName?: string;
  otherAgentsNames?: string[];
}

const ApplicationInfoModal: React.FC<ApplicationInfoModalProps> = ({
  isOpen,
  onClose,
  application,
  clientName,
  dealerName,
  otherAgentsNames = [],
}) => {
  if (!application) return null;

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

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Application Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            View application details and related information.
          </p>
        </div>

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

                {application.lotIds && application.lotIds.length > 0 && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Lot IDs</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {application.lotIds.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Client and Agent Information */}
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Client & Agent Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {application.clientName && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Client Name</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {application.clientName}
                    </div>
                  </div>
                )}

                {dealerName && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Dealer Name</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {dealerName}
                    </div>
                  </div>
                )}

                {otherAgentsNames.length > 0 && (
                  <div className="col-span-2">
                    <Label>Other Agents</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {otherAgentsNames.join(", ")}
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
                      <Badge>{application.status}</Badge>
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

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationInfoModal;
