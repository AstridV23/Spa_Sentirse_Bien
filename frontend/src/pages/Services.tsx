import { useLayoutEffect } from "react";
import Servicio from "../components/servicio";
import { TurnPopUp } from "../components/Turno";
import "./Services.css";

type TarjetaProps = {
  img: string;
  titulo: string;
  texto: string;
  precio: number;
};
const masajes: TarjetaProps[] = [
  {
    img: "../assets/masaje-antiestres.jpg",
    titulo: "Antiestrés",
    texto: "Relaja cuerpo y mente, aliviando tensión muscular y estrés.",
    precio: 5000,
  },
  {
    img: "../assets/masaje-descontractura.jpg",
    titulo: "Descontracturantes",
    texto:
      "Alivia dolores musculares profundos, devolviendo flexibilidad al cuerpo.",
    precio: 5000,
  },
  {
    img: "../assets/masaje-piedras.jpeg",
    titulo: "Con piedras calientes",
    texto:
      "Combina el calor de piedras volcánicas con masajes para una relajación profunda.",
    precio: 5000,
  },
  {
    img: "../assets/masaje-circulatorio.jpg",
    titulo: "Circulatorios",
    texto:
      "Estimula la circulación sanguínea, mejorando la oxigenación de tejidos.",
    precio: 5000,
  },
];
const belleza: TarjetaProps[] = [
  {
    img: "../assets/lifting-pestanas.jpg",
    titulo: "Lifting de pestaña",
    texto:
      "Eleva y realza tus pestañas de forma natural, con resultados duraderos.",
    precio: 5000,
  },
  {
    img: "../assets/depilacion-facial.jpg",
    titulo: "Depilación facial",
    texto:
      "Elimina vellos no deseados con precisión, dejando tu piel suave y lisa.",
    precio: 5000,
  },
  {
    img: "../assets/manos-y-pies.jpeg",
    titulo: "Manos y pies",
    texto:
      "Cuida y embellece tus manos y pies con nuestros tratamientos especializados.",
    precio: 5000,
  },
];
const trataFa: TarjetaProps[] = [
  {
    img: "../assets/punta-diamante.jpg",
    titulo: "Punta de Diamante",
    texto:
      "Microexfoliación que renueva la piel, dándole un aspecto más joven y luminoso.",
    precio: 5000,
  },
  {
    img: "../assets/Limpieza.jpg",
    titulo: "Limpieza profunda + Hidratación",
    texto: "Limpia y rehidrata la piel, dejándola fresca y luminosa.",
    precio: 5000,
  },
  {
    img: "../assets/crio-frecuencia.jpg",
    titulo: "Crio frecuencia facial",
    texto:
      "Produce un ‘shock térmico’, logrando un efecto lifting instantáneo en tu rostro.",
    precio: 5000,
  },
];
const trataCo: TarjetaProps[] = [
  {
    img: "../assets/Velaslim.jpg",
    titulo: "VelaSlim",
    texto: "Reducción de la circunferencia corporal y la celulitis.",
    precio: 5000,
  },
  {
    img: "../assets/Dermohealth.jpg",
    titulo: "DermoHealth",
    texto:
      "Moviliza tejidos y estimula la microcirculación, generando un drenaje linfático.",
    precio: 5000,
  },
  {
    img: "../assets/criofrecuencia-corporal.jpg",
    titulo: "Criofrecuencia",
    texto:
      "Produce un efecto de lifting instantáneo, tonificando y rejuveneciendo la piel.",
    precio: 5000,
  },
  {
    img: "../assets/Ultracavitacion.jpg",
    titulo: "Ultracavitación",
    texto:
      "Técnica reductora que combate la grasa localizada, esculpiendo tu figura.",
    precio: 8000,
  },
];

type Props = {
  titulo: string;
  tarjetas: TarjetaProps[];
};
export function ServiceSection(props: Props) {
  const { titulo, tarjetas } = props;
  return (
    <div className="services-section">
      <h3>{titulo}</h3>
      <div className="services-container">
        {tarjetas.map((TarjetaProps, index) => (
          <Servicio
            key={index}
            img={TarjetaProps.img}
            titulo={TarjetaProps.titulo}
            texto={TarjetaProps.texto}
            precio={TarjetaProps.precio}
          />
        ))}
      </div>
    </div>
  );
}

function Services() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="servicios-page">
      <div className="background-image" />
      <div className="servicios-container">
        <div className="titulo">
          <h1>SERVICIOS</h1>
          <hr />
        </div>
        <div className="servicios-types">
          <ServiceSection titulo="Masajes" tarjetas={masajes} />
          <ServiceSection titulo="Belleza" tarjetas={belleza} />
          <ServiceSection titulo="Tratamientos Faciales" tarjetas={trataFa} />
          <ServiceSection titulo="Tratamientos Corporales" tarjetas={trataCo} />
        </div>
      </div>
      <TurnPopUp />
    </div>
  );
}

export default Services;
