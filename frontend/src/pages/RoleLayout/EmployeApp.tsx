import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import AppLayout from "../../layout/AppLayout";
import Client from "../Client";
import Home from "../Dashboard/Home";
import LandForm from "../Forms/LandForm";
import Land from "../projects/Land";
import Lot from "../projects/Lot";

import Application from "../transaction/Application";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchAllAPP } from "../../store/slices/applicationSlice";
import Reservation from "../transaction/Reservation";
import { fetchAllReservaton } from "../../store/slices/reservationSlice";
import Contract from "../transaction/Contract";
import { fetchAllContracts } from "../../store/slices/contractSlice";
import { userUser } from "../../context/UserContext";
import { Role } from "../../context/mockData";

export default function EmployeApp() {
  const dispatch = useDispatch<AppDispatch>();

  const { curUser } = userUser();

  useEffect(() => {
    async function fetchEmployeeStates() {
      try {
        if (curUser?.role === Role.Employee) {
          await dispatch(fetchAllAPP());
          await dispatch(fetchAllReservaton());
          await dispatch(fetchAllContracts());
        }
      } catch (error) {
        console.log("Error in fetchEmployeeStates", error);
      }
    }
    fetchEmployeeStates();
  }, [curUser]);

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
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/contract" element={<Contract />} />

          {/* Client and agent management */}
          <Route path="/client" element={<Client />} />
        </Route>
      </Routes>
    </>
  );
}
