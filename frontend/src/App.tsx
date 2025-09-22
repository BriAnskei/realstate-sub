import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AgentsApp from "./pages/RoleLayout/AgentApp";
import EmployeApp from "./pages/RoleLayout/EmployeApp";
import { Role, userUser } from "./context/UserContext";
import { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { curUser } = userUser();

  if (Object.keys.length === 0) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default function App() {
  const { curUser } = userUser();

  return (
    <Routes>
      <Route
        path="*"
        element={
          <ProtectedRoute>
            {curUser?.role === Role.Agent ? <AgentsApp /> : <EmployeApp />}
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
