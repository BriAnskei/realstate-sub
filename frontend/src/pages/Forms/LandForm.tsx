import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

import { LotType } from "../../store/slices/lotSlice";
import { createLand, LandTypes } from "../../store/slices/landSlice";
import { createChangeHandler } from "../../utils/createChangeHandler";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import LotsAddedTable from "../../components/tables/employee/LotsAddedTable";
import { useNavigate } from "react-router";
import ConfirmationModal from "../../components/modal/ConfirmtionModal";

const initialLandInput = {
  _id: "",
  name: "",
  location: "",
  lotsSold: 0,
  available: 0,
  totalArea: 0,
  totalLots: 0,
};

const LandForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.land);

  const [landInputData, setLandInputData] =
    useState<LandTypes>(initialLandInput);
  const [lots, setLots] = useState<LotType[]>([]);

  // confirmation modal
  const [onSaveModalConfirm, setOnSaveModalConfirm] = useState(false);
  const [isInvalidModalOpen, setisInvalidModalOpen] = useState(false);

  useEffect(() => {
    const countLotTypes = () => {
      const totalLots = lots.length;
      setLandInputData((prev) => ({ ...prev, totalLots: totalLots }));
      for (let lot of lots) {
        if (lot.status === "sold" || lot.status === "reserved") {
          setLandInputData((prev) => ({
            ...prev,
            lotsSold: (landInputData.lotsSold || 0) + 1,
          }));
        } else {
          setLandInputData((prev) => ({
            ...prev,
            available: (landInputData.available || 0) + 1,
          }));
        }
      }
    };
    countLotTypes();
  }, [lots]);

  // land input listener
  const onChangeHanlder = createChangeHandler(setLandInputData);

  const verifyInputOnSave = () => {
    const isInputInvalid: boolean =
      !landInputData.name?.trim() ||
      !landInputData.location?.trim() ||
      !landInputData.totalArea ||
      !landInputData.totalLots;

    if (isInputInvalid) {
      setisInvalidModalOpen(true);
    } else {
      setOnSaveModalConfirm(true);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(createLand({ land: landInputData, lots: lots }));
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Success navigating to land table");
      navigate("/land");
    }
  };

  const clearInput = () => {
    setLandInputData({ ...initialLandInput, totalLots: lots.length });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="New Land Project" />
      <ComponentCard title="Land Project Details">
        <div className="p-4 sm:p-6 dark:border-gray-800">
          <form action="">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={landInputData?.name}
                  onChange={onChangeHanlder}
                  type="text"
                  name="name"
                  placeholder="e.g. Greenfield Estates"
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={landInputData?.location}
                  onChange={onChangeHanlder}
                  type="text"
                  name="location"
                  placeholder="e.g. Quezon City, Metro Manila"
                />
              </div>

              <div>
                <Label>Total Area (sqm)</Label>
                <Input
                  value={landInputData?.totalArea}
                  onChange={onChangeHanlder}
                  type="number"
                  className="dark:[color-scheme:dark]"
                  name="totalArea"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <Label>Lots Added (auto-generated)</Label>
                <Input
                  value={lots.length}
                  type="number"
                  className="dark:[color-scheme:dark]"
                  name="totalArea"
                  placeholder="Added lots"
                  readonly
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={clearInput}>
                Clear Inputs
              </Button>

              <Button
                className="bg-green-500"
                size="sm"
                variant="primary"
                onClick={verifyInputOnSave}
              >
                {loading ? "Processing..." : "Save Land Project"}
              </Button>
            </div>
          </form>
        </div>
        <LotsAddedTable lots={lots} setLots={setLots} />
      </ComponentCard>
      <ConfirmationModal
        title="Save Land and Lot"
        message="Are you sure you want to save this land and lot property? This will create a new listing in the system."
        buttonText="Save Property"
        cancelText="Cancel"
        variant="success"
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6 text-green-600"
          >
            <path
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        bgIcon="bg-green-100"
        bgButton="bg-green-600 hover:bg-green-700"
        isOpen={onSaveModalConfirm}
        onClose={() => setOnSaveModalConfirm(false)}
        onConfirm={handleSave}
        loading={loading}
      />

      <ConfirmationModal
        title="Invalid Form Input"
        message="Please ensure all required fields are filled out and at least one lot is added before proceeding."
        loading={false}
        isOpen={isInvalidModalOpen}
        onClose={() => setisInvalidModalOpen(false)}
      />
    </>
  );
};

export default LandForm;
