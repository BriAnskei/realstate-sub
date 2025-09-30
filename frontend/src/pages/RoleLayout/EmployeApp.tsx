import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import AppLayout from "../../layout/AppLayout";
import Agents from "../Agents";
import Blank from "../Blank";
import Calendar from "../Calendar";
import BarChart from "../Charts/BarChart";
import LineChart from "../Charts/LineChart";
import Client from "../Client";
import Home from "../Dashboard/Home";
import FormElements from "../Forms/FormElements";
import LandForm from "../Forms/LandForm";
import Land from "../projects/Land";
import Lot from "../projects/Lot";
import BasicTables from "../Tables/BasicTables";

import Alerts from "../UiElements/Alerts";
import Avatars from "../UiElements/Avatars";
import Badges from "../UiElements/Badges";
import Buttons from "../UiElements/Buttons";
import Images from "../UiElements/Images";
import Videos from "../UiElements/Videos";
import Application from "../transaction/Application";

export default function EmployeApp() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />

          {/* {Projects} */}
          <Route path="/land/add" element={<LandForm />} />
          <Route path="/land" element={<Land />} />
          <Route path="/lot" element={<Lot />} />

          {/* tansation */}
          <Route path="/application" element={<Application />} />

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
      </Routes>
    </>
  );
}
