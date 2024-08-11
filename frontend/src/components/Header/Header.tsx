import Link from "next/link";
import { Home, NotepadTextDashed, UserRoundSearch } from "lucide-react";
import { cookies } from "next/headers";
import LogoutButton from "./_components/LogoutButton";

const Header = () => {
  const token = cookies().get("token")?.value;
  const isLogged = !!token;
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

          <LogoutButton hideElementOnLogout={hideElementOnLogout} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
