import { useState, useEffect, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ClientDetails from "../../../components/form/agents/ClientDetails";
import LandDetails from "../../../components/form/agents/LandDetails";
import { AgentTable } from "../../../components/tables/application/AgentTable";
import Button from "../../../components/ui/button/Button";

import { LandTypes, createLand } from "../../../store/slices/landSlice";
import { LotType, bulkSaveLots } from "../../../store/slices/lotSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { UserType, userUser } from "../../../context/UserContext";
import backtoTop from "../../../icons/back-to-top-icon.svg";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import LotTable from "../../../components/tables/projects/LotTable";
import { AppLotTable } from "../../../components/tables/application/AppLotTable";

const ApplicationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { updateLoading: landLoading } = useSelector(
    (state: RootState) => state.land
  );
  const { updateLoading: lotLoading } = useSelector(
    (state: RootState) => state.lot
  );

  // application data
  const [application, setApplication] = useState<ApplicationType>(
    {} as ApplicationType
  );

  const [selectedAgents, setSelectedAgents] = useState<UserType[]>([]);

  const handleSave = async () => {
    try {
      // mock initialization
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Appliction update: ", application);
  }, [application]);

  return (
    <>
      <PageMeta title="Sale Form" description="Transaction-form" />
      <PageBreadcrumb pageTitle="New Application" />
      <ComponentCard
        title="Application Form"
        actions={[
          <Button
            className="bg-green-500"
            size="sm"
            variant="primary"
            onClick={handleSave}
          >
            {lotLoading || landLoading ? "Processing..." : "Submit "}
          </Button>,
        ]}
      >
        <div className="p-4 sm:p-6 dark:border-gray-800">
          {/* Client Input */}
          <ClientDetails setApplication={setApplication} />
          <LandDetails setApplication={setApplication} />
          <AppLotTable
            setApplication={setApplication}
            landId={application.landdId}
          />
          <AgentTable setApplication={setApplication} />
          <div className="flex  justify-center items-center">
            <img
              src={backtoTop}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </div>
        </div>
      </ComponentCard>
    </>
  );
};

export default ApplicationForm;
