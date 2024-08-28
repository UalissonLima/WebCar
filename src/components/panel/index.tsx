import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../ConfigFirebase";

async function handleLogout() {
  await signOut(auth);
}

export function Panel() {
  return (
    <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium px-4 gap-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/new">Cadastrar carro</Link>

      <button onClick={handleLogout} className="ml-auto">Sair da conta</button>
    </div>
  );
}

export default Panel;
