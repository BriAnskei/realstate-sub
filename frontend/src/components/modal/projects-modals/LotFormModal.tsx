import { useState, useEffect } from "react";
import { createChangeHandler } from "../../../utils/createChangeHandler";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { LotType } from "../../../store/slices/lotSlice";
import Radio from "../../form/input/Radio";

interface LotFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  data?: LotType;
  saveLot?: (data: LotType) => void;
  saveUpdate: (newData: LotType) => void;
}

interface ErrorState {
  blockNumber: boolean;
  lotNumber: boolean;
  lotSize: boolean;
  pricePerSqm: boolean;
  lotType: boolean;
}

const initialValue: LotType = {
  _id: "",
  landId: "",
  blockNumber: "",
  lotNumber: "",
  lotSize: "",
  pricePerSqm: "",
  totalAmount: "",
  lotType: "",
  status: "available",
};

const initialErrors: ErrorState = {
  blockNumber: false,
  lotNumber: false,
  lotSize: false,
  pricePerSqm: false,
  lotType: false,
};

const LotFormModal = ({
  isOpen,
  onClose,
  data,
  saveLot,
  saveUpdate,
}: LotFormModalProp) => {
  const [totalAmount, setTotalAmount] = useState("");
  const [inputData, setInputData] = useState<LotType>(initialValue);
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setInputData(data);
    } else {
      setInputData(initialValue);
      setTotalAmount("");
    }
    setErrors(initialErrors);
    setShowErrors(false);
  }, [isOpen]);

  useEffect(() => {
    const productAmount = () => {
      if (inputData.lotSize && inputData.pricePerSqm) {
        setTimeout(() => {
          setTotalAmount(
            (
              parseInt(inputData.lotSize!, 10) *
              parseInt(inputData.pricePerSqm!, 10)
            ).toString()
          );

          setInputData((prev) => ({
            ...prev,
            totalAmount: (
              Number(inputData.lotSize) * Number(inputData.pricePerSqm)
            ).toString(),
          }));
        }, 400);
      }
    };
    productAmount();
  }, [inputData.lotSize, inputData.pricePerSqm]);

  const onChangeHanlder = createChangeHandler(setInputData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (showErrors && errors[name as keyof ErrorState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    onChangeHanlder(e);
  };

  const handleRadioChange = (value: string) => {
    setInputData((prev) => ({ ...prev, status: value }));
  };

  const validateForm = (): boolean => {
    console.log(inputData);

    const newErrors: ErrorState = {
      blockNumber: !String(inputData.blockNumber || "").trim(),
      lotNumber: !String(inputData.lotNumber || "").trim(),
      lotSize: !String(inputData.lotSize || "").trim(),
      pricePerSqm: !String(inputData.pricePerSqm || "").trim(),
      lotType: !String(inputData.lotType || "").trim(),
    };

    setErrors(newErrors);
    setShowErrors(true);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (data) {
      saveUpdate(inputData);
    } else {
      saveLot!(inputData);
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const getInputClassName = (fieldName: keyof ErrorState): string => {
    const baseClasses = "dark:[color-scheme:dark]";
    if (showErrors && errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    return baseClasses;
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {data ? "Update Lot" : "Project Lot"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="px-2 overflow-y-auto custom-scrollbar p-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Block Number *</Label>
                  <Input
                    type="text"
                    value={inputData.blockNumber}
                    name="blockNumber"
                    placeholder="e.g. 5"
                    onChange={handleInputChange}
                    className={
                      showErrors && errors.blockNumber
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {showErrors && errors.blockNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      Block number is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Lot Number *</Label>
                  <Input
                    type="number"
                    value={inputData.lotNumber}
                    name="lotNumber"
                    placeholder="e.g. 12"
                    onChange={handleInputChange}
                    className={
                      showErrors && errors.lotNumber
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:[color-scheme:dark]"
                        : "dark:[color-scheme:dark]"
                    }
                  />
                  {showErrors && errors.lotNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      Lot number is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Lot Size (sqm) *</Label>
                  <Input
                    type="number"
                    value={inputData.lotSize}
                    className={getInputClassName("lotSize")}
                    name="lotSize"
                    placeholder="e.g. 120"
                    onChange={handleInputChange}
                  />
                  {showErrors && errors.lotSize && (
                    <p className="mt-1 text-sm text-red-600">
                      Lot size is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Price per sqm *</Label>
                  <Input
                    type="number"
                    className={getInputClassName("pricePerSqm")}
                    value={inputData.pricePerSqm}
                    name="pricePerSqm"
                    placeholder="e.g. 1,500"
                    onChange={handleInputChange}
                  />
                  {showErrors && errors.pricePerSqm && (
                    <p className="mt-1 text-sm text-red-600">
                      Price per sqm is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Total Amount (auto-generated)</Label>
                  <Input
                    readonly
                    type="number"
                    className="dark:[color-scheme:dark] bg-gray-50 dark:bg-gray-800"
                    value={totalAmount}
                    name="totalAmount"
                    placeholder="Generated Total Amount"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Lot Type *</Label>
                  <Input
                    type="text"
                    value={inputData.lotType}
                    name="lotType"
                    placeholder="e.g. Residential, Commercial"
                    onChange={handleInputChange}
                    className={
                      showErrors && errors.lotType
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {showErrors && errors.lotType && (
                    <p className="mt-1 text-sm text-red-600">
                      Lot type is required
                    </p>
                  )}
                </div>

                {!data && (
                  <div className="lg:col-span-2">
                    <Label>Status</Label>
                    <div className="flex flex-wrap items-center gap-8 mt-3">
                      <Radio
                        id="available"
                        name="status"
                        value="available"
                        label="Available"
                        checked={inputData.status === "available"}
                        onChange={handleRadioChange}
                      />
                      <Radio
                        id="reserved"
                        name="status"
                        value="reserved"
                        label="Reserved"
                        checked={inputData.status === "reserved"}
                        onChange={handleRadioChange}
                      />
                      <Radio
                        id="sold"
                        name="status"
                        value="sold"
                        label="Sold"
                        checked={inputData.status === "sold"}
                        onChange={handleRadioChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                type="button"
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                {data ? "Update Lot" : "Add Lot"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LotFormModal;
