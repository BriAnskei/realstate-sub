import { useState } from "react";
import { LandTypes } from "../../../store/slices/landSlice";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Input from "../input/InputField";
import Label from "../Label";
import LandSelectionModal from "../../modal/saleModal/LandSelectionModal";

interface LandDetailProp {
  setSelectedLand: React.Dispatch<React.SetStateAction<LandTypes>>;
  data: LandTypes;
}

const LandDetails = ({ data, setSelectedLand }: LandDetailProp) => {
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);
  return (
    <>
      <ComponentCard
        className="mb-7"
        title="Land Details"
        actions={[
          <Button
            className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm  text-white  bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={() => setIsLandModalOpen(true)}
          >
            Select Land
          </Button>,
        ]}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Label>Project Name</Label>
            <Input
              readonly
              type="text"
              value={data && data.name}
              name="name"
              placeholder="Land Name will display here"
            />
          </div>

          <div>
            <Label>Locations</Label>
            <Input
              readonly
              type="text"
              value={data && data.location}
              name="name"
              placeholder="Land Location"
            />
          </div>
        </div>
      </ComponentCard>
      <LandSelectionModal
        selectedData={setSelectedLand}
        isOpen={isLandModalOpen}
        onClose={() => setIsLandModalOpen(false)}
      />
    </>
  );
};

export default LandDetails;
