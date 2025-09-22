import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import useLandModal from "../../hooks/projects-hooks/modal/useLandModal";

import { bulkSaveLots, LotType } from "../../store/slices/lotSlice";
import { EditIcon, DeleteIcon } from "../../icons";

import { createLand, LandTypes } from "../../store/slices/landSlice";
import { createChangeHandler } from "../../utils/createChangeHandler";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import Radio from "../../components/form/input/Radio";
import LandSelectionModal from "../../components/modal/saleModal/LandSelectionModal";

import { ClientType } from "../../store/slices/clientSlice";
import ClientSelectionModal from "../../components/modal/saleModal/ClientSelectionModal";
import LotSelectionModal from "../../components/modal/saleModal/LotSelectionModal";
import AgentSelectionModal from "../../components/modal/saleModal/AgentSelectionModal";
import { AgentType } from "../../store/slices/agentSlice";
import ClientDetails from "../../components/form/agents/ClientDetails";
import LandDetails from "../../components/form/agents/LandDetails";
import { SaleLotTable } from "../../components/tables/saleForm/SaleLotTable";
import { SaleAgentTable } from "../../components/tables/saleForm/SaleAgentTable";

interface LandFormProp {
  data?: LotType;
}

const SaleForm = ({ data }: LandFormProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updateLoading: landLoading } = useSelector(
    (state: RootState) => state.land
  );
  const { updateLoading: lotLoading } = useSelector(
    (state: RootState) => state.lot
  );

  // Selection Hooks
  const [landInputData, setLandInputData] = useState<LandTypes>({
    _id: "",

    name: "",
    location: "",
    totalArea: 0,
    totalLots: 0,
  });

  const [selectedClient, setSelectedClient] = useState<ClientType>(
    {} as ClientType
  );
  const [selectedLots, setSelectedLots] = useState<LotType[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([]);

  // Modal Hooks
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  useEffect(() => {
    const totalLots = selectedLots.length;
    setLandInputData((prev) => ({ ...prev, totalLots: totalLots }));
  }, [selectedLots.length]);

  const onChangeHanlder = createChangeHandler(setLandInputData);

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
    } catch (error) {
      console.log(error);
    }
  };

  const clearInput = () => {
    setLandInputData({
      _id: "",
      name: "",
      location: "",
      totalArea: 0,
      totalLots: 0,
    });
  };

  const RadioChecker = () => {};

  const deleteLotHanler = () => {};

  return (
    <>
      <PageMeta title="Sale Form" description="Transaction-form" />
      <PageBreadcrumb pageTitle="New Sale" />
      <ComponentCard title="New Sale  Form">
        <div className="p-4 sm:p-6 dark:border-gray-800">
          <LandDetails
            openLandModal={() => setIsLandModalOpen(true)}
            data={landInputData}
          />
          <ClientDetails
            openSelection={() => setIsClientModalOpen(true)}
            data={selectedClient}
          />

          <SaleLotTable
            lots={selectedLots}
            setSelectedLots={setSelectedLots}
            openLotForm={() => setIsLotModalOpen(true)}
          />

          <SaleAgentTable
            setSelectedAgents={selectedAgents}
            agents={selectedAgents}
            openAgentsForm={() => setIsAgentModalOpen(true)}
          />

          <form action="">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label>Payment Type</Label>

                <div className="pt-4 pb-2 flex flex-wrap items-center gap-8">
                  <Radio
                    id="radio1"
                    name="group1"
                    value="Single"
                    checked={true}
                    onChange={RadioChecker}
                    label="Installment"
                  />

                  <Radio
                    id="radio2"
                    name="group2"
                    value="Married"
                    checked={false}
                    onChange={RadioChecker}
                    label="Full Payment"
                  />
                </div>
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
                <Label>Term</Label>
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
                <Label>Total Lots</Label>
                <Input
                  value={selectedLots.length}
                  type="number"
                  className="dark:[color-scheme:dark]"
                  name="totalArea"
                  placeholder="Added lots"
                  readonly
                />
              </div>

              <div>
                <Label>Generated Total Price</Label>
                <Input
                  value={selectedLots.length}
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
                onClick={handleSave}
              >
                {lotLoading || landLoading
                  ? "Processing..."
                  : "Save Land Project"}
              </Button>
            </div>
          </form>
        </div>
      </ComponentCard>
      <LandSelectionModal
        selectedData={setLandInputData}
        isOpen={isLandModalOpen}
        onClose={() => setIsLandModalOpen(false)}
      />

      <ClientSelectionModal
        selectedData={setSelectedClient}
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />
      <LotSelectionModal
        isOpen={isLotModalOpen}
        selectedData={setSelectedLots}
        onClose={() => setIsLotModalOpen(false)}
      />
      <AgentSelectionModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedData={setSelectedAgents}
      />
    </>
  );
};

export default SaleForm;
