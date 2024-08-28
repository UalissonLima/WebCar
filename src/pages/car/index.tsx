import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../ConfigFirebase";
import { doc, getDoc } from "firebase/firestore";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  whatsapp: string;
  price: number;
  owner: string;
  uid: string;
  images: ImagesCarProps[];
}

interface ImagesCarProps {
  name: string;
  uid: string;
  url: string;
}

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps | null>(null);
  const [sliderPerView, setSlidePerView] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/", { replace: true });
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.ano,
          city: snapshot.data()?.cidade,
          model: snapshot.data()?.model,
          uid: snapshot.data()?.uid,
          description: snapshot.data()?.descricao,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.contato,
          price: snapshot.data()?.valor,
          km: snapshot.data()?.km,
          owner: snapshot.data()?.dono,
          images: snapshot.data()?.images,
        });
      });
    }
    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSlidePerView(1);
      } else {
        setSlidePerView(2);
      }
    }
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                className="w-full h-96 object-cover"
                alt="#"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between ">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(car?.price)}
            </h1>
          </div>
          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-clo gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição</strong>
          <p className="my-4">{car?.description}</p>

          <strong>Telefone/Whatsapp</strong>
          <a
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}`}
            target="_blank"
            className="bg-green-500 w-full flex items-center justify-center gap-2 my-6 h-11 text-xl cursor-pointer text-white rounded-lg font-bold"
          >
            Conversar com vendedor <FaWhatsapp size={26} color="white" />
          </a>
        </main>
      )}
    </Container>
  );
}
