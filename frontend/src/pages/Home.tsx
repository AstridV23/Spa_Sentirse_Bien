import { Link } from "react-router-dom";
import "./Home.css";
import Comments from "../components/comments";
import Servicio from "../components/servicio";
import { useLayoutEffect } from "react";
import { TurnPopUp } from "../components/Turno";
import { usePopUp } from "../components/PopUpContext";
import LoginModal from "../components/LoginModal";

const servicios = [
  {
    img: "../assets/masaje-antiestres.jpg",
    titulo: "Masajes Antiestrés",
    texto: "Relaja cuerpo y mente, aliviando tensión muscular y estrés.",
    precio: 5000,
  },
  {
    img: "../assets/Limpieza.jpg",
    titulo: "Limpieza profunda + Hidratación",
    texto: "Limpia y rehidrata la piel, dejándola fresca y luminosa.",
    precio: 5000,
  },
  {
    img: "../assets/Velaslim.jpg",
    titulo: "VelaSlim",
    texto:
      "Eliminación de la grasa en zonas como abdomen, cintura, muslos, brazos y glúteos.",
    precio: 5000,
  },
];

function Home() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { openPopUp } = usePopUp();

  // Simulando que el usuario es admin
  const isAdmin = true; // Cambia esto a false para simular que el usuario no es admin
  const isLoggedIn = true; // Cambia esto a true para simular que el usuario está logueado

  return (
    <div className="Home-page">
      <div className="background-image" />
      <TurnPopUp />
      <main>
        <section className="first">
          <div className="first-content">
            <div className="text">
              <h2>Venga con nosotros a</h2>
              <h1 className="titulo">
                Revitalizarse, Relajarse, Renovarse, y
                <p className="MarcaName"> Sentirse bien</p>
              </h1>
            </div>
            <div className="buttonsFirst">
              <button
                className="MainButton"
                onClick={() => (isLoggedIn ? openPopUp("turn") : LoginModal())}
              >
                Agendar Turno
              </button>
              <button
                className="SecondButton"
                onClick={() => openPopUp("form")}
              >
                Contáctanos
              </button>

              {/* Rendnerizado condicional */}
              {isAdmin && (
                <Link to="/admin" className="SecondButton">
                  Administrador
                </Link>
              )}
            </div>
          </div>
        </section>
        <section className="about">
          <img src="../assets/imagen1.jpg" alt="imagen1" />
          <div className="text">
            <h4>NOSOTROS</h4>
            <h1>¿Qué buscamos?</h1>
            <p>
              Buscamos atraer la atención de nuestro clientes a través de
              experiencias inspiradas en la seducción de los sentidos. Adaptamos
              las propuestas con el objetivo de que logre desconectarse
              completamente de la rutina y disfrute de un momento de bienestar,
              en total armonía con la naturaleza.
            </p>
            <a className="SecondButton" href="#contact">
              Contáctanos
            </a>
          </div>
        </section>
        <section className="top">
          <h4 className="tituloh1">NUESTRO TOP</h4>
          <h2 className="tituloh2">Los Servicios Más Populares</h2>
          <div className="container">
            {servicios.map((servicio, index) => (
              <Servicio
                key={index} // Agregar una key única para cada elemento
                img={servicio.img}
                titulo={servicio.titulo}
                texto={servicio.texto}
                precio={servicio.precio}
              />
            ))}
          </div>
          <div className="button">
            <Link to="/servicios" className="MainButton">
              Ver Más
            </Link>
          </div>
        </section>
        <section className="comments-section" id="comments">
          <div className="comments-container">
            <Comments />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
