import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  loading: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Delete Client",
  message = "Are you sure you want to delete this client? Once deleted, all the transactions history will be lost.",
}: ConfirmationModalProps) => {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md m-4">
      <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl shadow-lg dark:bg-gray-900 lg:p-11">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 shrink-0 sm:w-10 sm:h-10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6 text-red-600"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title & Message */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className={`${
              loading ? "bg-red-400" : "bg-red-600"
            } hover:bg-red-400`}
            onClick={handleConfirm}
          >
            {loading ? (
              <>
                <svg
                  className="mr-3 size-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Processing…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
