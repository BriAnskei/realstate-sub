import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

import { EnvelopeIcon } from "../../icons";

import FileInput from "../form/input/FileInput";

import { useEffect, useState } from "react";

import { createChangeHandler } from "../../utils/createChangeHandler";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  AgentType,
  updateAgent,
  addAgent,
} from "../../store/slices/agentSlice";

interface AgentFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  data?: AgentType;
  updateLoading: boolean;
}

const AgentFormModal = ({
  isOpen,
  onClose,
  data,
  updateLoading,
}: AgentFormModalProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputData, setInputData] = useState<AgentType>({
    _id: "",
    profilePicc: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setInputData(data);
      }
    } else {
      setInputData({
        _id: "",
        profilePicc: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contact: "",
        address: "",
      });
    }
  }, [isOpen, data]);

  useEffect(() => {
    console.log("input data update: ", inputData);
  }, [inputData]);

  const onChangeHanlder = createChangeHandler(setInputData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setInputData((prev) => ({ ...prev, profilePicc: previewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (updateLoading) return;

      if (data) {
        await dispatch(updateAgent(inputData));
      } else {
        await dispatch(addAgent(inputData));
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
              {data ? "Update Agent" : "Add new Agent"}
            </h4>
            {data && (
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Keep your agents data up-to-date.
              </p>
            )}
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {!data && (
                  <div>
                    <Label>Agents photo-optional</Label>
                    <FileInput
                      accept="image/*"
                      className="custom-class"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    value={inputData.firstName}
                    name="firstName"
                    placeholder="e.g. John"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Middle Name</Label>
                  <Input
                    type="text"
                    value={inputData.middleName}
                    name="middleName"
                    placeholder="Optional, e.g. Albert or A"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    value={inputData.lastName}
                    name="lastName"
                    placeholder="e.g. Smith"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <Input
                      value={inputData.email}
                      placeholder="info@gmail.com"
                      type="text"
                      name="email"
                      className="pl-[62px]"
                      onChange={onChangeHanlder}
                    />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <EnvelopeIcon className="size-6" />
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    value={inputData.contact}
                    name="contact"
                    placeholder="1234-567-8901"
                    type="text"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    value={inputData.address}
                    name="address"
                    type="text"
                    placeholder="Clients addresss"
                    onChange={onChangeHanlder}
                  />
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

export default AgentFormModal;
