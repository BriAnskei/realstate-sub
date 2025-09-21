import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useEffect } from "react";
import { fetchLands } from "./store/slices/landSlice";
import EmployeApp from "./pages/RoleLayout/EmployeApp";
import AgentsApp from "./pages/RoleLayout/AgentApp";

export default function App() {
  return (
    <>
      <EmployeApp />
    </>
  );
}
