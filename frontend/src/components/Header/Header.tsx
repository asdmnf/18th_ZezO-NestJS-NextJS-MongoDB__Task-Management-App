"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Home, NotepadTextDashed, UserRoundSearch } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/redux/slices/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // FIXME: try to set ssr to false
  // i always set token to cookies from server (no need to deal with token from frontend at all) as http only and another not http only cookie 'isLogged' to check if user is logged in and this method work correctly with react but not with nextjs
  // i got error related to server and client mismatch so i need to set ssr to false as a solution
  // i did this dumb way because i didn't want to deal with server again, but still dumb solution
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLogged(!!token);
  }, []);

  const hideElementOnLogout = !isLogged ? "hidden" : "";
  const hideElementOnLogin = isLogged ? "hidden" : "";

  return (
    <header className="h-[60px] bg-gray-700 text-white py-4 flex justify-center items-center">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="space-x-4 flex">
          <Link href="/" className="text-white hover:text-gray-400">
            <Home />
          </Link>
          <Link
            href="/dashboard"
            className={`text-white hover:text-gray-400 ${hideElementOnLogout}`}
          >
            <NotepadTextDashed />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/register"
            className={`px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 hover:text-white ${hideElementOnLogin}`}
          >
            Register
          </Link>
          <Link
            href="/auth/login"
            className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 hover:text-white ${hideElementOnLogin}`}
          >
            Login
          </Link>

          <Link
            href="/linkedin-profile"
            className={`flex items-center space-x-2 ${hideElementOnLogout}`}
          >
            <UserRoundSearch />
          </Link>

          <form action="">
            <button
              className={`px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-white border-0 cursor-pointer ${hideElementOnLogout}`}
              onClick={() => {
                dispatch(logout());
                // FIXME: navigation not working
                router.replace("/");
              }}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
