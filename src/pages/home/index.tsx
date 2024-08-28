import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../ConfigFirebase";
import { Link } from "react-router-dom";

interface CarsProps {
  id: string;
  name: string;
  ano: string;
  uid: string;
  valor: number;
  cidade: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));
    getDocs(queryRef).then((snapshot) => {
      const listCars = [] as CarsProps[];

      snapshot.forEach((doc) => {
        listCars.push({
          id: doc.id,
          name: doc.data().name,
          ano: doc.data().ano,
          uid: doc.data().uid,
          valor: doc.data().valor,
          cidade: doc.data().cidade,
          km: doc.data().km,
          images: doc.data().images,
        });
      });

      setCars(listCars);
    });
  }

  function handleImgLoad(id: string) {
    setLoadImages((prevImage) => [...prevImage, id]);
  }

  async function handleSearchCar() {
    if (input === "") {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);
    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        ano: doc.data().ano,
        uid: doc.data().uid,
        valor: doc.data().valor,
        cidade: doc.data().cidade,
        km: doc.data().km,
        images: doc.data().images,
      });
    });
    setCars(listCars);
    setInput('')
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((carro) => (
          <Link to={`/car/${carro.id}`}>
            <section className="w-full bg-white rounded-lg" key={carro.id}>
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(carro.id) ? "none" : "block",
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={carro.images[0].url}
                alt="Carro"
                onLoad={() => handleImgLoad(carro.id)}
                style={{
                  display: loadImages.includes(carro.id) ? "block" : "none",
                }}
              />
              <p className="font-bold mt-1 mb-2 px-2">{carro.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">
                  Ano {carro.ano} | {carro.km} km
                </span>
                <strong className="text-black font-medium text-xl">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(carro.valor)}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-black">{carro.cidade}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
