import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";

import { EnvelopeIcon } from "../../../icons";

import FileInput from "../../form/input/FileInput";

import { useEffect, useState } from "react";
import Radio from "../../form/input/Radio";
import { createChangeHandler } from "../../../utils/createChangeHandler";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { ClientType, addClient } from "../../../store/slices/clientSlice";
import { fileUploadHandler } from "../../../utils/Uploader";

interface ClientFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  data?: ClientType;
  updateLoading: boolean;
  handleNewClient: (payload: FormData) => Promise<void>;
  handleEditClient: (payload: {
    data: FormData;
    clientId: number;
  }) => Promise<void>;
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
  handleNewClient,
  handleEditClient,
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

  const isValidEmail = emailValidator();

  const validateForm = formValidator();

  const getInputClassName = classNameGetter();

  const getEmailInputClassName = emailClassNameGetter();

  const onChangeHanlder = createChangeHandler(setInputData);

  const handleFileChange = fileUploadHandler(setInputData, "profilePicc");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (showErrors && errors[name as keyof ErrorState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    onChangeHanlder(e);
  };

  const handleRadioChange = (value: string) => {
    setInputData((prev) => {
      return { ...prev, Marital: value };
    });
  };

  const editHanlder = async () => {
    try {
      const formData = new FormData();

      // compare each prop value first
      Object.entries(inputData).forEach(([key, value]) => {
        const dataKey = key as keyof ClientType;

        if (key === "profilePicc" || key === "_id") return;

        if (
          (value !== null || value !== undefined) &&
          data![dataKey] !== value
        ) {
          formData.append(key, value);
        }
      });

      if (Array.from(formData.entries()).length === 0) {
        handleClose();
        return;
      }

      await handleEditClient({
        clientId: parseInt(data?._id!, 10),
        data: formData,
      });
      handleClose();
    } catch (error) {
      alert(error);
    }
  };

  const newClientHanlder = async () => {
    try {
      const formData = new FormData();

      Object.entries(inputData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      });
      await handleNewClient(formData);
      handleClose();
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (updateLoading) return;

      if (!validateForm()) {
        return;
      }

      if (data) {
        await editHanlder();
      } else {
        await newClientHanlder();
      }
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
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white/90">
              {data ? "Update Client" : "Add new Client"}
            </h4>
            {data ? (
              <p className="mb-4 sm:mb-6 lg:mb-7 text-sm text-gray-500 dark:text-gray-400">
                Keep your clients up-to-date.
              </p>
            ) : (
              <p className="mb-4 sm:mb-6 lg:mb-7 text-sm text-gray-500 dark:text-gray-400">
                Add a new client to your records.
              </p>
            )}
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                {!data && (
                  <div className="mb-6">
                    <Label>Client photo-optional</Label>
                    <FileInput
                      accept="image/*"
                      className="custom-class"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
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

                  <div className="col-span-2 lg:col-span-1">
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

                  <div className="col-span-2">
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

                  <div className="col-span-2 lg:col-span-1">
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
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-2.5 sm:px-3.5 py-2 sm:py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <EnvelopeIcon className="size-5 sm:size-6" />
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

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone *</Label>
                    <Input
                      value={inputData.contact}
                      name="contact"
                      placeholder="1234-567-8901"
                      type="number"
                      onChange={handleInputChange}
                      className={getInputClassName("contact")}
                    />
                    {showErrors && errors.contact && (
                      <p className="mt-1 text-sm text-red-600">
                        Phone number is required
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
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

                  <div className="col-span-2">
                    <Label>Marital status</Label>
                    <div className="pt-3 sm:pt-4 pb-2 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
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
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-2 mt-4 sm:mt-6 sm:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                className="order-2 sm:order-1"
              >
                Close
              </Button>
              <Button
                size="sm"
                type="submit"
                className={`order-1 sm:order-2 ${
                  updateLoading ? "bg-blue-300" : ""
                }`}
              >
                {updateLoading ? (
                  <>
                    <svg
                      className="mr-2 sm:mr-3 size-4 sm:size-5 animate-spin text-white"
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

  function emailValidator() {
    return (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  }

  function emailClassNameGetter() {
    return (): string => {
      const baseClasses = "pl-[52px] sm:pl-[62px] dark:[color-scheme:dark]";
      if (showErrors && errors.email) {
        return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
      }
      return baseClasses;
    };
  }

  function classNameGetter() {
    return (fieldName: keyof ErrorState): string => {
      const baseClasses = "dark:[color-scheme:dark]";
      if (showErrors && errors[fieldName]) {
        return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
      }
      return baseClasses;
    };
  }

  function formValidator() {
    return (): boolean => {
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
  }
};

export default ClientFormModal;
