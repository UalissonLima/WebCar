import { FiTrash } from "react-icons/fi";
import { Container } from "../../components/container";
import { Panel } from "../../components/panel";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../ConfigFirebase";
import { AuthContext } from "../../context/AuthContext";
import { deleteObject, ref } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";

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

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCars() {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));
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

    loadCars();
  }, [user, cars]);

  function handleImgLoad(id: string) {
    setLoadImages((prevImage) => [...prevImage, id]);
  }

  async function handleDelete(item: CarsProps) {
    const deleteCar = doc(db, "cars", item.id);
    await deleteDoc(deleteCar);

    item.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== item.id));
      } catch {
        alert("Erro ao deletar");
      }
    });
    mostrarToast();
  }

  function mostrarToast() {
    toast.success("Sucesso ao deletar!", {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
    });
  }

  return (
    <Container>
      <Panel />

      {cars.length > 0 ? (
        <>
          <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-4">
            {cars.map((carro) => (
              <section
                className="w-full bg-white rounded-lg relative"
                key={carro.id}
              >
                <button
                  className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
                  onClick={() => handleDelete(carro)}
                >
                  <FiTrash size={26} color="black" />
                </button>

                <div
                  className="w-full h-72 rounded-lg bg-slate-200"
                  style={{
                    display: loadImages.includes(carro.id) ? "none" : "block",
                  }}
                ></div>
                <img
                  className="w-full rounded-lg mb-2 max-h-72 h"
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
            ))}
          </main>
        </>
      ) : (
        <div className="w-full max-w-xs mt-6 text-center m-auto">
          <strong>
            Você não possui carros cadastrados a venda, para cadastrar clique em
            "Cadastrar carro"!
          </strong>
        </div>
      )}
      <ToastContainer />
    </Container>
  );
}
