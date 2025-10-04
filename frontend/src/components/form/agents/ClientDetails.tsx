import React, { useEffect, useRef, useState } from "react";
import Button from "../../ui/button/Button";
import DatePicker from "../date-picker";
import ComponentCard from "../../common/ComponentCard";
import ClientSelectionModal from "../../modal/saleModal/ClientSelectionModal";
import {
  ClientType,
  resetClientFilter,
  searchClient,
} from "../../../store/slices/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { debouncer } from "../../../utils/debouncer";
import { renderImageOrDefault } from "../../../utils/api/ImageApiHelper";
import { ApplicationType } from "../../../store/slices/applicationSlice";

interface ClientDetailsCardProp {
  setApplication: React.Dispatch<React.SetStateAction<ApplicationType>>;
  selectedClientId?: string; // this will be field if form is updatting
}

const ClientDetailsCard = ({
  setApplication,
  selectedClientId,
}: ClientDetailsCardProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const { byId, filterById, allIds, filterIds, filterLoading } = useSelector(
    (state: RootState) => state.client
  );
  const [selectedClient, setSelectedClient] = useState<ClientType | undefined>(
    undefined
  );

  // searching hooks
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedSearchRef = useRef<ReturnType<typeof debouncer> | null>(null);

  const [isSelectionShow, setIsSelectionnShow] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<string | undefined>();

  // for client selection modal
  searchQueryHanlder();

  // fetch the selected client
  useEffect(() => {}, [selectedClientId]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchLoading(true);
      debouncedSearchRef.current!(searchQuery);
    } else {
      dispatch(resetClientFilter());
    }
  }, [searchQuery]);
  const getData = useFilteredData({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },

    filterOptions: {
      searchInput: searchQuery,
      filterLoading: filterLoading,
    },
  });

  // setter
  useEffect(() => {
    if (selectedClient)
      setApplication((prev) => ({
        ...prev,
        clientId: selectedClient._id,
        clientName: `${selectedClient.firstName} ${selectedClient.middleName} ${selectedClient.lastName}`,
      }));

    if (appointmentDate) {
      setApplication((prev) => ({ ...prev, appointmentDate }));
    }
  }, [selectedClient, appointmentDate]);

  return (
    <>
      <>
        <ComponentCard
          title="Client/Application Details"
          className="m-2 sm:m-4 lg:m-7"
          actions={[
            <Button
              onClick={() => setIsSelectionnShow(true)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg px-4 py-2.5 sm:py-3 text-sm font-medium text-white bg-brand-500 shadow-theme-xs hover:bg-brand-600 transition disabled:bg-brand-300 min-h-[44px] sm:min-w-[140px]"
            >
              Select Client
            </Button>,
          ]}
        >
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            {/* Client Details Card */}
            <div className="p-4 sm:p-5 lg:p-6 border border-gray-200 rounded-xl sm:rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900 mb-4 sm:mb-6">
              <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
                {!selectedClient ? (
                  <span className="m-auto text-lg sm:text-2xl font-semibold text-gray-500 dark:text-gray-400">
                    Selected client will display here
                  </span>
                ) : (
                  <>
                    <div className="flex flex-col items-center w-full gap-4 sm:gap-6 md:flex-row lg:flex-row">
                      {/* Avatar - Responsive sizing */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-700">
                        {selectedClient.profilePicc ? (
                          <img
                            src={renderImageOrDefault(
                              selectedClient._id,
                              selectedClient.profilePicc as string
                            )}
                            alt={`${selectedClient.firstName} ${selectedClient.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-lg sm:text-2xl font-semibold text-gray-500 dark:text-gray-400">
                              {selectedClient.firstName?.charAt(0)}
                              {selectedClient.lastName?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Client Info - Improved mobile layout */}
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <h4 className="mb-2 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white/90 break-words">
                          {selectedClient.firstName || ""}{" "}
                          {selectedClient.middleName || ""}{" "}
                          {selectedClient.lastName || ""}
                        </h4>

                        {/* Contact info - Better mobile stacking */}
                        <div className="space-y-1 sm:space-y-2">
                          {/* Email and Marital Status Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-1">
                            {selectedClient.email && (
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                {selectedClient.email}
                              </p>
                            )}
                            {selectedClient.email && selectedClient.Marital && (
                              <div className="hidden sm:block h-3.5 w-px bg-gray-300 dark:bg-gray-700"></div>
                            )}
                            {selectedClient.Marital && (
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {selectedClient.Marital}
                              </p>
                            )}
                          </div>

                          {/* Contact Number */}
                          {selectedClient.contact && (
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {selectedClient.contact}
                            </p>
                          )}

                          {/* Address */}
                          {selectedClient.address && (
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
                              {selectedClient.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Status Badge - Better mobile positioning */}
                    <div className="flex items-center justify-center lg:justify-end mt-2 lg:mt-0">
                      {selectedClient.status && (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                            selectedClient.status === "active"
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                              selectedClient.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {selectedClient.status.charAt(0).toUpperCase() +
                            selectedClient.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Appointment Schedule Section - Improved responsiveness */}
            <div className="w-full max-w-2xl p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white text-center sm:text-left">
                Schedule Appointment
              </h3>

              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Date Picker Section */}
                <div className="w-full">
                  <DatePicker
                    id="date-picker"
                    label="Appointment Date"
                    placeholder="Select a date"
                    onChange={(dates, currentDateString) => {
                      setAppointmentDate(currentDateString);
                    }}
                  />
                </div>

                {/* Select Client Button */}
                {/* <div className="flex justify-center sm:justify-start">
                  
                </div> */}
              </div>
            </div>

            {/* Client Selection Dropdown - Mobile optimized */}
            {isSelectionShow && (
              <div className="fixed inset-0 z-50 sm:relative sm:inset-auto sm:z-auto mt-4">
                {/* Mobile backdrop */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 sm:hidden"
                  onClick={() => setIsSelectionnShow(false)}
                />

                {/* Dropdown content */}
                <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto sm:left-auto sm:right-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-t-xl sm:rounded-xl shadow-xl max-h-[70vh] sm:max-h-96 overflow-y-auto">
                  {/* Mobile header */}
                  <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sm:hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Select Client
                      </h3>
                      <button
                        onClick={() => setIsSelectionnShow(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ComponentCard>
      </>
      <ClientSelectionModal
        setSearchQuery={setSearchQuery}
        isOpen={isSelectionShow}
        onClose={() => setIsSelectionnShow(false)}
        selectedData={setSelectedClient}
        byId={getData.byId}
        allIds={getData.allIds}
        filterLoading={filterLoading}
      />
    </>
  );

  function searchQueryHanlder() {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debouncer(async (searchQuery: string) => {
        try {
          await dispatch(searchClient({ query: searchQuery }));
        } catch (error) {
          console.log("failed to search cliend, ", error);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    }
  }
};

export default ClientDetailsCard;

// card
