import { Routes, Route } from "react-router";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import AppLayout from "../../layout/AppLayout";
import Agents from "../Agents";
import SignIn from "../AuthPages/SignIn";
import SignUp from "../AuthPages/SignUp";
import Blank from "../Blank";
import Calendar from "../Calendar";
import BarChart from "../Charts/BarChart";
import LineChart from "../Charts/LineChart";
import Client from "../Client";
import FormElements from "../Forms/FormElements";

import SaleForm from "../Forms/SaleForm";
import NotFound from "../OtherPage/NotFound";
import Land from "../projects/Land";
import Lot from "../projects/Lot";
import BasicTables from "../Tables/BasicTables";

import Alerts from "../UiElements/Alerts";
import Avatars from "../UiElements/Avatars";
import Badges from "../UiElements/Badges";
import Buttons from "../UiElements/Buttons";
import Images from "../UiElements/Images";
import Videos from "../UiElements/Videos";
import AgentHome from "../Dashboard/AgentHome";
import Application from "../transaction/Application";
import ApplicationForm from "../transaction/agent/ApplicationForm";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  fetchByAgent,
  getRejectedAppByAgentId,
} from "../../store/slices/applicationSlice";
import { userUser } from "../../context/UserContext";
import { useApplication } from "../../context/ApplicationContext";
import RejectedApplication from "../report/RejectedApplication";

export default function AgentsApp() {
  const dispatch = useDispatch<AppDispatch>();
  const { editApplication } = useApplication();
  const { curUser } = userUser();
  useEffect(() => {
    const fetchApps = async () => {
      // applictions
      await dispatch(fetchByAgent(curUser?._id!));
      await dispatch(getRejectedAppByAgentId(curUser?._id!));
    };
    fetchApps();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<AgentHome />} />

          {/* {Projects} */}

          <Route path="/land" element={<Land />} />
          <Route path="/lot" element={<Lot />} />

          {/* tansation */}
          <Route path="/application" element={<Application />} />
          <Route
            path={editApplication ? "/application/update" : "/application/form"}
            element={<ApplicationForm />}
          />

          {/* Report */}
          <Route path="/report/appliction" element={<RejectedApplication />} />

          {/* Client and agent management */}
          <Route path="/client" element={<Client />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
