import React from "react";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";

interface ViewRejectionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationType;
}

const ViewRejectionDetailsModal: React.FC<ViewRejectionDetailsModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  if (!application) return null;

  console.log("appliction to view: ", application);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Application Rejection Details
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            View the reason why this application was rejected.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="custom-scrollbar max-h-[500px] overflow-y-auto px-2 pb-3">
            {/* Rejection Reason */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Rejection Reason
              </h5>

              <div>
                <Label className="text-orange-400">notes</Label>
                <div className="min-h-[120px] rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {application.rejectionNote || "No rejection notes provided."}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewRejectionDetailsModal;
