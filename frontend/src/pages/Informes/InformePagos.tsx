import { useEffect, useState } from "react";
import ImagePDFDownloadButton from "../../components/PDF/PDFDownloadButton";
import downloadIcon from "/assets/descargar.png";
//import axios from "axios";

interface Pago {
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
}

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

export default function InformePagos() {
  const [, /*searchTerm*/ setSearchTerm] = useState<string>("");
  const [datos, setDatos] = useState<Pago[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [totalIngresos, setTotalIngresos] = useState<number>(0);

  useEffect(() => {
    // Cargar los datos iniciales del array temporal
    setDatos(pagosFalsos);
  }, []);

  useEffect(() => {
    // Filtrar los pagos por mes y año seleccionados
    const pagosFiltrados = datos.filter((pago) => {
      if (!pago.fecha) return false;
      const [year, month] = pago.fecha.split("-");
      return (
        (selectedMonth ? month === selectedMonth : true) &&
        (selectedYear ? year === selectedYear : true)
      );
    });

    // Calcular el total de ingresos
    const total = pagosFiltrados.reduce((acc, pago) => acc + pago.valor, 0);
    setTotalIngresos(total);
  }, [datos, selectedMonth, selectedYear]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTratamientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Se cambió el tratamiento a ${e.target.value}`);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleDeletePago = (id: number) => {
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
        console.log(`Pago ${id} borrado`);
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
            pdfUrl="/pdf/pagos"
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
          <select onChange={handleMonthChange}>
            <option value="">Mes</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
          <select onChange={handleYearChange}>
            <option value="">Año</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div className="total-ingresos">
        <h4>Total Ingresos:</h4> <p>${totalIngresos}</p>
      </div>

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
              <th>Método</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {datos.map((pago) => (
              <tr key={pago.id}>
                <td data-label="ID">{pago.id}</td>
                <td data-label="C. ID">{pago.cliente.id}</td>
                <td data-label="Cliente">
                  {pago.cliente.nombre} {pago.cliente.apellido}
                </td>
                <td data-label="CUIL">{pago.cuil}</td>
                <td data-label="Fecha">{pago.fecha}</td>
                <td data-label="Tratamiento">{pago.tipoTratamiento}</td>
                <td data-label="Servicio">{pago.servicio}</td>
                <td data-label="Valor">{pago.valor}</td>
                <td data-label="Método">
                  {pago.local ? "Efectivo" : "Tarjeta"}
                </td>
                {pago.local && (
                  <td data-label="">
                    <button
                      className="delete"
                      onClick={() => handleDeletePago(pago.id)}
                    >
                      Borrar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
