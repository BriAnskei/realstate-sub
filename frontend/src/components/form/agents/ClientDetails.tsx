import React from "react";
import { ClientType } from "../../../store/slices/clientSlice";
import { renderImageOrDefault } from "../../../utils/api/ImageApiHelper";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Avatar from "../../ui/avatar/Avatar";

interface ClientDetailsCardProps {
  data: ClientType & { appointmentDate?: string };
}

const ClientDetailsCard: React.FC<ClientDetailsCardProps> = ({ data }) => {
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
    const parts = [data.firstName, data.middleName, data.lastName].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  return (
    <ComponentCard className="mb-7" title="Client Details">
      <div className="flex flex-col">
        {/* Profile Section */}
        {data.profilePicc && (
          <div className="mb-7">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Profile Picture
            </h5>
            <div className="flex justify-center">
              <Avatar
                src={renderImageOrDefault(data._id, data.profilePicc as string)}
                size="modal"
                status={data.status === "active" ? "online" : "offline"}
              />
            </div>
          </div>
        )}

        {/* Valid ID Section
        {data. && (
          <div className="mb-7">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Valid ID
            </h5>
            <div className="flex justify-center">
              <img
                src={data.validIdPicc}
                alt="Valid ID"
                className="max-h-64 rounded-lg border border-gray-300 object-contain dark:border-gray-600"
              />
            </div>
          </div>
        )} */}

        {/* Personal Information */}
        <div>
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h5>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>First Name</Label>
              <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {data.firstName || "N/A"}
              </div>
            </div>

            {data.middleName && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Middle Name</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {data.middleName}
                </div>
              </div>
            )}

            <div className="col-span-2 lg:col-span-1">
              <Label>Last Name</Label>
              <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {data.lastName || "N/A"}
              </div>
            </div>

            {data.email && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Email Address</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {data.email}
                </div>
              </div>
            )}

            {data.contact && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Contact Number</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {data.contact}
                </div>
              </div>
            )}

            {data.Marital && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Marital Status</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {data.Marital}
                </div>
              </div>
            )}

            {data.address && (
              <div className="col-span-2">
                <Label>Address</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {data.address}
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
            {data._id && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Client ID</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  #{data._id}
                </div>
              </div>
            )}

            {data.appointmentDate && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Appointment Date</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {formatDate(data.appointmentDate)}
                </div>
              </div>
            )}

            {data.createdAt && (
              <div className="col-span-2 lg:col-span-1">
                <Label>Date Created</Label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {formatDate(data.createdAt)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ClientDetailsCard;
