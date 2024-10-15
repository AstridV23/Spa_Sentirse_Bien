import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import "./Informes.css";

type Cliente = {
  id: number;
  status: string;
  username: string;
  nombres: string;
  apellidos: string;
  correo: string;
  genero: string;
  telefono: string;
  fechaCreacion: string;
  reservas: number;
};
const clientesFalsos: Cliente[] = [
  {
    id: 1,
    status: "usuario",
    username: "JuanPerez",
    nombres: "Juan",
    apellidos: "Perez",
    correo: "juan.perez@example.com",
    genero: "Masculino",
    telefono: "555-1234",
    fechaCreacion: "2023-01-15",
    reservas: 3,
  },
  {
    id: 2,
    status: "usuario",
    username: "AnaGomez",
    nombres: "Ana",
    apellidos: "Gómez",
    correo: "ana.gomez@example.com",
    genero: "Femenino",
    telefono: "555-5678",
    fechaCreacion: "2022-11-20",
    reservas: 5,
  },
  {
    id: 3,
    status: "usuario",
    username: "JuanPerez",
    nombres: "Juan",
    apellidos: "Perez",
    correo: "juan.perez@example.com",
    genero: "Masculino",
    telefono: "555-1234",
    fechaCreacion: "2023-01-15",
    reservas: 3,
  },
  {
    id: 4,
    status: "profesional",
    username: "AnaGomez",
    nombres: "Ana",
    apellidos: "Gómez",
    correo: "ana.gomez@example.com",
    genero: "Femenino",
    telefono: "555-5678",
    fechaCreacion: "2022-11-20",
    reservas: 5,
  },
  {
    id: 5,
    status: "usuario",
    username: "JuanPerez",
    nombres: "Juan",
    apellidos: "Perez",
    correo: "juan.perez@example.com",
    genero: "Masculino",
    telefono: "555-1234",
    fechaCreacion: "2023-01-15",
    reservas: 3,
  },
  {
    id: 6,
    status: "usuario",
    username: "AnaGomez",
    nombres: "Ana",
    apellidos: "Gómez",
    correo: "ana.gomez@example.com",
    genero: "Femenino",
    telefono: "555-5678",
    fechaCreacion: "2022-11-20",
    reservas: 5,
  },
  {
    id: 7,
    status: "secretario",
    username: "JuanPerez",
    nombres: "Juan",
    apellidos: "Perez",
    correo: "juan.perez@example.com",
    genero: "Masculino",
    telefono: "555-1234",
    fechaCreacion: "2023-01-15",
    reservas: 3,
  },
  {
    id: 8,
    status: "profesional",
    username: "AnaGomez",
    nombres: "Ana",
    apellidos: "Gómez",
    correo: "ana.gomez@example.com",
    genero: "Femenino",
    telefono: "555-5678",
    fechaCreacion: "2022-11-20",
    reservas: 5,
  },
  {
    id: 9,
    status: "usuario",
    username: "JuanPerez",
    nombres: "Juan",
    apellidos: "Perez",
    correo: "juan.perez@example.com",
    genero: "Masculino",
    telefono: "555-1234",
    fechaCreacion: "2023-01-15",
    reservas: 3,
  },
  {
    id: 10,
    status: "doctor",
    username: "AnaGomez",
    nombres: "Ana",
    apellidos: "Gómez",
    correo: "ana.gomez@example.com",
    genero: "Femenino",
    telefono: "555-5678",
    fechaCreacion: "2022-11-20",
    reservas: 5,
  },
];

type Turno = {
  id: number;
  cliente: {
    id: number;
    nombre: string;
    apellido: string;
  };
  profesional: {
    id: number;
    nombre: string;
    apellido: string;
  };
  fecha: string;
  hora: string;
  tipoTratamiento: string;
  servicio: string;
};
const turnosFalsos: Turno[] = [
  {
    id: 1,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    profesional: {
      id: 201,
      nombre: "Laura",
      apellido: "Martínez",
    },
    fecha: "2024-10-22",
    hora: "10:00 AM",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    id: 2,
    cliente: {
      id: 102,
      nombre: "Ana",
      apellido: "Gómez",
    },
    profesional: {
      id: 202,
      nombre: "Carlos",
      apellido: "Fernández",
    },
    fecha: "2024-10-24",
    hora: "12:30 PM",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
  {
    id: 3,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    profesional: {
      id: 201,
      nombre: "Laura",
      apellido: "Martínez",
    },
    fecha: "2024-10-19",
    hora: "10:00 AM",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    id: 4,
    cliente: {
      id: 102,
      nombre: "Ana",
      apellido: "Gómez",
    },
    profesional: {
      id: 202,
      nombre: "Carlos",
      apellido: "Fernández",
    },
    fecha: "2024-10-21",
    hora: "12:30 PM",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
  {
    id: 5,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    profesional: {
      id: 201,
      nombre: "Laura",
      apellido: "Martínez",
    },
    fecha: "2024-10-20",
    hora: "10:00 AM",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    id: 6,
    cliente: {
      id: 102,
      nombre: "Ana",
      apellido: "Gómez",
    },
    profesional: {
      id: 202,
      nombre: "Carlos",
      apellido: "Fernández",
    },
    fecha: "2024-10-21",
    hora: "12:30 PM",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
  {
    id: 7,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    profesional: {
      id: 201,
      nombre: "Laura",
      apellido: "Martínez",
    },
    fecha: "2024-10-25",
    hora: "10:00 AM",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    id: 8,
    cliente: {
      id: 102,
      nombre: "Ana",
      apellido: "Gómez",
    },
    profesional: {
      id: 202,
      nombre: "Carlos",
      apellido: "Fernández",
    },
    fecha: "2024-10-23",
    hora: "12:30 PM",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
  {
    id: 9,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    profesional: {
      id: 201,
      nombre: "Laura",
      apellido: "Martínez",
    },
    fecha: "2024-10-21",
    hora: "10:00 AM",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    id: 10,
    cliente: {
      id: 102,
      nombre: "Ana",
      apellido: "Gómez",
    },
    profesional: {
      id: 202,
      nombre: "Carlos",
      apellido: "Fernández",
    },
    fecha: "2024-10-22",
    hora: "12:30 PM",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
];

export default function Informe() {
  const { tipo } = useParams<{ tipo: string }>();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getDatos = () => {
    switch (tipo) {
      case "clientes":
        return clientesFalsos;
      case "turnos":
        return turnosFalsos;
      default:
        return [];
    }
  };

  const datos = getDatos();

  const isCliente = (dato: Cliente | Turno): dato is Cliente => {
    return "correo" in dato; // Verifica si la propiedad "correo" pertenece a dato
  };
  const isTurno = (dato: Cliente | Turno): dato is Turno => {
    return "id" in dato; // Verifica si la propiedad "id" pertenece a dato
  };

  const renderTable = () => {
    if (tipo === "clientes") {
      return (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Usuario</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Género</th>
              <th>Teléfono</th>
              <th>Created</th>
              <th>Reserv.</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => {
              if (isCliente(dato)) {
                return (
                  <tr key={dato.correo}>
                    <td data-label="ID">{dato.id}</td>
                    <td data-label="Status">{dato.status}</td>
                    <td data-label="Usuario">{dato.username}</td>
                    <td data-label="Nombres">{dato.nombres}</td>
                    <td data-label="Apellidos">{dato.apellidos}</td>
                    <td data-label="Correo">{dato.correo}</td>
                    <td data-label="Género">{dato.genero}</td>
                    <td data-label="Teléfono">{dato.telefono}</td>
                    <td data-label="Created">{dato.fechaCreacion}</td>
                    <td data-label="Reserv.">{dato.reservas}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      );
    } else if (tipo === "turnos") {
      return (
        <table className="table">
          <thead>
            <tr>
              <th>Turno ID</th>
              <th>C.ID</th>
              <th>Cliente</th>
              <th>P.ID</th>
              <th>Profesional</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Tratamiento</th>
              <th>Servicio</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => {
              if (isTurno(dato)) {
                return (
                  <tr key={dato.id}>
                    <td data-label="Turno ID">{dato.id}</td>
                    <td data-label="C.ID">{dato.cliente.id}</td>
                    <td data-label="Cliente">
                      {dato.cliente.nombre} {dato.cliente.apellido}
                    </td>
                    <td data-label="P.ID">{dato.profesional.id}</td>
                    <td data-label="Profesional">
                      {dato.profesional.nombre} {dato.profesional.apellido}
                    </td>
                    <td data-label="Fecha">{dato.fecha}</td>
                    <td data-label="Hora">{dato.hora}</td>
                    <td data-label="Tratamiento">{dato.tipoTratamiento}</td>
                    <td data-label="Servicio">{dato.servicio}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      );
    }

    return <p>No hay datos disponibles para este tipo de informe.</p>;
  };

  const titulo =
    tipo === "clientes" ? "CLIENTES" : tipo === "turnos" ? "TURNOS" : "GENERAL";

  return (
    <div className="informe-page">
      <div className="background-image" />
      <div className="informe-container">
        <div className="titulo">
          <h1>INFORME {titulo}</h1>
        </div>
        {renderTable()}
      </div>
    </div>
  );
}
