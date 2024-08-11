"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import FormButton from "@/components/FormButton";
import { AlertCard } from "@/components/AlertCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { register } from "@/lib/redux/slices/authSlice";

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const [registerInputs, setRegisterInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    generalError: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const setRegisterInputsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setErrors({
      name: "",
      email: "",
      password: "",
      generalError: "",
    });

    if (registerInputs.name === "") {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (registerInputs.email === "") {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (registerInputs.password === "") {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (passwordConfirm === "") {
      setErrors((prev) => ({
        ...prev,
        generalError: "Please confirm password",
      }));
      return;
    }

    if (registerInputs.password !== passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        generalError: "Passwords do not match",
      }));
      return;
    }

    dispatch(register(registerInputs)).then((res) => {
      if (res.type === "auth/register/fulfilled") {
        toast.success("Registration successful");
        router.push("/auth/login");
        setRegisterInputs({
          name: "",
          email: "",
          password: "",
        });
      } else if (res.type === "auth/register/rejected") {
        const err = res.payload.message;
        if (typeof err === "string") {
          setErrors((prev) => ({ ...prev, generalError: err }));
        } else {
          err.forEach((item: string) => {
            if (item.includes("name")) {
              setErrors((prev) => ({ ...prev, name: item }));
            } else if (item.includes("email")) {
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
            htmlFor="username"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            onChange={setRegisterInputsHandler}
            value={registerInputs.name}
          />
          {errors.name && (
            <AlertCard
              title="Error"
              message={errors.name}
              variant="destructive"
              className="mt-3"
            />
          )}
        </div>
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
            onChange={setRegisterInputsHandler}
            value={registerInputs.email}
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
            onChange={setRegisterInputsHandler}
            value={registerInputs.password}
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
        <div className="w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="passwordConfirmation"
          >
            Password Confirmation
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            placeholder="Password Confirmation"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <FormButton
          BtnName="Register"
          onClick={handleRegister}
          pending={auth?.status === "loading"}
        />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
      {errors?.generalError && (
        <AlertCard
          title="Error"
          message={errors?.generalError}
          className="mt-5"
          variant="destructive"
        />
      )}
    </form>
  );
};

export default RegisterForm;
