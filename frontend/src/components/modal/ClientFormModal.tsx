import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

import { EnvelopeIcon } from "../../icons";

import FileInput from "../form/input/FileInput";

import { useEffect, useState } from "react";
import Radio from "../form/input/Radio";
import { createChangeHandler } from "../../utils/createChangeHandler";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  ClientType,
  editClient,
  addClient,
} from "../../store/slices/clientSlice";

interface ClientFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  data?: ClientType;
  updateLoading: boolean;
}

interface ErrorState {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  contact: boolean;
  address: boolean;
}

const initialInput: ClientType = {
  _id: "",
  profilePicc: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  contact: "",
  address: "",
  status: "inactive",
  Marital: "Prefer not to say",
};

const initialErrors: ErrorState = {
  firstName: false,
  lastName: false,
  email: false,
  contact: false,
  address: false,
};

const ClientFormModal = ({
  isOpen,
  onClose,
  data,
  updateLoading,
}: ClientFormModalProp) => {
  const dispatch = useDispatch<AppDispatch>();

  const [inputData, setInputData] = useState<ClientType>(initialInput);
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setInputData(data);
      } else {
        setInputData(initialInput);
      }
    } else {
      setInputData(initialInput);
    }
    setErrors(initialErrors);
    setShowErrors(false);
  }, [isOpen, data]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setInputData((prev) => ({ ...prev, profilePicc: previewUrl }));
    }
  };

  const handleRadioChange = (value: string) => {
    setInputData((prev) => {
      return { ...prev, Marital: value };
    });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {
      firstName: !String(inputData.firstName || "").trim(),
      lastName: !String(inputData.lastName || "").trim(),
      email:
        !String(inputData.email || "").trim() ||
        !isValidEmail(inputData.email!),
      contact: !String(inputData.contact || "").trim(),
      address: !String(inputData.address || "").trim(),
    };

    setErrors(newErrors);
    setShowErrors(true);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error);
  };

  const getInputClassName = (fieldName: keyof ErrorState): string => {
    const baseClasses = "dark:[color-scheme:dark]";
    if (showErrors && errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    return baseClasses;
  };

  const getEmailInputClassName = (): string => {
    const baseClasses = "pl-[62px] dark:[color-scheme:dark]";
    if (showErrors && errors.email) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    return baseClasses;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (updateLoading) return;

      if (!validateForm()) {
        return;
      }

      if (data) {
        await dispatch(editClient(inputData));
      } else {
        await dispatch(addClient(inputData));
      }

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    if (updateLoading) return;
    onClose();
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
              {data ? "Update Client" : "Add new Client"}
            </h4>
            {data && (
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Keep your clients up-to-date.
              </p>
            )}
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {!data && (
                  <div>
                    <Label>Client photo-optional</Label>
                    <FileInput
                      accept="image/*"
                      className="custom-class"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                <div>
                  <Label>First Name *</Label>
                  <Input
                    type="text"
                    value={inputData.firstName}
                    name="firstName"
                    placeholder="e.g. John"
                    onChange={handleInputChange}
                    className={getInputClassName("firstName")}
                  />
                  {showErrors && errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      First name is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Middle Name</Label>
                  <Input
                    type="text"
                    value={inputData.middleName}
                    name="middleName"
                    placeholder="Optional, e.g. Albert or A"
                    onChange={onChangeHanlder}
                    className="dark:[color-scheme:dark]"
                  />
                </div>

                <div>
                  <Label>Last Name *</Label>
                  <Input
                    type="text"
                    value={inputData.lastName}
                    name="lastName"
                    placeholder="e.g. Smith"
                    onChange={handleInputChange}
                    className={getInputClassName("lastName")}
                  />
                  {showErrors && errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      Last name is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Email *</Label>
                  <div className="relative">
                    <Input
                      value={inputData.email}
                      placeholder="info@gmail.com"
                      type="text"
                      name="email"
                      className={getEmailInputClassName()}
                      onChange={handleInputChange}
                    />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <EnvelopeIcon className="size-6" />
                    </span>
                  </div>
                  {showErrors && errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {!inputData.email?.trim()
                        ? "Email is required"
                        : "Please enter a valid email address"}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={inputData.contact}
                    name="contact"
                    placeholder="1234-567-8901"
                    type="text"
                    onChange={handleInputChange}
                    className={getInputClassName("contact")}
                  />
                  {showErrors && errors.contact && (
                    <p className="mt-1 text-sm text-red-600">
                      Phone number is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Address *</Label>
                  <Input
                    value={inputData.address}
                    name="address"
                    type="text"
                    placeholder="Clients addresss"
                    onChange={handleInputChange}
                    className={getInputClassName("address")}
                  />
                  {showErrors && errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      Address is required
                    </p>
                  )}
                </div>

                <div>
                  <Label>Marital status</Label>
                  <div className="pt-4 pb-2 flex flex-wrap items-center gap-8">
                    <Radio
                      id="radio1"
                      name="group1"
                      value="Single"
                      checked={inputData.Marital === "Single"}
                      onChange={handleRadioChange}
                      label="Single"
                    />

                    <Radio
                      id="radio2"
                      name="group2"
                      value="Married"
                      checked={inputData.Marital === "Married"}
                      onChange={handleRadioChange}
                      label="Married"
                    />
                    <Radio
                      id="radio3"
                      name="group3"
                      value="Prefer not to say"
                      checked={inputData.Marital === "Prefer not to say"}
                      onChange={handleRadioChange}
                      label="Prefer not to say"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                size="sm"
                type="submit"
                className={updateLoading ? "bg-blue-300" : undefined}
              >
                {updateLoading ? (
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
                ) : data ? (
                  "Update client"
                ) : (
                  "Add Client"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ClientFormModal;
