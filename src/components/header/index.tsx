import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function Header() {
  const { signed, loadingAuth, user } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to="/">
          <img src={logoImg} alt="Logo do site" className="cursor-pointer" />
        </Link>

        {!loadingAuth && signed && (
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="flex justify-center items-center gap-2 hover:underline"
            >
              <p>{user?.name}</p>
              <div className="border-2 rounded-full p-1 border-gray-900">
                <FiUser size={22} color="#000" />
              </div>
            </Link>
            <Link
              to="/login"
              className="flex justify-center items-center gap-2 hover:underline"
            >
              <div className="rounded-full p-1 border-gray-900">
                <FiLogIn size={22} color="#000" />
              </div>
              <p>Sair</p>
            </Link>
          </div>
        )}

        {!loadingAuth && !signed && (
          <Link
            to="/login"
            className="flex justify-center items-center gap-2 hover:underline"
          >
            <p>Login</p>
            <div className="rounded-full p-1 border-gray-900">
              <FiLogIn size={22} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
