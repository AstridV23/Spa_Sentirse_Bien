import "./servicio.css";
import { usePopUp } from "./PopUpContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  img: string;
  titulo: string;
  texto: string;
  precio: number;
};

export default function Servicio(props: Props) {
  const { openPopUp } = usePopUp();
  const { img, titulo, texto, precio } = props;
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      openPopUp("turn");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="tarjeta" onClick={handleClick}>
      <img src={img} />
      <div className="info">
        <h4 className="titulo">{titulo}</h4>
        <p>{texto}</p>
        <h4 className="SecondButton">${precio}</h4>
      </div>
    </div>
  );
}
