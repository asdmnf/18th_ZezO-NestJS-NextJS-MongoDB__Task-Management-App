"use client";

import FormButton from "@/components/FormButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertCard } from "@/components/AlertCard";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/lib/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import loginValidationSchema from "../_validation/loginValidationSchema";

const LoginForm = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const [loginInputs, setLoginInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    generalError: "",
  });

  const setLoginInputsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setErrors({
      email: "",
      password: "",
      generalError: "",
    });

    const validation = loginValidationSchema.safeParse(loginInputs);
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
      });
      return;
    }
    const loginDto = validation.data;

    dispatch(login(loginDto)).then((res) => {
      if (res.type === "auth/login/fulfilled") {
        toast.success("Login successful");
        router.push("/dashboard");
        router.refresh();
        setLoginInputs({ email: "", password: "" });
      } else if (res.type === "auth/login/rejected") {
        const err = res.payload.message;
        if (typeof err === "string") {
          setErrors((prev) => ({ ...prev, generalError: err }));
        } else {
          err.forEach((item: string) => {
            if (item.includes("email")) {
              setErrors((prev) => ({ ...prev, email: item }));
            } else if (item.includes("password")) {
              setErrors((prev) => ({ ...prev, password: item }));
            }
          });
        }
      }
    });
  };

  return (
    <form className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4">
      <div className="space-y-4">
        <div className="w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={setLoginInputsHandler}
            value={loginInputs.email}
          />
          {errors.email && (
            <AlertCard
              title="Error"
              message={errors.email}
              variant="destructive"
              className="mt-3"
            />
          )}
        </div>
        <div className="w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={setLoginInputsHandler}
            value={loginInputs.password}
          />
          {errors.password && (
            <AlertCard
              title="Error"
              message={errors.password}
              variant="destructive"
              className="mt-3"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <FormButton
          BtnName="Login"
          onClick={handleLogin}
          pending={auth?.status === "loading"}
        />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-500 hover:underline">
          Create Account
        </Link>
      </p>
      {errors.generalError && (
        <AlertCard
          title="Error"
          message={errors.generalError}
          variant="destructive"
          className="mt-5"
        />
      )}
    </form>
  );
};

export default LoginForm;
