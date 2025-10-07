import React, { useState } from "react";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { ApplicationType } from "../../../store/slices/applicationSlice";

type ActionType = "approved" | "rejected";

interface ApplicationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationType;
  onSubmit: (payload: {
    application: ApplicationType;
    note: string;
    status: ActionType;
  }) => Promise<void>;
  updateLoading: boolean;
  actionType: ActionType;
}

const ApplicationActionModal: React.FC<ApplicationActionModalProps> = ({
  isOpen,
  onClose,
  application,
  onSubmit,
  updateLoading,
  actionType,
}) => {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = {
    approved: {
      title: "Approve Application",
      description: "Please provide a note for approving this application.",
      sectionTitle: "Approval Note",
      label: "Note for Approval",
      placeholder: "Enter any notes for approving this application...",
      submitText: "Approve Application",
      submittingText: "Approving...",
      buttonVariant: "primary" as const,
    },
    rejected: {
      title: "Reject Application",
      description: "Please provide a reason for rejecting this application.",
      sectionTitle: "Rejection Reason",
      label: "Reason for Rejection",
      placeholder: "Enter the reason for rejecting this application...",
      submitText: "Reject Application",
      submittingText: "Rejecting...",
      buttonVariant: "primary" as const,
    },
  };

  const currentConfig = config[actionType];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((actionType === "rejected" && !note.trim()) || !application) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        application,
        note,
        status: actionType,
      });
      setNote("");
      handleClose();
    } catch (error) {
      console.error(`Error submitting ${actionType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (updateLoading) return;

    setNote("");
    onClose();
  };

  if (!application) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {currentConfig.title}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {currentConfig.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="custom-scrollbar h-auto max-h-[450px] overflow-y-auto px-2 pb-3">
            {/* Application Information */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Application Details
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Land Name</Label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {application.landName || "N/A"}
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Client Name</Label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {application.clientName || "N/A"}
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Appointment Date</Label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {formatDate(application.appointmentDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                {currentConfig.sectionTitle}
              </h5>

              <div>
                <Label>
                  {currentConfig.label} <span className="text-red-500">*</span>
                </Label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={currentConfig.placeholder}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400"
                  required={actionType === "rejected"}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant={currentConfig.buttonVariant}
              disabled={
                isSubmitting || (actionType === "rejected" && !note.trim()) // only require notes when rejection
              }
            >
              {isSubmitting
                ? currentConfig.submittingText
                : currentConfig.submitText}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ApplicationActionModal;
