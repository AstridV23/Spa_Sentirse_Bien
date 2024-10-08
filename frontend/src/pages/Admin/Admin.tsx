import { useEffect, useLayoutEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import "./Admin.css";
import NewsSection from "./Noticias";
import PhotosSection from "./Fotos";
import ServicesSection from "./Servicios";

type Servicio = {
  nombre: string;
  precio: number;
};

type Servicios = {
  [key: string]: Servicio[];
};

const servicios: Servicios = {
  Masajes: [
    { nombre: "Antiestres", precio: 5000 },
    { nombre: "Descontracturantes", precio: 6000 },
    { nombre: "Con piedras calientes", precio: 7000 },
    { nombre: "Circulatorios", precio: 5500 },
  ],
  Belleza: [
    { nombre: "Corte de cabello", precio: 2000 },
    { nombre: "Manicura", precio: 1500 },
  ],
  Faciales: [
    { nombre: "Limpieza facial", precio: 3000 },
    { nombre: "Tratamiento antiarrugas", precio: 4500 },
  ],
};
const horas: string[] = [
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
];

export default function Admin() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [news, setNews] = useState<Array<Media>>([]);
  const [photos, setPhotos] = useState<Array<Media>>([]);

  const [precio, setPrecio] = useState<number>(0);
  const [services, setServices] = useState<Servicios>(servicios);

  // Cargar comentarios simulados al montar el componente
  useEffect(() => {
    setNews(newsArray);
    setPhotos(photosArray);
    setServices(servicios);
  }, []);

  const [Data, setData] = useState({
    tipoTratamiento: "",
    servicio: "",
  });

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
          <ServicesSection
            services={services}
            setServices={setServices}
            precio={precio}
            setPrecio={setPrecio}
            Data={Data}
            setData={setData}
          />

          <div className="hours-section">
            <h3>Horarios</h3>
            <div className="buttons">
              <div className="par">
                <Dropdown label="Horarios" options={horas} />
                <input
                  type="text"
                  className="textbox"
                  placeholder="Agregar hora"
                />
              </div>
              <div className="par">
                <input type="submit" className="MainButton" value="Guardar" />
                <input type="submit" className="SecondButton" value="Borrar" />
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
}
