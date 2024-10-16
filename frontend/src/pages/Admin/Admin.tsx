import { useEffect, useLayoutEffect, useState } from "react";
import "./Admin.css";
import NewsSection from "./Noticias";
import PhotosSection from "./Fotos";
import ServicesSection from "./Servicios";
import HorasSection from "./Horas";

type Servicio = {
  img: string;
  titulo: string;
  descripcion: string;
  precio: number;
};
type Servicios = {
  [key: string]: Servicio[];
};
const servicios: Servicios = {
  Masajes: [
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Antiestres",
      descripcion: "Antiestres asdasdasd",
      precio: 5000,
    },
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Descontracturantes",
      descripcion: " Descontracturantes asdasdas",
      precio: 6000,
    },
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Con piedras calientes",
      descripcion: "Con piedras calientes  asdasd",
      precio: 7000,
    },
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Circulatorios",
      descripcion: "",
      precio: 5500,
    },
  ],
  Belleza: [
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Corte de cabello",
      descripcion: "Corte de cabello asda s",
      precio: 2000,
    },
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Manicura",
      descripcion: "Manicura asda sdas asd",
      precio: 1500,
    },
  ],
  Faciales: [
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Limpieza facial",
      descripcion: "Limpieza facial asd as da",
      precio: 3000,
    },
    {
      img: "/assets/masaje-antiestres.jpg",
      titulo: "Tratamiento antiarrugas",
      descripcion: "Tratamiento antiarrugas asda ",
      precio: 4500,
    },
  ],
};
const horasArray: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];
type Media = {
  img: string;
  titulo?: string;
  texto?: string;
};
const newsArray: Media[] = [
  {
    img: "../assets/noticia1.jpeg",
    titulo: "Titulo noticia 1",
    texto: "Prueba noticia 1",
  },
  {
    img: "../assets/noticia1.jpeg",
    titulo: "Titulo noticia 2",
    texto:
      "Prueba noticia 2 Prueba noticia 2 Prueba noticia 2 Prueba noticia 2 Prueba noticia 2",
  },
  {
    img: "../assets/noticia1.jpeg",
    titulo: "Titulo noticia 2",
    texto:
      "Prueba noticia 2 Prueba noticia 2 Prueba noticia 2 Prueba noticia 2 Prueba noticia 2",
  },
];
const photosArray: Media[] = [
  {
    img: "../assets/masaje-antiestres.jpg",
  },
  {
    img: "../assets/temp.png",
  },
  {
    img: "../assets/Dermohealth.jpg",
  },
  {
    img: "../assets/masaje-antiestres.jpg",
  },
  {
    img: "../assets/temp.png",
  },
  {
    img: "../assets/Dermohealth.jpg",
  },
];

export default function Admin() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [news, setNews] = useState<Array<Media>>([]);
  const [photos, setPhotos] = useState<Array<Media>>([]);
  const [services, setServices] = useState<Servicios>({});
  const [horas, setHoras] = useState<string[]>([]);

  // Cargar comentarios simulados al montar el componente
  useEffect(() => {
    setNews(newsArray);
    setPhotos(photosArray);
    setServices(servicios);
    setHoras(horasArray);
  }, []);

  const AdminType = 2;
  const AdminName = "JuanPablos";
  const AdminRole = "Profesional";

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="titulo">
          <h1>ADMINISTRADOR</h1>
        </div>
        {AdminType === 1 ? (
          <div className="admin-types">
            <NewsSection news={news} setNews={setNews} />
            <PhotosSection photos={photos} setPhotos={setPhotos} />
            <ServicesSection services={services} setServices={setServices} />
            <HorasSection horas={horas} setHoras={setHoras} />
          </div>
        ) : (
          <div className="sinPermisos">
            <h2>
              Bienvenido {AdminRole} {AdminName}
            </h2>
            <img src="/assets/login.png" alt="Hola!" />
          </div>
        )}
      </div>
    </div>
  );
}
