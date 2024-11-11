import { useParams } from "react-router-dom";
import "./Informes.css";
import InformeClientes from "./InformeClientes";
import InformeTurnos from "./InformeTurnos";
import InformePagos from "./InformePagos";

export default function Informe() {
  const { tipo } = useParams<{ tipo: string }>();

  const titulo =
    tipo === "usuarios"
      ? "USUARIOS"
      : tipo === "turnos"
      ? "TURNOS"
      : tipo === "pagos"
      ? "PAGOS"
      : "GENERAL";

  return (
    <div className="informe-page">
      <div className="background" />
      <div className="informe-container">
        <div className="titulo">
          <h1>INFORME DE {titulo}</h1>
        </div>

        {tipo === "usuarios" ? (
          <InformeClientes />
        ) : tipo === "turnos" ? (
          <InformeTurnos />
        ) : tipo === "pagos" ? (
          <InformePagos />
        ) : (
          <h2>No se encontró el tipo de informe</h2>
        )}
      </div>
    </div>
  );
}
