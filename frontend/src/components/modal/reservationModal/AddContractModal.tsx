import React, { useState } from "react";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { Download } from "lucide-react";

export interface ContractType {
  _id: string;
  clientId?: string;
  agentsIds: string[];
  applicaitonId?: string;
  contractPDF?: string;
  term?: string;
  createdAt?: string;
}

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (term: string) => void;
  onDownloadFormat?: () => void;
  loading?: boolean;
  applicationId?: string;
  clientName?: string;
}

const AddContractModal: React.FC<AddContractModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDownloadFormat,
  loading = false,
  applicationId,
  clientName,
}) => {
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && term.trim()) {
      onSubmit(term);
    }
  };

  const handleClose = () => {
    setTerm("");
    onClose();
  };

  const handleDownloadFormat = () => {
    if (onDownloadFormat) {
      onDownloadFormat();
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setTerm(value);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[600px] m-4 w-full"
    >
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-11">
        <div className="px-2 pr-12 sm:pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl">
            Add New Contract
          </h4>
          <p className="mb-5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm lg:mb-7">
            Create a new contract by specifying term in months.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-2 pb-3 sm:max-h-[500px]">
              {/* Download Format Section */}
              <div className="mb-6 sm:mb-7">
                <h5 className="mb-4 text-base font-medium text-gray-800 dark:text-white/90 sm:text-lg lg:mb-6">
                  Contract Template
                </h5>

                <div className="rounded-md border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800 sm:p-4">
                  <p className="mb-3 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    You can download the generated PDF file for this contract.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadFormat}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Download size={16} />
                    Download Generated Contract
                  </Button>
                </div>
              </div>

              {/* Term Input Section */}
              <div>
                <h5 className="mb-4 text-base font-medium text-gray-800 dark:text-white/90 sm:text-lg lg:mb-6">
                  Contract Term
                </h5>

                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  <div className="col-span-1">
                    <Label htmlFor="term">
                      Term (Months) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <input
                        type="text"
                        id="term"
                        value={term}
                        onChange={handleTermChange}
                        placeholder="e.g., 12"
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-16 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:disabled:bg-gray-700"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        months
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Specify the total duration of the contract (e.g., 12, 24,
                      or 36 months).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col-reverse gap-2 px-2 sm:flex-row sm:items-center sm:gap-3 lg:mt-6 lg:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={loading || !term.trim()}
                className="w-full sm:w-auto"
              >
                {loading ? "Creating..." : "Create Contract"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddContractModal;
