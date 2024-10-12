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
/*
type Turno = {
  usuario: string;
  servicio: string;
  tipo: string;
  hora: string;
};
const turnos: Turno[] = [
  {
    usuario: "JuanPerez",
    servicio: "Antiestres",
    tipo: "Masaje",
    hora: "13:00",
  },
  {
    usuario: "TomasMassa",
    servicio: "Descontracturante",
    tipo: "Masaje",
    hora: "13:00",
  },
  {
    usuario: "LuisAlCuadrado",
    servicio: "Circulatorios",
    tipo: "Masaje",
    hora: "13:00",
  },
  {
    usuario: "PaulaLondra",
    servicio: "Lifting de pestaña",
    tipo: "Belleza",
    hora: "13:00",
  },
  {
    usuario: "LucasGerbert",
    servicio: "Limpieza Profunda + Hidratación",
    tipo: "Tratamientos Faciales",
    hora: "13:00",
  },
  {
    usuario: "PabloDias",
    servicio: "DermoHealth",
    tipo: "Tratamientos Corporales",
    hora: "13:00",
  },
];*/

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

  return (
    <div className="admin-page">
      <div className="background-image" />
      <div className="admin-container">
        <div className="titulo">
          <h1>ADMINISTRADOR</h1>
          <hr />
        </div>
        <div className="admin-types">
          <NewsSection news={news} setNews={setNews} />
          <PhotosSection photos={photos} setPhotos={setPhotos} />
          <ServicesSection services={services} setServices={setServices} />
          <HorasSection horas={horas} setHoras={setHoras} />

          {/*
          <div className="turns-section">
            <h3>Turnos</h3>
            <div className="buttons">
              <div className="par">
                <input type="date" />
                <Dropdown
                  label="Tipo"
                  options={
                    servicios[Data.tipoTratamiento]?.map(
                      (servicio) => servicio.nombre
                    ) || []
                  } // Muestra los servicios del tipo de tratamiento seleccionado
                />
              </div>
            </div>
            <div className="Turnos-container">
              {turnos.map((turn, index) => (
                <div className="turno" key={index}>
                  <h4>{turn.servicio}</h4>
                  <p>{turn.tipo}</p>
                  <p>{turn.hora}</p>
                  <strong>{turn.usuario}</strong>
                  <input
                    type="submit"
                    className="SecondButton"
                    value="Eliminar"
                  />
                </div>
              ))}
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
