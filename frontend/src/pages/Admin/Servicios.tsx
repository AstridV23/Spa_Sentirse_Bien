import React from "react";
import Dropdown from "../../components/Dropdown";

type Servicio = {
  nombre: string;
  precio: number;
};

type Servicios = {
  [key: string]: Servicio[];
};

type DataState = {
  tipoTratamiento: string;
  servicio: string;
};

type ServicesSectionProps = {
  services: Servicios;
  setServices: (services: Servicios) => void;
  precio: number;
  setPrecio: (precio: number) => void;
  Data: DataState;
  setData: (data: DataState) => void;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  setServices,
  precio,
  setPrecio,
  Data,
  setData,
}) => {
  const handleChangeOptions = (name: string, value: string) => {
    const newData: DataState = { ...Data, [name]: value };

    if (name === "tipoTratamiento") {
      newData.servicio = ""; // Reiniciar el servicio cuando se cambia el tipo de tratamiento
      setPrecio(0);
    }

    if (name === "servicio") {
      const selectedService = services[newData.tipoTratamiento]?.find(
        (serv) => serv.nombre === value
      );
      if (selectedService) {
        setPrecio(selectedService.precio);
      } else {
        setPrecio(0);
      }
    }

    setData(newData); // Actualiza el estado con el nuevo objeto
  };

  return (
    <div className="services-section">
      <h3>Servicios</h3>
      <div className="buttons">
        <div className="par">
          <Dropdown
            label="Tipo"
            options={Object.keys(services)}
            onChange={(selectedOption) =>
              handleChangeOptions("tipoTratamiento", selectedOption)
            }
          />
          <Dropdown
            label="Servicio"
            options={
              services[Data.tipoTratamiento]?.map(
                (servicio) => servicio.nombre
              ) || []
            }
            onChange={(selectedOption) =>
              handleChangeOptions("servicio", selectedOption)
            }
          />
        </div>
        <div className="par">
          <input
            type="text"
            className="textbox"
            value={precio.toString()}
            readOnly
          />
          <input type="submit" className="MainButton" value="Guardar" />
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
