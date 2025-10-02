import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AgentsApp from "./pages/RoleLayout/AgentApp";
import EmployeApp from "./pages/RoleLayout/EmployeApp";
import { userUser } from "./context/UserContext";
import { useEffect } from "react";
import { fetchLands } from "./store/slices/landSlice";
import { fetchLots } from "./store/slices/lotSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { getClients } from "./store/slices/clientSlice";
import { Role } from "./context/mockData";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { curUser, isUserLogged } = userUser();

  useEffect(() => {
    const initialFetch = async () => {
      try {
        await dispatch(fetchLots({}));
        await dispatch(fetchLands());
        await dispatch(getClients());
      } catch (error) {
        console.log(error);
      }
    };

    initialFetch();
  }, []);
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          !isUserLogged ? (
            <Navigate to={"/signin"} />
          ) : curUser?.role === Role.Agent ? (
            <AgentsApp />
          ) : (
            <EmployeApp />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
