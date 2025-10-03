import React from "react";
import { ClientType } from "../../../store/slices/clientSlice";
import { renderImageOrDefault } from "../../../utils/api/ImageApiHelper";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";

import Avatar from "../../ui/avatar/Avatar";

interface ClientInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientType;
}

const ClientInfoModal: React.FC<ClientInfoModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  if (!client) return null;

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

  const getFullName = () => {
    const parts = [client.firstName, client.middleName, client.lastName].filter(
      Boolean
    );
    return parts.join(" ");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Client Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            View client details and contact information.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            {/* Profile Section */}
            {client.profilePicc && (
              <div className="mb-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Profile Picture
                </h5>
                <div className="flex justify-center">
                  <Avatar
                    src={renderImageOrDefault(
                      client._id,
                      client.profilePicc as string
                    )}
                    size="modal"
                    status={client.status === "active" ? "online" : "offline"}
                  />
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {client.firstName}
                  </div>
                </div>

                {client.middleName && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Middle Name</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {client.middleName}
                    </div>
                  </div>
                )}

                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {client.lastName}
                  </div>
                </div>

                {client.email && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {client.email}
                    </div>
                  </div>
                )}

                {client.contact && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Contact Number</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {client.contact}
                    </div>
                  </div>
                )}

                {client.Marital && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Marital Status</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {client.Marital}
                    </div>
                  </div>
                )}

                {client.address && (
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {client.address}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Additional Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {client._id && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Client ID</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      #{client._id}
                    </div>
                  </div>
                )}

                {client.createdAt && (
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Date Created</Label>
                    <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {formatDate(client.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClientInfoModal;
