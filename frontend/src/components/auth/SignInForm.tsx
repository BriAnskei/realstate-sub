import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { userUser } from "../../context/UserContext";
import { createChangeHandler } from "../../utils/createChangeHandler";

export default function SignInForm() {
  const { login } = userUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [role, setRole] = useState("employee");
  const [input, setInput] = useState({
    userName: "",
    password: "",
  });
  // Error states
  const [errors, setErrors] = useState({
    role: "",
    userName: "",
    password: "",
  });

  const roleOptions = [
    { value: "employee", label: "Employee" },
    { value: "agent", label: "Agent" },
  ];

  useEffect(() => {
    setErrors({ role: "", userName: "", password: "" });
  }, [input, role]);

  useEffect(() => {
    console.log("error: ", errors);
  }, [errors]);

  const onChangeHanlder = createChangeHandler(setInput);

  const handleRoleChange = (value: string) => {
    setRole(value);
    // Clear role error when user selects a role
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "please select a role" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !input.userName || !input.password) {
      if (!role) {
        setErrors((prev) => ({ ...prev, role: "Role selection is required." }));
      } else if (!input.userName) {
        setErrors((prev) => ({
          ...prev,
          userName: "User name  is required.",
        }));
      } else if (!input.password) {
        setErrors((prev) => ({
          ...prev,
          password: "Password is required.",
        }));
      }
      return;
    }

    const response = login({ ...input, role });

    if (!response.success) {
      if (response.type === "password") {
        setErrors((prev) => ({ ...prev, password: response.message! }));
      } else {
        setErrors((prev) => ({ ...prev, userName: response.message! }));
      }
    } else {
      console.log("pass");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <Label>
                    Role <span className="text-error-500">*</span>
                  </Label>
                  <Select
                    options={roleOptions}
                    placeholder="Select Role"
                    onChange={handleRoleChange}
                    className={`dark:bg-dark-900 ${
                      errors.role ? "border-red-500 dark:border-red-500" : ""
                    }`}
                    defaultValue="employee"
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    className={
                      errors.userName
                        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                    name="userName"
                    onChange={onChangeHanlder}
                  />
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.userName}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={
                        errors.password
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }
                      onChange={onChangeHanlder}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <div className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    Forgot password?
                  </div>
                </div>

                {/* Sign In Button */}
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
