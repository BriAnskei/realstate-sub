import { useState, useEffect } from "react";
import { createChangeHandler } from "../../../utils/createChangeHandler";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { LandTypes } from "../../../store/slices/landSlice";

interface LandFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  data?: LandTypes;

  saveUpdate: (newData: LandTypes) => Promise<void>;
  loading: boolean;
}

interface ErrorState {
  name: boolean;
  location: boolean;
  totalArea: boolean;
}

const initialValue: LandTypes = {
  _id: "",
  name: "",
  location: "",
  totalArea: 0,
};

const initialErrors: ErrorState = {
  name: false,
  location: false,
  totalArea: false,
};

const LandFormModal = ({
  isOpen,
  onClose,
  data,

  saveUpdate,
  loading,
}: LandFormModalProp) => {
  const [inputData, setInputData] = useState<LandTypes>(initialValue);
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setInputData(data);
    } else {
      setInputData(initialValue);
    }
    setErrors(initialErrors);
    setShowErrors(false);
  }, [isOpen]);

  const onChangeHandler = createChangeHandler(setInputData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (showErrors && errors[name as keyof ErrorState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    onChangeHandler(e);
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {
      name: !String(inputData.name || "").trim(),
      location: !String(inputData.location || "").trim(),
      totalArea: !inputData.totalArea || inputData.totalArea <= 0,
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

    const isInputUpdated =
      data?.name !== inputData.name ||
      data?.location !== inputData.location ||
      data?.totalArea !== inputData.totalArea;

    if (!isInputUpdated) {
      handleClose();
      return;
    }

    saveUpdate(inputData);

    handleClose();
  };

  const handleClose = () => {
    if (loading) return;
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
              {data ? "Update Land" : "Add Land"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="px-2 overflow-y-auto custom-scrollbar p-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Land Name *</Label>
                  <Input
                    type="text"
                    value={inputData.name || ""}
                    name="name"
                    placeholder="e.g. Sunset Hills Subdivision"
                    onChange={handleInputChange}
                    className={getInputClassName("name")}
                  />
                  {showErrors && errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      Land name is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    type="text"
                    value={inputData.location || ""}
                    name="location"
                    placeholder="e.g. Davao City, Philippines"
                    onChange={handleInputChange}
                    className={getInputClassName("location")}
                  />
                  {showErrors && errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      Location is required
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <Label>Total Area (sqm) *</Label>
                  <Input
                    type="number"
                    value={inputData.totalArea || ""}
                    name="totalArea"
                    placeholder="e.g. 10000"
                    onChange={handleInputChange}
                    className={getInputClassName("totalArea")}
                  />
                  {showErrors && errors.totalArea && (
                    <p className="mt-1 text-sm text-red-600">
                      Total area is required and must be greater than 0
                    </p>
                  )}
                </div>
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
                {loading ? "Processing..." : "Update land"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LandFormModal;
