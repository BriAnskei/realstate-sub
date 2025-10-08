import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import LandSelection from "./LandSelection";
import LotSelection from "./LotSelection";
import ClientSelector from "./ClientSelection";
import AppointmentDetails from "./AppointmentDetails";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { ClientType } from "../../../../store/slices/clientSlice";
import { LandTypes } from "../../../../store/slices/landSlice";
import { LotType } from "../../applicationModal/ApplicationInfoModal";
import { ApplicationType } from "../../../../store/slices/applicationSlice";
import { manualAddReservation } from "../../../../store/slices/reservationSlice";

// Type Definitions
export interface ReserveType {
  _id: string;
  applicationId?: string;
  clientName?: string;
  status?: "pending" | "cancelled" | "on contract" | "no show";
  notes?: string | null;
  appointmentDate?: string;
  createdAt?: string;
}

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lands?: LandTypes[];
  lots?: LotType[];
  clients?: ClientType[];
}

const AddReservationModal: React.FC<AddReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.reservation);

  const [currentStep, setCurrentStep] = useState<
    "land" | "lot" | "client" | "details"
  >("land");

  // Selection states
  const [selectedLand, setSelectedLand] = useState<LandTypes | null>(null);
  const [selectedLots, setSelectedLots] = useState<LotType[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  // Form states
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");

  const getFullName = (client: ClientType) => {
    return (
      [client.firstName, client.middleName, client.lastName]
        .filter(Boolean)
        .join(" ") || "N/A"
    );
  };

  const handleNext = () => {
    if (currentStep === "land" && selectedLand) {
      setCurrentStep("lot");
    } else if (currentStep === "lot" && selectedLots.length > 0) {
      setCurrentStep("client");
    } else if (currentStep === "client" && selectedClient) {
      setCurrentStep("details");
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("client");
    } else if (currentStep === "client") {
      setCurrentStep("lot");
    } else if (currentStep === "lot") {
      setCurrentStep("land");
    }
  };

  const generateManualReservationPayload = useCallback(() => {
    const newApplication: ApplicationType = {
      _id: "",
      landId: selectedLand!._id?.toString(),
      landName: selectedLand!.name,
      clientName: getFullName(selectedClient!),
      lotIds: selectedLots.map((lot) => parseInt(lot._id, 10)),
      clientId: selectedClient!._id?.toString(),
      appointmentDate, // optional, some schemas use this
      status: "approved",
    };

    // Build reservation object
    const newReservation: ReserveType = {
      _id: "",
      clientName: getFullName(selectedClient!),
      status: "pending",
      notes: notes || null,
      appointmentDate,
    };

    return { application: newApplication, reservation: newReservation };
  }, [selectedLand, selectedClient, appointmentDate]);

  const handleSubmit = async () => {
    try {
      const payload = generateManualReservationPayload();
      await dispatch(manualAddReservation(payload)).unwrap();

      onClose();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Reservation
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {currentStep === "land" && "Select a land property to continue"}
            {currentStep === "lot" && `Choose lots from ${selectedLand?.name}`}
            {currentStep === "client" && "Select a client for this reservation"}
            {currentStep === "details" && "Set appointment details and notes"}
          </p>
        </div>

        {/* Step Indicators */}
        {ModalIndecators(
          currentStep,
          selectedLand,
          selectedLots,
          selectedClient
        )}

        {/* Step Content */}
        <div className="px-2">
          {/* STEP 1: Land Selection */}
          {currentStep === "land" && (
            <LandSelection
              dispatch={dispatch}
              selectedLand={selectedLand}
              setSelectedLand={setSelectedLand}
            />
          )}

          {/* STEP 2: Lot Selection */}
          {currentStep === "lot" && (
            <LotSelection
              selectedLand={selectedLand}
              setCurrentStep={setCurrentStep}
              setSelectedLots={setSelectedLots}
              selectedLots={selectedLots}
              dispatch={dispatch}
            />
          )}
          {/* STEP 3: Client Selection */}
          {currentStep === "client" && (
            <ClientSelector
              dispatch={dispatch}
              selectedClient={selectedClient}
              getFullName={getFullName}
              setSelectedClient={setSelectedClient}
            />
          )}

          {/* STEP 4: Appointment Details */}
          {currentStep === "details" && (
            <AppointmentDetails
              selectedLand={selectedLand}
              selectedLots={selectedLots}
              selectedClient={selectedClient}
              getFullName={getFullName}
              appointmentDate={appointmentDate}
              setAppointmentDate={setAppointmentDate}
              notes={notes}
              setNotes={setNotes}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          {currentStep !== "land" && (
            <Button size="sm" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {currentStep === "details" ? (
            <Button size="sm" onClick={handleSubmit}>
              {loading ? "Processing..." : "      Create Reservation"}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleNext}
              disabled={
                (currentStep === "land" && !selectedLand) ||
                (currentStep === "lot" && selectedLots.length === 0) ||
                (currentStep === "client" && !selectedClient)
              }
            >
              Next
              {currentStep === "lot" &&
                selectedLots.length > 0 &&
                ` (${selectedLots.length})`}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddReservationModal;

function ModalIndecators(
  currentStep: string,
  selectedLand: LandTypes | null,
  selectedLots: LotType[],
  selectedClient: ClientType | null
) {
  return (
    <div className="flex items-center justify-center gap-2 px-2 mb-6">
      <div
        className={`flex items-center gap-2 ${
          currentStep === "land"
            ? "text-blue-600 dark:text-blue-400"
            : selectedLand
            ? "text-green-600 dark:text-green-400"
            : "text-gray-400"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
            currentStep === "land"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : selectedLand
              ? "bg-green-600 text-white dark:bg-green-500"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {selectedLand ? "✓" : "1"}
        </div>
        <span className="hidden text-sm font-medium sm:inline">Land</span>
      </div>

      <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <div
        className={`flex items-center gap-2 ${
          currentStep === "lot"
            ? "text-blue-600 dark:text-blue-400"
            : selectedLots.length > 0
            ? "text-green-600 dark:text-green-400"
            : "text-gray-400"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
            currentStep === "lot"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : selectedLots.length > 0
              ? "bg-green-600 text-white dark:bg-green-500"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {selectedLots.length > 0 ? "✓" : "2"}
        </div>
        <span className="hidden text-sm font-medium sm:inline">Lots</span>
      </div>

      <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <div
        className={`flex items-center gap-2 ${
          currentStep === "client"
            ? "text-blue-600 dark:text-blue-400"
            : selectedClient
            ? "text-green-600 dark:text-green-400"
            : "text-gray-400"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
            currentStep === "client"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : selectedClient
              ? "bg-green-600 text-white dark:bg-green-500"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {selectedClient ? "✓" : "3"}
        </div>
        <span className="hidden text-sm font-medium sm:inline">Client</span>
      </div>

      <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <div
        className={`flex items-center gap-2 ${
          currentStep === "details"
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-400"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
            currentStep === "details"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          4
        </div>
        <span className="hidden text-sm font-medium sm:inline">Details</span>
      </div>
    </div>
  );
}
