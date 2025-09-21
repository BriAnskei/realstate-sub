import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Input from "../../../components/form/input/InputField";
import Radio from "../../../components/form/input/Radio";
import Label from "../../../components/form/Label";
import ClientDetails from "../../../components/form/agents/ClientDetails";
import LandDetails from "../../../components/form/agents/LandDetails";
import AgentSelectionModal from "../../../components/modal/saleModal/AgentSelectionModal";
import ClientSelectionModal from "../../../components/modal/saleModal/ClientSelectionModal";
import LandSelectionModal from "../../../components/modal/saleModal/LandSelectionModal";
import LotSelectionModal from "../../../components/modal/saleModal/LotSelectionModal";
import { SaleAgentTable } from "../../../components/tables/saleForm/SaleAgentTable";
import { SaleLotTable } from "../../../components/tables/saleForm/SaleLotTable";
import Button from "../../../components/ui/button/Button";
import { AgentType } from "../../../store/slices/agentSlice";
import { ClientType } from "../../../store/slices/clientSlice";
import { LandTypes, createLand } from "../../../store/slices/landSlice";
import { LotType, bulkSaveLots } from "../../../store/slices/lotSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { createChangeHandler } from "../../../utils/createChangeHandler";

interface ApplicationFormProp {
  data?: LotType;
}

const ApplicationForm = ({ data }: ApplicationFormProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updateLoading: landLoading } = useSelector(
    (state: RootState) => state.land
  );
  const { updateLoading: lotLoading } = useSelector(
    (state: RootState) => state.lot
  );

  // Selection Hooks
  const [landInputData, setLandInputData] = useState<LandTypes>(
    {} as LandTypes
  );
  const [clientData, setClientData] = useState<
    ClientType & { appointmentDate: string }
  >({} as ClientType & { appointmentDate: string });

  const [selectedLots, setSelectedLots] = useState<LotType[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([]);

  useEffect(() => {
    const totalLots = selectedLots.length;
    setLandInputData((prev) => ({ ...prev, totalLots: totalLots }));
  }, [selectedLots.length]);

  const handleSave = async () => {
    try {
      // mock initialization
      const landData: LandTypes = {
        ...landInputData,
        _id: (Math.random() * Math.random()).toString(),
        available: landInputData.totalLots,
        lotsSold: 0,
      };

      await dispatch(createLand(landData!));
      await dispatch(bulkSaveLots(selectedLots));
    } catch (error) {
      console.log(error);
    }
  };

  const RadioChecker = () => {};

  return (
    <>
      <PageMeta title="Sale Form" description="Transaction-form" />
      <PageBreadcrumb pageTitle="New Application" />
      <ComponentCard title="Application  Form">
        <div className="p-4 sm:p-6 dark:border-gray-800">
          <LandDetails
            setSelectedLand={setLandInputData}
            data={landInputData}
          />

          <SaleLotTable lots={selectedLots} setSelectedLots={setSelectedLots} />

          <SaleAgentTable
            setSelectedAgents={setSelectedAgents}
            agents={selectedAgents}
          />

          {/* Client Input */}
          <ClientDetails data={clientData} setClientData={setClientData} />
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              className="bg-green-500"
              size="sm"
              variant="primary"
              onClick={handleSave}
            >
              {lotLoading || landLoading ? "Processing..." : "Submit "}
            </Button>
          </div>
        </div>
      </ComponentCard>
    </>
  );
};

export default ApplicationForm;
