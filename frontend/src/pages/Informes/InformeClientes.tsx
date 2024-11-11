import { useEffect, useState } from "react";
import ImagePDFDownloadButton from "../../components/PDF/PDFDownloadButton";
import downloadIcon from "/assets/descargar.png";
import axios from "axios";

interface User {
  _id: number;
  username: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  sex: string;
  role: string;
  createdAt: string;
  reservations: number;
}

/*
const usuariosFalsos: User[] = [
  {
    _id: 1,
    role: "usuario",
    username: "JuanPerez",
    firstname: "Juan",
    lastname: "Perez",
    email: "juan.perez@example.com",
    sex: "Masculino",
    phone: "555-1234",
    createdAt: "2023-01-15",
    reservations: 3,
  },
  {
    _id: 2,
    role: "usuario",
    username: "AnaGomez",
    firstname: "Ana",
    lastname: "Gómez",
    email: "ana.gomez@example.com",
    sex: "Femenino",
    phone: "555-5678",
    createdAt: "2022-11-20",
    reservations: 5,
  },
  {
    _id: 3,
    role: "usuario",
    username: "JuanPerez",
    firstname: "Juan",
    lastname: "Perez",
    email: "juan.perez@example.com",
    sex: "Masculino",
    phone: "555-1234",
    createdAt: "2023-01-15",
    reservations: 3,
  },
  {
    _id: 4,
    role: "profesional",
    username: "AnaGomez",
    firstname: "Ana",
    lastname: "Gómez",
    email: "ana.gomez@example.com",
    sex: "Femenino",
    phone: "555-5678",
    createdAt: "2022-11-20",
    reservations: 5,
  },
  {
    _id: 5,
    role: "usuario",
    username: "JuanPerez",
    firstname: "Juan",
    lastname: "Perez",
    email: "juan.perez@example.com",
    sex: "Masculino",
    phone: "555-1234",
    createdAt: "2023-01-15",
    reservations: 3,
  },
  {
    _id: 6,
    role: "usuario",
    username: "AnaGomez",
    firstname: "Ana",
    lastname: "Gómez",
    email: "ana.gomez@example.com",
    sex: "Femenino",
    phone: "555-5678",
    createdAt: "2022-11-20",
    reservations: 5,
  },
  {
    _id: 7,
    role: "secretario",
    username: "JuanPerez",
    firstname: "Juan",
    lastname: "Perez",
    email: "juan.perez@example.com",
    sex: "Masculino",
    phone: "555-1234",
    createdAt: "2023-01-15",
    reservations: 3,
  },
  {
    _id: 8,
    role: "profesional",
    username: "AnaGomez",
    firstname: "Ana",
    lastname: "Gómez",
    email: "ana.gomez@example.com",
    sex: "Femenino",
    phone: "555-5678",
    createdAt: "2022-11-20",
    reservations: 5,
  },
  {
    _id: 9,
    role: "usuario",
    username: "JuanPerez",
    firstname: "Juan",
    lastname: "Perez",
    email: "juan.perez@example.com",
    sex: "Masculino",
    phone: "555-1234",
    createdAt: "2023-01-15",
    reservations: 3,
  },
  {
    _id: 10,
    role: "doctor",
    username: "AnaGomez",
    firstname: "Ana",
    lastname: "Gómez",
    email: "ana.gomez@example.com",
    sex: "Femenino",
    phone: "555-5678",
    createdAt: "2022-11-20",
    reservations: 5,
  },
];
*/


export default function InformeClientes() {
  const [/*searchTerm*/, setSearchTerm] = useState<string>("");
  const [datos, setDatos] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        if (Array.isArray(response.data)) {
          setDatos(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setDatos([]);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setDatos([]);
      }
    };

    fetchUsers();
  }, []);

  const handleRolChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    try {
      let response;
      if (selectedRole) {
        response = await axios.get(`/api/users/role/${selectedRole}`);
      } else {
        response = await axios.get("/api/users");
      }
      setDatos(response.data);
    } catch (error) {
      console.error("Error al filtrar por rol:", error);
      setDatos([]);
    }
  };

  return (
    <>
      <div className="buttons">
        <div className="par">
          <input
            type="search"
            name="search"
            placeholder="Buscar aqui"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ImagePDFDownloadButton
            pdfUrl="/pdf/usuarios"
            imageSrc={downloadIcon}
            altText="Descargar PDF"
          />
        </div>
        <div className="filtros">
          <h3>Filtros</h3>
          <select onChange={handleRolChange}>
            <option value="">Rol</option>
            <option value="clientes">Clientes</option>
            <option value="empleados">Empleados</option>
          </select>
        </div>
      </div>

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
            {datos.map((dato) => (
              <tr key={dato._id}>
                <td data-label="ID">{dato._id}</td>
                <td data-label="Rol">{dato.role}</td>
                <td data-label="Usuario">{dato.username}</td>
                <td data-label="Nombres">{dato.firstname}</td>
                <td data-label="Apellidos">{dato.lastname}</td>
                <td data-label="Correo">{dato.email}</td>
                <td data-label="Género">{dato.sex}</td>
                <td data-label="Teléfono">{dato.phone}</td>
                <td data-label="Creado">{dato.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
