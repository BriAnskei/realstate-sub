import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
  title?: string;
  message?: string;
  loading: boolean;
  icon?: React.ReactNode;
  bgIcon?: string;
  bgButton?: string;
  buttonText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  buttonText = "Confirm",
  cancelText = "Cancel",
  icon,
  bgIcon,
  bgButton,
  variant = "danger",
}: ConfirmationModalProps) => {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (loading) return;
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  // Variant-based styling
  const variantStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600",
      buttonHover: "hover:bg-red-700",
      buttonDisabled: "bg-red-400",
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600",
      buttonHover: "hover:bg-yellow-700",
      buttonDisabled: "bg-yellow-400",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600",
      buttonHover: "hover:bg-blue-700",
      buttonDisabled: "bg-blue-400",
    },
    success: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600",
      buttonHover: "hover:bg-green-700",
      buttonDisabled: "bg-green-400",
    },
  };

  const currentVariant = variantStyles[variant];

  // Default icons based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case "danger":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-6 h-6 ${currentVariant.iconColor}`}
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-6 h-6 ${currentVariant.iconColor}`}
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-6 h-6 ${currentVariant.iconColor}`}
          >
            <path
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-6 h-6 ${currentVariant.iconColor}`}
          >
            <path
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Custom styling with fallbacks
  const iconBackgroundClass = bgIcon || currentVariant.iconBg;
  const buttonBackgroundClass = bgButton
    ? `${bgButton} ${loading ? "opacity-75" : ""}`
    : `${loading ? currentVariant.buttonDisabled : currentVariant.buttonBg} ${
        currentVariant.buttonHover
      }`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md m-4">
      <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl shadow-lg dark:bg-gray-900 lg:p-11">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBackgroundClass} shrink-0 sm:w-10 sm:h-10`}
          >
            {icon || getDefaultIcon()}
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
          <Button
            size="sm"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            className={buttonBackgroundClass}
            onClick={handleConfirm}
            disabled={loading}
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
              buttonText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
