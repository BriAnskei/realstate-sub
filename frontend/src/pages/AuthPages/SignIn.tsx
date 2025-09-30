import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { userUser } from "../../context/UserContext";
import { Navigate } from "react-router";

export default function SignIn() {
  const { isUserLogged } = userUser();

  return (
    <>
      {isUserLogged ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <PageMeta
            title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
            description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
          />
          <AuthLayout>
            <SignInForm />
          </AuthLayout>
        </>
      )}
    </>
  );
}
