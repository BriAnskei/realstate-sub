import { useState } from "react";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { ReserveType } from "./addReservationModal/ReservationModal";

interface ChangeReserveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserve?: ReserveType;
  onSubmit: (
    reservation: ReserveType,
    status: string,
    notes?: string
  ) => Promise<void>;
}

const ChangeReserveStatusModal: React.FC<ChangeReserveStatusModalProps> = ({
  isOpen,
  onClose,
  reserve,
  onSubmit,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reserve) return null;

  const handleSubmit = async () => {
    if (!selectedStatus) return;
    setIsSubmitting(true);

    await onSubmit(reserve, selectedStatus, notes);
    try {
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setNotes("");
    onClose();
  };

  const statusOptions = [
    { value: "cancelled", label: "Cancelled", color: "text-red-600" },
    { value: "no show", label: "No Show", color: "text-orange-600" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] m-4">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Change Reservation Status
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update the status for{" "}
            <span className="font-medium">{reserve.clientName}</span>'s
            reservation.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="custom-scrollbar max-h-[500px] overflow-y-auto px-2 pb-3">
            {/* Status Selection */}
            <div className="mb-6">
              <Label className="mb-2">
                New Status <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center rounded-lg border border-gray-300 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                    <span
                      className={`ml-3 text-sm font-medium ${option.color} dark:text-white/90`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="mb-2">
                Notes{" "}
                <span className="text-sm font-normal text-gray-500">
                  (Optional)
                </span>
              </Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this status change..."
                className="min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {notes.length}/500 characters
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!selectedStatus || isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeReserveStatusModal;
