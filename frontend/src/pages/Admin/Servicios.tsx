import React, { ChangeEvent, useState } from "react";
import Dropdown from "../../components/Dropdown";

type Servicio = {
  img: string;
  titulo: string;
  descripcion: string;
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
};

export function ServicesSection({
  services,
  setServices,
}: ServicesSectionProps) {
  const [precioNuevo, setPrecioNuevo] = useState<number>(0);

  const [titulo, setTitulo] = useState("");
  const [text, setText] = useState("");
  const [, /*image*/ setImage] = useState<File | null>(null); // image es lo que se debe mandar a la base de datos
  const [imagePreviewServicio, setImagePreviewServicio] = useState<
    string | null
  >(null); // imagePreviewNew es la version URL de image, para poder verla necesitamos string

  const [reset, setReset] = useState(false);

  const [Data, setData] = useState<DataState>({
    tipoTratamiento: "",
    servicio: "",
  });

  const handleChangeOptions = (name: string, value: string) => {
    const ServiceData: DataState = { ...Data, [name]: value };
    setReset(false);

    if (name === "tipoTratamiento") {
      ServiceData.servicio = ""; // Reiniciar el servicio cuando se cambia el tipo de tratamiento
    }
    if (name === "servicio") {
      const selectedService = services[ServiceData.tipoTratamiento]?.find(
        (serv) => serv.titulo === value
      );
      if (selectedService) {
        setTitulo(selectedService.titulo);
        setText(selectedService.descripcion);
        setPrecioNuevo(selectedService.precio);
        setImagePreviewServicio(selectedService.img);
      } else {
        setTitulo("");
        setText("");
        setPrecioNuevo(0);
        setImagePreviewServicio("");
      }
    }
    setData(ServiceData); // Actualiza el estado con el nuevo objeto
  };

  function handleChangePrecio(event: React.ChangeEvent<HTMLInputElement>) {
    setPrecioNuevo(Number(event.target.value));
  }
  function handleInputChangeServicio(event: ChangeEvent<HTMLInputElement>) {
    setTitulo(event.target.value);
  }
  function handleTextAreaChangeServicio(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    setText(event.target.value);
  }
  const handleImageChangeServicio = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewServicio(previewUrl);
    }
  };

  function handleUpdateServicio() {
    if (
      !Data.tipoTratamiento ||
      !titulo ||
      !text ||
      precioNuevo === null ||
      !imagePreviewServicio
    ) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
      return;
    } else {
      swal({
        title: "Carga exitosa",
        icon: "success",
        timer: 1000,
      });

      const currentServices = services[Data.tipoTratamiento] || [];

      // Comprobar si el servicio existe
      const existingService = currentServices.find(
        (servicio) =>
          servicio.titulo.trim().toLowerCase() ===
          Data.servicio.trim().toLowerCase()
      );

      let updatedServices;

      if (existingService) {
        // Si el servicio existe, lo actualiza
        updatedServices = currentServices.map((servicio) =>
          servicio.titulo.trim().toLowerCase() ===
          Data.servicio.trim().toLowerCase()
            ? {
                ...servicio,
                titulo: titulo,
                descripcion: text,
                precio: precioNuevo,
                img: imagePreviewServicio,
              }
            : servicio
        );
      } else {
        // Si no existe, lo agrega
        updatedServices = [
          ...currentServices,
          {
            img: imagePreviewServicio,
            titulo: titulo,
            descripcion: text,
            precio: precioNuevo,
          },
        ];
      }

      setServices({
        ...services,
        [Data.tipoTratamiento]: updatedServices,
      });

      // Reseteo de imagen
      setTitulo("");
      setText("");
      setPrecioNuevo(0);
      setImage(null);
      setImagePreviewServicio(null);
    }
  }

  function handleDeleteService() {
    if (!titulo) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
    } else {
      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, deberas subirlo de nuevo.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          const updatedServicios = {
            ...services,
            [Data.tipoTratamiento]:
              services[Data.tipoTratamiento]?.filter(
                (servicio) => servicio.titulo !== Data.servicio
              ) || [],
          };

          setServices(updatedServicios);
          setTitulo("");
          setText("");
          setPrecioNuevo(0);
          setImage(null);
          setImagePreviewServicio(null);
          setReset(true);
          swal({
            title: "Servicio eliminado",
            icon: "success",
            timer: 1000,
          });
        }
      });
    }
  }

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
                (servicio) => servicio.titulo
              ) || []
            }
            reset={reset}
            onChange={(selectedOption) =>
              handleChangeOptions("servicio", selectedOption)
            }
          />
        </div>
      </div>

      <form
        className="buttons"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateServicio();
        }}
      >
        <div className="par">
          <input
            className="textbox"
            name="titulo"
            type="text"
            value={titulo}
            onChange={handleInputChangeServicio}
            placeholder="Título"
          />
          <textarea
            className="textbox"
            name="text"
            value={text}
            onChange={handleTextAreaChangeServicio}
            placeholder="Descripción"
          />
          <input
            id="precio"
            type="number"
            className="textbox"
            value={precioNuevo}
            onChange={handleChangePrecio}
            placeholder="Precio"
          />
        </div>
        <div className="par">
          <div className="SecondButton">
            <label htmlFor="file-upload-servicio">Subir imagen</label>
            <input
              id="file-upload-servicio"
              type="file"
              accept="image/*"
              onChange={handleImageChangeServicio}
              style={{ display: "none" }}
            />
          </div>
          <input className="MainButton" type="submit" value="Guardar" />
          <input
            className="SecondButton"
            type="button"
            value="Borrar"
            onClick={() => handleDeleteService()}
          />
        </div>
      </form>
      {imagePreviewServicio && (
        <div className="image-preview">
          <p>Vista previa:</p>
          <img src={imagePreviewServicio} alt="Vista previa" />
        </div>
      )}
    </div>
  );
}

export default ServicesSection;
