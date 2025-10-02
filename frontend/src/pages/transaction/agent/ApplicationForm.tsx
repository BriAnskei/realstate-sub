import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ClientDetails from "../../../components/form/agents/ClientDetails";
import LandDetails from "../../../components/form/agents/LandDetails";
import { AgentTable } from "../../../components/tables/application/AgentTable";
import Button from "../../../components/ui/button/Button";

import { AppDispatch, RootState } from "../../../store/store";
import { UserType } from "../../../context/UserContext";
import backtoTop from "../../../icons/back-to-top-icon.svg";
import {
  addNewApp,
  ApplicationType,
} from "../../../store/slices/applicationSlice";
import { AppLotTable } from "../../../components/tables/application/AppLotTable";
import { useNavigate } from "react-router";

const ApplicationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.application);

  // application data
  const [application, setApplication] = useState<ApplicationType>({
    _id: "",
    landId: "",
    landName: "",
    clientName: "",
    lotIds: [],
    clientId: "",
    agentDealerId: "",
    otherAgentIds: [],
    appointmentDate: "",
    status: "pending",
    createdAt: "",
  });

  const isAllInputValid = () => {
    for (const [key, value] of Object.entries(application)) {
      // skip validation for _id
      if (key === "_id" || key === "createdAt") {
        continue;
      }

      // validate strings
      if (typeof value === "string" && value.trim() === "") {
        console.log("no value in ", key, value);

        return false;
      }

      // validate arrays
      if (Array.isArray(value) && value.length === 0) {
        console.log("no value in ", key, value);

        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    try {
      if (!isAllInputValid()) {
        alert("Kindly fill out all fields in the application form.");
        return;
      }

      await dispatch(addNewApp(application));
      navigate("/application");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("applicaiton update: ", application);
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
            {loading ? "Processing..." : "Submit "}
          </Button>,
        ]}
      >
        <div className="p-4 sm:p-6 dark:border-gray-800">
          {/* Client Input */}
          <ClientDetails setApplication={setApplication} />
          <LandDetails setApplication={setApplication} />
          <AppLotTable
            setApplication={setApplication}
            landId={application.landId}
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
