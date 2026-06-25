import { useState, type FormEvent } from "react";

import { Navigate, useNavigate } from "react-router";

import { isAxiosError } from "axios";

import PageMeta from "../components/common/PageMeta";

import AuthLayout from "./AuthPages/AuthPageLayout";

import Label from "../components/form/Label";

import Input from "../components/form/input/InputField";

import Button from "../components/ui/button/Button";

import { EyeCloseIcon, EyeIcon } from "../icons";

import { useAuth } from "../context/AuthContext";



export default function Login() {

  const navigate = useNavigate();

  const { login, isAuthenticated, isInitializing } = useAuth();



  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);



  if (!isInitializing && isAuthenticated) {

    return <Navigate to="/dashboard" replace />;

  }



  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    setError("");

    setIsSubmitting(true);



    try {

      await login(username, password);

      navigate("/dashboard", { replace: true });

    } catch (err) {

      if (isAxiosError(err) && err.response?.status === 401) {

        setError("Invalid username or password");

      } else {

        setError("An error occurred during login. Please try again.");

      }

    } finally {

      setIsSubmitting(false);

    }

  };



  return (

    <>

      <PageMeta

        title="Sign In | Car Rental Admin"

        description="Sign in to the car rental admin dashboard"

      />

      <AuthLayout>

        <div className="flex flex-col flex-1 w-full lg:w-1/2">

          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 py-10">

            <div className="mb-8">

              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">

                Sign In

              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">

                Enter your username and password to access the dashboard

              </p>

            </div>



            <form onSubmit={handleSubmit}>

              <div className="space-y-6">

                {error && (

                  <div className="p-3 text-sm text-error-500 bg-error-50 border border-error-200 rounded-lg dark:bg-error-500/10 dark:border-error-500/30">

                    {error}

                  </div>

                )}



                <div>

                  <Label>

                    Username <span className="text-error-500">*</span>

                  </Label>

                  <Input

                    type="text"

                    placeholder="Username"

                    value={username}

                    onChange={(e) => setUsername(e.target.value)}

                    disabled={isSubmitting}

                    error={!!error}

                  />

                </div>



                <div>

                  <Label>

                    Password <span className="text-error-500">*</span>

                  </Label>

                  <div className="relative">

                    <Input

                      type={showPassword ? "text" : "password"}

                      placeholder="Enter your password"

                      value={password}

                      onChange={(e) => setPassword(e.target.value)}

                      disabled={isSubmitting}

                      error={!!error}

                    />

                    <button

                      type="button"

                      onClick={() => setShowPassword(!showPassword)}

                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"

                    >

                      {showPassword ? (

                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />

                      ) : (

                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />

                      )}

                    </button>

                  </div>

                </div>



                <Button

                  type="submit"

                  className="w-full"

                  size="sm"

                  disabled={isSubmitting || !username || !password}

                >

                  {isSubmitting ? "Signing in..." : "Sign In"}

                </Button>

              </div>

            </form>

          </div>

        </div>

      </AuthLayout>

    </>

  );

}


