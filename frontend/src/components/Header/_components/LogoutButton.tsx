"use client";

import { logout } from "@/lib/redux/slices/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const LogoutButton = ({
  hideElementOnLogout,
}: {
  hideElementOnLogout: string;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <button
      className={`px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-white border-0 cursor-pointer ${hideElementOnLogout}`}
      onClick={() => {
        dispatch(logout());
        router.replace("/");
        router.refresh();
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
