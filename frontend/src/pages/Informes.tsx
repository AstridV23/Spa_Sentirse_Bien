import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImagePDFDownloadButton from "../components/PDF/PDFDownloadButton";
import downloadIcon from "/assets/descargar.png";
import "./Informes.css"; 
import axios from "axios";

type Usuario = {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  sex: string;
  role: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  // bookingsByUser: number;
};
/*
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
*/
type Turno = {
  TurnoId: number;
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
  informacion?: string;
};
const turnosFalsos: Turno[] = [
  {
    TurnoId: 1,
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
    hora: "10:00",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    TurnoId: 2,
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
    hora: "12:30",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
    informacion: "Informacion Importante",
  },
  {
    TurnoId: 3,
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
    hora: "10:00",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    TurnoId: 4,
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
    hora: "12:30",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
    informacion: "Informacion Importante",
  },
  {
    TurnoId: 5,
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
    hora: "10:00",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    TurnoId: 6,
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
    hora: "12:30",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
  {
    TurnoId: 7,
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
    hora: "10:00",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
    informacion: "Informacion Importante",
  },
  {
    TurnoId: 8,
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
    hora: "12:30",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
    informacion: "Informacion Importante",
  },
  {
    TurnoId: 9,
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
    hora: "10:00",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
  },
  {
    TurnoId: 10,
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
    hora: "12:30",
    tipoTratamiento: "Belleza",
    servicio: "Manicura y pedicura",
  },
];

type Pago = {
  id: number;
  cliente: {
    id: number;
    nombre: string;
    apellido: string;
  };
  cuil: string;
  fecha: string;
  tipoTratamiento: string;
  servicio: string;
  valor: number;
  local: boolean;
};
const pagosFalsos: Pago[] = [
  {
    id: 1,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    cuil: "20-12345678-9",
    fecha: "2024-10-22",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
    valor: 6000,
    local: true,
  },
  {
    id: 2,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    cuil: "20-12345678-9",
    fecha: "2024-10-22",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
    valor: 4000,
    local: false,
  },
  {
    id: 3,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    cuil: "20-12345678-9",
    fecha: "2024-10-22",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
    valor: 5000,
    local: true,
  },
  {
    id: 4,
    cliente: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
    },
    cuil: "20-12345678-9",
    fecha: "2024-10-22",
    tipoTratamiento: "Masaje",
    servicio: "Masaje relajante de espalda",
    valor: 8000,
    local: false,
  },
];

export default function Informe() {
  const { tipo } = useParams<{ tipo: string }>();
  const [datos, setDatos] = useState<(Usuario | Turno | Pago)[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [totalIngresos, setTotalIngresos] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (tipo === "usuarios") {
        try {
          const response = await axios.get('/api/users');
          setDatos(response.data);
        } catch (error) {
          console.error('Error al obtener usuarios:', error);
          // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
      } else if (tipo === "turnos") {
        // Ordenar los turnos por fecha y hora
        const turnosOrdenados = [...turnosFalsos].sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`);
          const fechaB = new Date(`${b.fecha}T${b.hora}`);
          return fechaA.getTime() - fechaB.getTime();
        });
        setDatos(turnosOrdenados);
      } else if (tipo === "pagos") {
        // Ordenar los pagos por fecha
        const pagosOrdenados = [...pagosFalsos].sort((a, b) => {
          const fechaA = new Date(a.fecha);
          const fechaB = new Date(b.fecha);
          return fechaA.getTime() - fechaB.getTime();
        });
        setDatos(pagosOrdenados);
      }
    };
    fetchData();
  }, [tipo]);

  useEffect(() => {
    if (tipo === "pagos") {
      // Filtrar los pagos por mes y año seleccionados
      const pagosFiltrados = (datos as Pago[]).filter((pago) => {
        if (!pago.fecha) return false; // Asegura que haya una fecha válida
        const [year, month] = pago.fecha.split("-"); // Suponiendo que `pago.fecha` tiene formato 'yyyy-mm-dd'
        return (
          (selectedMonth ? month === selectedMonth : true) &&
          (selectedYear ? year === selectedYear : true)
        );
      });

      // Calcular el total de ingresos
      const total = pagosFiltrados.reduce((acc, pago) => acc + pago.valor, 0);
      setTotalIngresos(total);
    }
  }, [datos, selectedMonth, selectedYear, tipo]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Se cambio el tipo de tratamiento a ${e.target.value}`);
  };
  const handleTratamientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Se cambio el tipo de tratamiento a ${e.target.value}`);
  };
  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Se cambio el rol a ${e.target.value}`);
  };
  const handleProfesionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Se cambio el profesional a ${e.target.value}`);
  };
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Se cambio la fecha a ${e.target.value}`);
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    console.log(`Se cambio el mes a ${e.target.value}`);
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    console.log(`Se cambio el año a ${e.target.value}`);
  };

  function handleDeleteTurno(id: number) {
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

  function handleDeletePago(id: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Si borras, se perderá el pago.",
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
        // Lógica para borrar el pago
        console.log(`Pago ${id} borrado`);
      }
    });
  }

  const isCliente = (dato: Usuario | Turno | Pago): dato is Usuario => {
    return "status" in dato; // Verifica si la propiedad "correo" pertenece a dato
  };
  const isTurno = (dato: Usuario | Turno | Pago): dato is Turno => {
    return "TurnoId" in dato; // Verifica si la propiedad "id" pertenece a dato
  };
  const isPago = (dato: Usuario | Turno | Pago): dato is Pago => {
    return "cuil" in dato; // Verifica si la propiedad "id" pertenece a dato
  };

  const renderTable = () => {
    if (tipo === "usuarios") {
      return (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rol</th>
                <th>Usuario</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Género</th>
                <th>Teléfono</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {datos.filter((dato): dato is Usuario => 'email' in dato).map((dato) => (
                <tr key={dato._id}>
                  <td data-label="ID">{dato._id}</td>
                  <td data-label="Rol">{dato.role}</td>
                  <td data-label="Usuario">{dato.username}</td>
                  <td data-label="Nombres">{dato.firstname}</td>
                  <td data-label="Apellidos">{dato.lastname}</td>
                  <td data-label="Correo">{dato.email}</td>
                  <td data-label="Género">{dato.sex}</td>
                  <td data-label="Teléfono">{dato.phone}</td>
                  <td data-label="Creado">{new Date(dato.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
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
                <th>Info.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dato) => {
                if (isTurno(dato)) {
                  const cliente = dato.cliente;
                  const profesional = dato.profesional;
                  return (
                    <tr key={dato.TurnoId}>
                      <td data-label="ID">{dato.TurnoId}</td>
                      <td data-label="C.ID">{dato.cliente.id}</td>
                      <td data-label="Cliente">
                        {cliente.nombre} {cliente.apellido}
                      </td>
                      <td data-label="P.ID">{dato.profesional.id}</td>
                      <td data-label="Profesional">
                        {profesional.nombre} {profesional.apellido}
                      </td>
                      <td data-label="Fecha">{dato.fecha}</td>
                      <td data-label="Hora">{dato.hora}</td>
                      <td data-label="Tratamiento">{dato.tipoTratamiento}</td>
                      <td data-label="Servicio">{dato.servicio}</td>
                      <td
                        data-label="Info."
                        onClick={() =>
                          swal("Información Importante", dato.informacion || "")
                        }
                        style={{
                          margin: "0 auto",
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "#49635f",
                          opacity: 0.7,
                        }}
                      >
                        {dato.informacion ? "Info" : ""}
                      </td>
                      <td data-label="">
                        <button
                          className="delete"
                          onClick={() => handleDeleteTurno(dato.TurnoId)}
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
    } else if (tipo === "pagos") {
      return (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>C. ID</th>
                <th>Cliente</th>
                <th>CUIL</th>
                <th>Fecha</th>
                <th>Tratamiento</th>
                <th>Servicio</th>
                <th>Valor $</th>
                <th>Metodo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dato) => {
                if (isPago(dato)) {
                  return (
                    <tr key={dato.id}>
                      <td data-label="ID">{dato.id}</td>
                      <td data-label="C. ID">{dato.cliente.id}</td>
                      <td data-label="Cliente">
                        {dato.cliente.nombre} {dato.cliente.apellido}
                      </td>
                      <td data-label="CUIL">{dato.cuil}</td>
                      <td data-label="Fecha">{dato.fecha}</td>
                      <td data-label="Tratamiento">{dato.tipoTratamiento}</td>
                      <td data-label="Servicio">{dato.servicio}</td>
                      <td data-label="Valor">{dato.valor}</td>
                      <td data-label="Local">
                        {dato.local ? "Efectivo" : "Tarjeta"}
                      </td>
                      {dato.local && (
                        <td data-label="">
                          <button
                            className="delete"
                            onClick={() => handleDeletePago(dato.id)}
                          >
                            Borrar
                          </button>
                        </td>
                      )}
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
        <div className="buttons">
          <div className="par">
            <input
              type="search"
              name="search"
              placeholder="Buscar aqui"
              onChange={handleSearch}
            />

          <ImagePDFDownloadButton 
            pdfUrl={`/pdf/${tipo}`} // Ajusta esta URL a la ruta correcta de tu backend
            imageSrc={downloadIcon}
            altText="Descargar PDF"
          />

          </div>
          <div className="filtros">
            <h3>Filtros</h3>
            {tipo === "usuarios" && (
              <>
                <select onChange={handleRolChange}>
                  <option value="">Rol</option>
                  <option value="clientes">Clientes</option>
                  <option value="empleados">Empleados</option>
                </select>
              </>
            )}
            {tipo === "turnos" && (
              <>
                <input type="date" onChange={handleFechaChange} />
                <select onChange={handleProfesionalChange}>
                  <option value="">Profesional</option>
                  {/* mapeo de los profesionales */}
                </select>
              </>
            )}
            {(tipo === "pagos" || tipo === "turnos") && (
              <>
                <select onChange={handleTratamientoChange}>
                  <option value="">Tratamiento</option>
                  <option value="masajes">Masajes</option>
                  <option value="belleza">Belleza</option>
                  <option value="faciales">Faciales</option>
                  <option value="corporales">Corporales</option>
                </select>
              </>
            )}
            {tipo === "pagos" && (
              <>
                <select onChange={handleMonthChange}>
                  <option value="">Mes</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>

                <select onChange={handleYearChange}>
                  <option value="">Año</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Mostrar el total de ingresos cuando se esté en la página de pagos */}
        {tipo === "pagos" && (
          <div className="total-ingresos">
            <h4>Total Ingresos:</h4> <p>${totalIngresos}</p>
          </div>
        )}

        {renderTable()}
      </div>
    </div>
  );
}
