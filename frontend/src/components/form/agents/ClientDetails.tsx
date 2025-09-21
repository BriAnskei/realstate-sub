import { ClientType } from "../../../store/slices/clientSlice";
import { createChangeHandler } from "../../../utils/createChangeHandler";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import DatePicker from "../date-picker";

import FileInput from "../input/FileInput";
import Input from "../input/InputField";
import Label from "../Label";

interface ClientDetailsProp {
  data: ClientType & { appointmentDate: string };
  setClientData: React.Dispatch<
    React.SetStateAction<ClientType & { appointmentDate: string }>
  >;
}

const ClientDetails = ({ data, setClientData }: ClientDetailsProp) => {
  const handleReset = () => {
    setClientData({
      _id: "",
      validIdPicc: "",
      firstName: "",
      middleName: "",
      lastName: "",
      contact: "",
      address: "",
      appointmentDate: "",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setClientData((prev) => ({ ...prev, validIdPicc: previewUrl }));
    }
  };

  const onChangeHanlder = createChangeHandler(setClientData);

  return (
    <ComponentCard
      className="mb-7"
      title="Client Details"
      actions={[
        <Button variant="outline" onClick={handleReset}>
          Clear
        </Button>,
      ]}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="validIds">Upload Valid ID</Label>
          <FileInput
            accept="image/*"
            onChange={handleFileChange}
            className="custom-class"
          />
        </div>

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="e.g., Juan"
            value={data?.firstName || ""}
            onChange={onChangeHanlder}
          />
        </div>

        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            type="text"
            name="middleName"
            placeholder="e.g., Dela"
            value={data?.middleName || ""}
            onChange={onChangeHanlder}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="e.g., Cruz"
            value={data?.lastName || ""}
            onChange={onChangeHanlder}
          />
        </div>

        <div>
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            type="text"
            name="contact"
            placeholder="e.g., 0917 123 4567"
            value={data?.contact || ""}
            onChange={onChangeHanlder}
          />
        </div>

        <div>
          <Label htmlFor="address">Complete Address</Label>
          <Input
            id="address"
            type="text"
            name="address"
            placeholder="e.g., 123 Rizal St., Quezon City, Metro Manila"
            value={data?.address || ""}
            onChange={onChangeHanlder}
          />
        </div>

        <div>
          <DatePicker
            id="date-picker"
            label="Appointment Date"
            placeholder="Select a date"
            
            onChange={(dates, currentDateString) => {
              console.log({ dates, currentDateString });
            }}
          />
        </div>
      </div>
    </ComponentCard>
  );
};

export default ClientDetails;
