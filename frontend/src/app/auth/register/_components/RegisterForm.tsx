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
import registerValidationSchema from "../_validation/registerValidationSchema";

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const [registerInputs, setRegisterInputs] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    linkedin_url: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    linkedin_url: "",
    generalError: "",
  });

  const setRegisterInputsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setErrors({
      name: "",
      email: "",
      password: "",
      password_confirm: "",
      linkedin_url: "",
      generalError: "",
    });

    const validationResult = registerValidationSchema.safeParse(registerInputs);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
      });
      return;
    }
    const registerDto = {
      ...validationResult.data,
      password_confirm: undefined,
    };

    if (registerInputs.password !== registerInputs.password_confirm) {
      setErrors((prev) => ({
        ...prev,
        generalError: "Passwords do not match",
      }));
      return;
    }

    dispatch(register(registerDto)).then((res) => {
      if (res.type === "auth/register/fulfilled") {
        toast.success("Registration successful");
        router.push("/auth/login");
        setRegisterInputs({
          name: "",
          email: "",
          password: "",
          password_confirm: "",
          linkedin_url: "",
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
            } else if (item.includes("password_confirm")) {
              setErrors((prev) => ({ ...prev, password_confirm: item }));
            } else if (item.includes("linkedin_url")) {
              setErrors((prev) => ({ ...prev, linkedin_url: item }));
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
            htmlFor="password_confirm"
          >
            Password Confirmation
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password_confirm"
            name="password_confirm"
            type="password"
            placeholder="Password Confirmation"
            onChange={setRegisterInputsHandler}
            value={registerInputs.password_confirm}
          />
          {errors.password_confirm && (
            <AlertCard
              title="Error"
              message={errors.password_confirm}
              variant="destructive"
              className="mt-3"
            />
          )}
        </div>
        <div className="w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="linkedin_url"
          >
            Linkedin URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="linkedin_url"
            name="linkedin_url"
            type="text"
            placeholder="Linkedin URL"
            onChange={setRegisterInputsHandler}
            value={registerInputs.linkedin_url}
          />
          {errors.linkedin_url && (
            <AlertCard
              title="Error"
              message={errors.linkedin_url}
              variant="destructive"
              className="mt-3"
            />
          )}
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
