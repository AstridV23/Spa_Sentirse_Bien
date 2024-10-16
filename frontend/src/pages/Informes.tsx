import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Informes.css";

type Usuario = {
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
const clientesFalsos: Usuario[] = [
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
  const [datos, setDatos] = useState<(Usuario | Turno)[]>([]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      switch (tipo) {
        case "usuarios":
          setDatos(clientesFalsos);
          break;
        case "turnos":
          setDatos(turnosFalsos);
          break;
        default:
          setDatos([]);
          break;
      }
    };
    fetchData();
  }, [tipo]);

  function handleDelete(id: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Si borras, se perderá el turno.",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancelar",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
        confirm: {
          text: "Confirmar",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Lógica para borrar el turno
        console.log(`Turno ${id} borrado`);
      }
    });
  }

  const isCliente = (dato: Usuario | Turno): dato is Usuario => {
    return "correo" in dato; // Verifica si la propiedad "correo" pertenece a dato
  };
  const isTurno = (dato: Usuario | Turno): dato is Turno => {
    return "id" in dato; // Verifica si la propiedad "id" pertenece a dato
  };

  const renderTable = () => {
    if (tipo === "usuarios") {
      return (
        <div className="table-container">
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
                    <tr key={dato.id}>
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
        </div>
      );
    } else if (tipo === "turnos") {
      return (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>C.ID</th>
                <th>Cliente</th>
                <th>P.ID</th>
                <th>Profesional</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Tratamiento</th>
                <th>Servicio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dato) => {
                if (isTurno(dato)) {
                  const cliente = dato.cliente;
                  const profesional = dato.profesional;
                  return (
                    <tr key={dato.id}>
                      <td data-label="ID">{dato.id}</td>
                      <td data-label="C.ID">{cliente ? cliente.id : "N/A"}</td>
                      <td data-label="Cliente">
                        {cliente
                          ? `${cliente.nombre} ${cliente.apellido}`
                          : "N/A"}
                      </td>
                      <td data-label="P.ID">
                        {profesional ? profesional.id : "N/A"}
                      </td>
                      <td data-label="Profesional">
                        {profesional
                          ? `${profesional.nombre} ${profesional.apellido}`
                          : "N/A"}
                      </td>
                      <td data-label="Fecha">{dato.fecha}</td>
                      <td data-label="Hora">{dato.hora}</td>
                      <td data-label="Tratamiento">{dato.tipoTratamiento}</td>
                      <td data-label="Servicio">{dato.servicio}</td>
                      <td data-label="">
                        <button
                          className="delete"
                          onClick={() => handleDelete(dato.id)}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      );
    }

    return <p>No hay datos disponibles para este tipo de informe.</p>;
  };

  const titulo =
    tipo === "usuarios" ? "USUARIOS" : tipo === "turnos" ? "TURNOS" : "GENERAL";

  return (
    <div className="informe-page">
      <div className="titulo">
        <h1>INFORME {titulo}</h1>
      </div>
      <div className="buttons">
        <div className="par">
          <input type="search" name="search" placeholder="Buscar aqui" />
          <img src="/assets/descargar.png" alt="pdf" />
        </div>
        <div className="filtros">
          <h3>Filtros</h3>
          <select>
            <option value="">Rol</option>
            <option value="clientes">Clientes</option>
            <option value="empleados">Empleados</option>
          </select>
          <select>
            <option value="">Tratamiento</option>
            <option value="masajes">Masajes</option>
            <option value="belleza">Belleza</option>
            <option value="faciales">Faciales</option>
            <option value="corporales">Corporales</option>
          </select>
        </div>
      </div>
      {renderTable()}
    </div>
  );
}