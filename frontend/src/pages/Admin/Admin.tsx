import { useEffect, useLayoutEffect, useState } from "react";
import "./Admin.css";
import NewsSection from "./Noticias";
import PhotosSection from "./Fotos";
import ServicesSection from "./Servicios";
import HorasSection from "./Horas";
import Comments from "../../components/comments";
import { useAuth } from "../../context/AuthContext";

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

  const { user } = useAuth();
  const [news, setNews] = useState<Array<Media>>([]);
  const [photos, setPhotos] = useState<Array<Media>>([]);
  const [horas, setHoras] = useState<string[]>([]);
  const [desplegableNoticias, setDesplegableNoticias] =
    useState<boolean>(false);
  const [desplegableFotos, setDesplegableFotos] = useState<boolean>(false);
  const [desplegableServicios, setDesplegableServicios] =
    useState<boolean>(false);
  const [desplegableHorarios, setDesplegableHorarios] =
    useState<boolean>(false);
  const [desplegableComentarios, setDesplegableComentarios] =
    useState<boolean>(false);

  // Cargar comentarios simulados al montar el componente
  useEffect(() => {
    setNews(newsArray);
    setPhotos(photosArray);
    setHoras(horasArray);
  }, []);

  const AdminName: string = user?.lastname || "Usuario";
  const AdminRole: string = user?.role || "invitado";
  const AdminSex: string = user?.sex || "otro";

  const getRoleText = (role: string): string => {
    switch (role) {
      case "admin":
        return "ADMINISTRADOR";
      case "secretario":
        return "SECRETARIO";
      case "profesional":
        return "PROFESIONAL";
      default:
        return "INVITADO";
    }
  };

  return (
    <div className="admin-page">
      <div className="background" />
      <div className="admin-container">
        <div className="titulo">
          <h1>{getRoleText(AdminRole)}</h1>
        </div>
        <div className="sinPermisos">
          <h2 style={{ color: "var(--gris)" }}>
            {AdminSex === "mujer" ? "Bienvenida" : "Bienvenido"}{" "}
            {AdminRole === "admin"
              ? AdminSex === "mujer"
                ? "Doctora"
                : "Doctor"
              : AdminRole}{" "}
            {AdminName}
          </h2>
          <img src="/assets/login.png" alt="Hola!" />
        </div>
        {AdminRole === "admin" && (
          <div className="admin-types">
            <div className="Desplegable">
              <button
                className="DesplButton"
                onClick={() => setDesplegableNoticias(!desplegableNoticias)}
              >
                <img
                  className="img"
                  src="/assets/down-arrow.png"
                  alt="Desplegar Noticias"
                />
                <h3>Noticias</h3>
              </button>

              {desplegableNoticias && (
                <NewsSection news={news} setNews={setNews} />
              )}
              <hr />
            </div>
            <div className="Desplegable">
              <button
                className="DesplButton"
                onClick={() => setDesplegableFotos(!desplegableFotos)}
              >
                <img
                  className="img"
                  src="/assets/down-arrow.png"
                  alt="Desplegar Fotos"
                />
                <h3>Fotos</h3>
              </button>
              {desplegableFotos && (
                <PhotosSection photos={photos} setPhotos={setPhotos} />
              )}
              <hr />
            </div>
            <div className="Desplegable">
              <button
                className="DesplButton"
                onClick={() => setDesplegableServicios(!desplegableServicios)}
              >
                <img
                  className="img"
                  src="/assets/down-arrow.png"
                  alt="Desplegar Servicios"
                />
                <h3>Servicios</h3>
              </button>
              {desplegableServicios && <ServicesSection />}
              <hr />
            </div>
            <div className="Desplegable">
              <button
                className="DesplButton"
                onClick={() => setDesplegableHorarios(!desplegableHorarios)}
              >
                <img
                  className="img"
                  src="/assets/down-arrow.png"
                  alt="Desplegar Horarios"
                />
                <h3>Horarios</h3>
              </button>
              {desplegableHorarios && (
                <HorasSection horas={horas} setHoras={setHoras} />
              )}
              <hr />
            </div>
            <div className="Desplegable">
              <button
                className="DesplButton"
                onClick={() =>
                  setDesplegableComentarios(!desplegableComentarios)
                }
              >
                <img
                  className="img"
                  src="/assets/down-arrow.png"
                  alt="Desplegar Horarios"
                />
                <h3>Comentarios</h3>
              </button>
              {desplegableComentarios && <Comments mode="admin" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
