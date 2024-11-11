import { useEffect, useState } from "react";
import ImagePDFDownloadButton from "../../components/PDF/PDFDownloadButton";
import downloadIcon from "/assets/descargar.png";
//import axios from "axios";

interface Turno {
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
}

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
    informacion:
      "Cliente alérgica al esmalte tradicional, usar productos hipoalergénicos",
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
    informacion: "Solicita diseños florales en tonos pasteles",
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
    informacion: "Presenta tensión en zona lumbar, requiere atención especial",
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
    informacion: "Primera visita, cliente referida por promoción de Instagram",
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

export default function InformeTurnos() {
  const [, /*searchTerm*/ setSearchTerm] = useState<string>("");
  const [datos, setDatos] = useState<Turno[]>([]);

  useEffect(() => {
    // Cargar los datos iniciales del array temporal
    setDatos(turnosFalsos);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTratamientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Se cambió el tratamiento a ${e.target.value}`);
  };
  const handleProfesionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Se cambio el profesional a ${e.target.value}`);
  };
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Se cambio la fecha a ${e.target.value}`);
  };
  const handleCancelar = (e: React.MouseEvent<HTMLButtonElement>) => {
    swal({
      title: "¿Estás seguro?",
      text: "El turno se perderá permanentemente",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancelar",
          value: null,
          visible: true,
          closeModal: true,
        },
        confirm: {
          text: "Confirmar",
          value: true,
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        console.log(`Se cancelo el turno ${e.currentTarget.id}`);
      }
    });
  };

  return (
    <>
      <div className="buttons">
        <div className="par">
          <input
            type="search"
            name="search"
            placeholder="Buscar aquí"
            onChange={handleSearch}
          />
          <ImagePDFDownloadButton
            pdfUrl="/pdf/turnos"
            imageSrc={downloadIcon}
            altText="Descargar PDF"
          />
        </div>
        <div className="filtros">
          <h3>Filtros</h3>
          <select onChange={handleTratamientoChange}>
            <option value="">Tratamiento</option>
            <option value="masajes">Masajes</option>
            <option value="belleza">Belleza</option>
            <option value="faciales">Faciales</option>
            <option value="corporales">Corporales</option>
          </select>
          <input type="date" onChange={handleFechaChange} />
          <select onChange={handleProfesionalChange}>
            <option value="">Profesional</option>
            {/* mapeo de los profesionales */}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
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
            {datos.map((turno) => (
              <tr key={turno.TurnoId}>
                <td data-label="ID">{turno.TurnoId}</td>
                <td data-label="Cliente">
                  {turno.cliente.nombre} {turno.cliente.apellido}
                </td>
                <td data-label="Profesional">
                  {turno.profesional.nombre} {turno.profesional.apellido}
                </td>
                <td data-label="Fecha">{turno.fecha}</td>
                <td data-label="Hora">{turno.hora}</td>
                <td data-label="Tratamiento">{turno.tipoTratamiento}</td>
                <td data-label="Servicio">{turno.servicio}</td>
                <td data-label="Info.">
                  {turno.informacion && (
                    <p
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                      onClick={() =>
                        swal({
                          title: "Informacion Importante",
                          text: turno.informacion,
                        })
                      }
                    >
                      info
                    </p>
                  )}
                </td>
                <td data-label="delete">
                  <button className="delete" onClick={handleCancelar}>
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
