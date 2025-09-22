import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import AppLayout from "../../layout/AppLayout";
import { fetchLands } from "../../store/slices/landSlice";
import { AppDispatch } from "../../store/store";
import Agents from "../Agents";
import Blank from "../Blank";
import Calendar from "../Calendar";
import BarChart from "../Charts/BarChart";
import LineChart from "../Charts/LineChart";
import Client from "../Client";
import Home from "../Dashboard/Home";
import FormElements from "../Forms/FormElements";
import LandForm from "../Forms/LandForm";
import SaleForm from "../Forms/SaleForm";
import Land from "../projects/Land";
import Lot from "../projects/Lot";
import BasicTables from "../Tables/BasicTables";
import Sale from "../transaction/Sale";
import Alerts from "../UiElements/Alerts";
import Avatars from "../UiElements/Avatars";
import Badges from "../UiElements/Badges";
import Buttons from "../UiElements/Buttons";
import Images from "../UiElements/Images";
import Videos from "../UiElements/Videos";
import { fetchLots } from "../../store/slices/lotSlice";

export default function EmployeApp() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const initialFetch = async () => {
      try {
        await dispatch(fetchLands());
        await dispatch(fetchLots({}));
      } catch (error) {
        console.log(error);
      }
    };

    initialFetch();
  }, []);

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
          <Route path="/saleform" element={<SaleForm />} />
          <Route path="/sale" element={<Sale />} />

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
