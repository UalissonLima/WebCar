import { Container } from "../../../components/container";
import { FiTrash, FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import Input from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { db, storage } from "../../../ConfigFirebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import Panel from "../../../components/panel";
import { toast, ToastContainer } from "react-toastify";

const esquema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O campo modelo é obrigatório"),
  year: z.string().min(1, "O campo ano é obrigatório"),
  km: z.string().min(1, "O campo km rodados é obrigatório"),
  price: z.string().min(1, "O campo valor é obrigatório"),
  city: z.string().min(1, "O campo cidade é obrigatório"),
  contact: z
    .string()
    .min(1, "O campo WhatsApp é obrigatório")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      message: "Numero de telefone inválido",
    }),
  description: z.string().min(1, "O campo descrição é obrigatório"),
});

type FormData = z.infer<typeof esquema>;

interface ImageProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(esquema), mode: "onChange" });

  const { user } = useContext(AuthContext);
  const [carImage, setCarImage] = useState<ImageProps[]>([]);

  function onSubmit(data: FormData) {
    if (carImage.length === 0) {
      alert("Envie alguma imagem deste carro");
      return;
    }

    const carListImage = carImage.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    addDoc(collection(db, "cars"), {
      name: data.name.toUpperCase(),
      model: data.model,
      contato: data.contact,
      cidade: data.city,
      ano: data.year,
      km: data.km,
      valor: data.price,
      descricao: data.description,
      created: new Date(),
      dono: user?.name,
      uid: user?.uid,
      images: carListImage,
    })
      .then(() => {
        reset();
        setCarImage([]);
      })
      .catch((error) => {
        alert(error.code);
      });

    mostrarToast();
  }

  function mostrarToast() {
    toast.success("Carro cadastrado com sucesso!", {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
    });
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type == "image/png")
        await handleUpload(image);
    } else {
      alert("Envie imagens .JPEG ou .PNG!");
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        setCarImage((images) => [...images, imageItem]);
      });
    });
  }

  async function handleDelete(item: ImageProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImage(carImage.filter((car) => car.url !== item.url));
    } catch {
      alert("Erro ao deletar");
    }
  }

  return (
    <Container>
      <Panel />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="black" />
          </div>
          <div>
            <input
              type="file"
              name="inpImage"
              id="inpImage"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImage.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button className="absolute" onClick={() => handleDelete(item)}>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              alt="Foto do carro"
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form action="" onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex Manual"
            />
          </div>

          <div className="flex w-full mb-3 items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="number"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2024"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Km rodados</p>
              <Input
                type="number"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 50.000"
              />
            </div>
          </div>

          <div className="flex w-full mb-3 items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone/Whatsapp</p>
              <Input
                type="number"
                register={register}
                name="contact"
                error={errors.contact?.message}
                placeholder="Ex: 00 9696-9696"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: São Paulo"
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Valor</p>
            <Input
              type="number"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: R$ 100.000"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="rounded-md bg-zinc-900 text-white font-medium w-full h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
}
