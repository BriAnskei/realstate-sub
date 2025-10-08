import Label from "../../../form/Label";

import { ClientType } from "../../../../store/slices/clientSlice";
import { LandTypes } from "../../../../store/slices/landSlice";
import { LotType } from "../../applicationModal/ApplicationInfoModal";
import DatePicker from "../../../form/date-picker";

interface AppointmentDetailsProp {
  selectedLand: LandTypes | null;
  selectedLots: LotType[];
  selectedClient: ClientType | null;
  getFullName: (client: ClientType) => string;
  appointmentDate: string;
  setAppointmentDate: React.Dispatch<React.SetStateAction<string>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const AppointmentDetails = ({
  selectedLand,
  selectedLots,
  selectedClient,
  getFullName,
  appointmentDate,
  setAppointmentDate,
  notes,
  setNotes,
}: AppointmentDetailsProp) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h5 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
          Reservation Summary
        </h5>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Land:</span>
            <span className="font-medium text-gray-800 dark:text-white/90">
              {selectedLand?.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Selected Lots:
            </span>
            <span className="font-medium text-gray-800 dark:text-white/90">
              {selectedLots.length} lot(s)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Client:</span>
            <span className="font-medium text-gray-800 dark:text-white/90">
              {selectedClient && getFullName(selectedClient)}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment Date */}
      <div>
        <DatePicker
          id="appointment-date"
          label="Appointment Date"
          placeholder="Select appointment date"
          defaultDate={appointmentDate || undefined}
          minDate="today"
          position="below"
          onChange={(selectedDates) => {
            if (selectedDates.length > 0) {
              // Format date as YYYY-MM-DD
              const date = selectedDates[0];
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              setAppointmentDate(`${year}-${month}-${day}`);
            }
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <Label>Notes (Optional)</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add any additional notes or comments..."
          className="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-400 resize-none"
        />
      </div>
    </div>
  );
};

export default AppointmentDetails;
