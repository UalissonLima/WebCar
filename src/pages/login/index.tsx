import { Container } from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../ConfigFirebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const schema = z.object({
  email: z
    .string()
    .min(1, "O campo email é obrigatório")
    .email("Email inválido"),

  password: z.string().min(1, "O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  function onSubmit(data: FormData) {
    console.log(data);
    handleLogin(data.email, data.password);
  }

  async function handleLogin(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        navigate("/dashboard", { replace: true });
        console.log(user);
      })
      .catch((error) => {
        alert(error.code);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo Web Carros" className="w-full" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Acessar
          </button>
        </form>

        <Link to="/register">
          <span className="w-full hover:underline cursor-pointer">
            Não possui conta? Cadastra-se
          </span>
        </Link>
      </div>
    </Container>
  );
}
