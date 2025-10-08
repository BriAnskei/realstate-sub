import React, { useState } from "react";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Label from "../../../form/Label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../../ui/table";
import Checkbox from "../../../form/input/Checkbox";
import LandSelection from "./LandSelection";
import LotSelection from "./LotSelection";
import ClientSelector from "./ClientSelection";
import AppointmentDetails from "./AppointmentDetails";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/store";

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

export interface LandTypes {
  _id: string;
  name?: string;
  location?: string;
  totalArea?: number;
  totalLots?: number;
  available?: number;
  lotsSold?: number;
  createdAt?: string;
}

export interface LotType {
  _id: string;
  name?: string;
  landId?: string;
  blockNumber?: string;
  lotNumber?: string;
  lotSize?: string;
  pricePerSqm?: string;
  totalAmount?: string;
  lotType?: string;
  status?: string;
  createdAt?: string;
}

export interface ClientType {
  _id: string;
  profilePicc?: string | File;
  firstName?: string;
  middleName: string;
  lastName?: string;
  email?: string;
  contact?: string;
  marital?: string;
  address?: string;
  status?: string;
  createdAt?: string;
}

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lands?: LandTypes[];
  lots?: LotType[];
  clients?: ClientType[];
}

// Mock Data for demo
const mockLands: LandTypes[] = [
  {
    _id: "1",
    name: "Highland Park",
    location: "Davao City",
    totalArea: 5000,
    totalLots: 120,
    available: 85,
    lotsSold: 35,
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    name: "Sunset Valley",
    location: "Tagum City",
    totalArea: 8000,
    totalLots: 200,
    available: 150,
    lotsSold: 50,
    createdAt: "2024-02-20",
  },
  {
    _id: "3",
    name: "Ocean View Estates",
    location: "Mati City",
    totalArea: 6500,
    totalLots: 180,
    available: 120,
    lotsSold: 60,
    createdAt: "2024-03-10",
  },
  {
    _id: "4",
    name: "Green Meadows",
    location: "Davao City",
    totalArea: 4200,
    totalLots: 95,
    available: 60,
    lotsSold: 35,
    createdAt: "2024-04-05",
  },
];

const mockLots: LotType[] = [
  {
    _id: "1",
    name: "Highland Park",
    landId: "1",
    blockNumber: "A",
    lotNumber: "101",
    lotSize: "250",
    pricePerSqm: "5000",
    status: "available",
  },
  {
    _id: "7",
    name: "Highland Park",
    landId: "1",
    blockNumber: "A",
    lotNumber: "101",
    lotSize: "250",
    pricePerSqm: "5000",
    status: "available",
  },
  {
    _id: "12",
    name: "Highland Park",
    landId: "1",
    blockNumber: "A",
    lotNumber: "101",
    lotSize: "250",
    pricePerSqm: "5000",
    status: "available",
  },
  {
    _id: "21",
    name: "Highland Park",
    landId: "1",
    blockNumber: "A",
    lotNumber: "101",
    lotSize: "250",
    pricePerSqm: "5000",
    status: "available",
  },
  {
    _id: "123",
    name: "Highland Park",
    landId: "1",
    blockNumber: "A",
    lotNumber: "101",
    lotSize: "250",
    pricePerSqm: "5000",
    status: "available",
  },
  {
    _id: "2",
    name: "Highland Park",
    landId: "1",
    blockNumber: "A",
    lotNumber: "102",
    lotSize: "300",
    pricePerSqm: "5000",
    status: "available",
  },
  {
    _id: "3",
    name: "Highland Park",
    landId: "1",
    blockNumber: "B",
    lotNumber: "201",
    lotSize: "280",
    pricePerSqm: "5500",
    status: "available",
  },
  {
    _id: "4",
    name: "Highland Park",
    landId: "1",
    blockNumber: "B",
    lotNumber: "202",
    lotSize: "320",
    pricePerSqm: "5500",
    status: "available",
  },
  {
    _id: "5",
    name: "Highland Park",
    landId: "1",
    blockNumber: "C",
    lotNumber: "301",
    lotSize: "290",
    pricePerSqm: "6000",
    status: "available",
  },
];

const mockClients: ClientType[] = [
  {
    _id: "1",
    firstName: "Juan",
    middleName: "Santos",
    lastName: "Dela Cruz",
    email: "juan@email.com",
    contact: "09171234567",
    status: "active",
  },
  {
    _id: "2",
    firstName: "Maria",
    middleName: "Garcia",
    lastName: "Reyes",
    email: "maria@email.com",
    contact: "09187654321",
    status: "active",
  },
  {
    _id: "3",
    firstName: "Pedro",
    middleName: "Ramos",
    lastName: "Santos",
    email: "pedro@email.com",
    contact: "09191122334",
    status: "active",
  },
  {
    _id: "4",
    firstName: "Ana",
    middleName: "Torres",
    lastName: "Martinez",
    email: "ana@email.com",
    contact: "09171239876",
    status: "active",
  },
  {
    _id: "5",
    firstName: "Carlos",
    middleName: "Villa",
    lastName: "Fernandez",
    email: "carlos@email.com",
    contact: "09185556677",
    status: "active",
  },
];

// Filter Component
const Filter = ({ onSearchChange, SearchPlaceholder, onSortChange }: any) => {
  return (
    <div className="flex flex-col gap-3 px-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder={SearchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-400"
        />
      </div>
      <div className="flex gap-2">
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-400"
        >
          <option value="">Sort by...</option>
          <option value="name">Name</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>
  );
};

const AddReservationModal: React.FC<AddReservationModalProps> = ({
  isOpen,
  onClose,
  lands = mockLands,
  lots = mockLots,
  clients = mockClients,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [currentStep, setCurrentStep] = useState<
    "land" | "lot" | "client" | "details"
  >("land");

  // Selection states
  const [selectedLand, setSelectedLand] = useState<LandTypes | null>(null);
  const [selectedLots, setSelectedLots] = useState<LotType[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  // Filter states

  const [lotSearch, setLotSearch] = useState("");
  const [lotSort, setLotSort] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [clientSort, setClientSort] = useState("");

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

  const filteredLots = selectedLand
    ? lots.filter(
        (lot) =>
          lot.landId === selectedLand._id &&
          lot.status === "available" &&
          (lot.blockNumber?.toLowerCase().includes(lotSearch.toLowerCase()) ||
            lot.lotNumber?.toLowerCase().includes(lotSearch.toLowerCase()))
      )
    : [];

  const filteredClients = clients.filter((client) => {
    const fullName = getFullName(client);
    return (
      fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.contact?.includes(clientSearch)
    );
  });

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

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      land: selectedLand,
      lots: selectedLots,
      client: selectedClient,
      appointmentDate,
      notes,
    });
    onClose();
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
              setClientSearch={setClientSearch}
              setClientSort={setClientSort}
              filteredClients={filteredClients}
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
              Create Reservation
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
