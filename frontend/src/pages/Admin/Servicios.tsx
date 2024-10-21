import React, { ChangeEvent, useEffect, useState } from "react";
import swal from "sweetalert";
import axios from "../../api/axios";
import { useForm } from "react-hook-form";

type Servicio = {
  service_name: string;
  service_type: string;
  service_description: string;
  service_price: number;
  encargado: {
    id: string;
    name: string;
    email: string;
  };
  hours: string[];
};

type Servicios = {
  [key: string]: Servicio[];
};

export default function ServicesSection() {
  const [services, setServices] = useState<Servicios>({});

  const [profesional, setProfesional] = useState("");
  const [titulo, setTitulo] = useState("");
  const [text, setText] = useState("");
  const [precioNuevo, setPrecioNuevo] = useState<number>(0);
  //const [image, setImage] = useState<File | null>(null); // image es lo que se debe mandar a la base de datos
  /*const [imagePreviewServicio, setImagePreviewServicio] = useState<
    string | null
  >(null); // imagePreviewNew es la version URL de image, para poder verla necesitamos string*/

  const [ServiceData, setServiceData] = useState<Servicio>({
    service_name: "",
    service_type: "",
    service_description: "",
    service_price: 0,
    encargado: {
      id: "",
      name: "",
      email: "",
    },
    hours: [],
  });

  const { reset } = useForm<Servicio>();

  const [tipoTratamiento, setTipoTratamiento] = useState("");
  const [servicio, setServicio] = useState("");
  const [allProfessionals, setAllProfessionals] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);

  useEffect(() => {
    reset({
      service_name: "",
      service_type: "",
      service_description: "",
      service_price: 0,
      encargado: {
        id: "",
        name: "",
        email: "",
      },
      hours: [],
    });

    // Cargar los servicios desde el backend
    const fetchServices = async () => {
      try {
        const response = await axios.get("/service"); // Asegúrate de que esta ruta sea la correcta
        const servicesData = response.data;

        // Verificar si servicesData es un array
        if (Array.isArray(servicesData)) {
          // Transformar la respuesta en el formato que necesitas
          const transformedServices: Servicios = servicesData.reduce(
            (acc: Servicios, curr: Servicio) => {
              const { service_type, service_name, service_price } = curr;

              if (!acc[service_type]) {
                acc[service_type] = [];
              }

              acc[service_type].push({
                ...curr,
                service_name: service_name,
                service_price: service_price,
              });

              return acc;
            },
            {}
          );

          setServices(transformedServices);
        } else if (typeof servicesData === "object" && servicesData !== null) {
          // Si servicesData ya es un objeto con la estructura deseada
          setServices(servicesData);
        } else {
          console.error("Formato de datos inesperado:", servicesData);
          setServices({});
        }
      } catch (error) {
        console.error("Error al cargar los servicios", error);
        setServices({});
      }
    };

    // Cargar todos los profesionales
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get("/users/role/profesional");
        setAllProfessionals(response.data);
      } catch (error) {
        console.error("Error al cargar los profesionales", error);
      }
    };

    fetchServices();
    fetchProfessionals();
  }, [reset]);

  const handleChangeOptions = async (name: string, value: string) => {
    if (name === "tipoTratamiento") {
      setTipoTratamiento(value);
      setServicio("");
      setProfesional("");
      setServiceData((prevData) => ({
        ...prevData,
        service_type: value,
        service_name: "",
        encargado: { id: "", name: "", email: "" },
      }));
    } else if (name === "servicio") {
      setServicio(value);
      const selectedService = services[tipoTratamiento]?.find(
        (serv) => serv.service_name === value
      );
      if (selectedService) {
        setTitulo(selectedService.service_name || "");
        setText(selectedService.service_description || "");
        setPrecioNuevo(selectedService.service_price || 0);

        const encargado = await axios.get(
          `/users/${selectedService.encargado}`
        );
        setProfesional(encargado.data?.username || "");
        setServiceData(selectedService);
      } else {
        setTitulo("");
        setText("");
        setPrecioNuevo(0);
        setProfesional("");
        setServiceData({
          service_name: "",
          service_type: "",
          service_description: "",
          service_price: 0,
          encargado: { id: "", name: "", email: "" },
          hours: [],
        });
      }
    }
  };

  function handleInputChangeServicio(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === "titulo") {
      setTitulo(value);
    } else if (name === "profesional") {
      setProfesional(value);
    }
  }
  function handleTextAreaChangeServicio(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    setText(event.target.value);
  }
  function handleChangePrecio(event: React.ChangeEvent<HTMLInputElement>) {
    setPrecioNuevo(Number(event.target.value) || 0);
  }
  /*const handleImageChangeServicio = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewServicio(previewUrl);
    }
  };*/

  async function handleUpdateServicio() {
    if (
      !ServiceData.service_type ||
      !ServiceData.service_name ||
      !ServiceData.service_description ||
      ServiceData.service_price === 0 ||
      !profesional
    ) {
      swal({
        title: "Falta información",
        text: "Por favor, completa todos los campos.",
        icon: "warning",
        timer: 2000,
      });
      return;
    }

    try {
      // Verificar si el profesional existe
      const professionalResponse = await axios.get("/users/role/profesional");
      const allProfessionals = professionalResponse.data;

      const profesionalExists = allProfessionals.some(
        (prof: any) =>
          prof.name?.toLowerCase() === profesional.toLowerCase() ||
          prof.username?.toLowerCase() === profesional.toLowerCase()
      );

      if (!profesionalExists) {
        swal({
          title: "Profesional no encontrado",
          text: "El profesional ingresado no existe en la base de datos.",
          icon: "error",
          timer: 3000,
        });
        return;
      }

      // Preparar los datos actualizados del servicio
      const updatedServiceData = {
        ...ServiceData,
        service_name: titulo,
        service_description: text,
        service_price: precioNuevo,
        encargado: {
          ...ServiceData.encargado,
          name: profesional,
        },
      };

      console.log("Datos a actualizar:", updatedServiceData);

      // Enviar la solicitud de actualización
      const response = await axios.put(
        `/service/${ServiceData.service_name}`,
        updatedServiceData
      );

      console.log("Respuesta del servidor:", response.data);

      if (response.status === 200) {
        swal({
          title: "Servicio actualizado con éxito",
          icon: "success",
          timer: 2000,
        });

        // Actualizar el estado local
        setServices((prevServices) => ({
          ...prevServices,
          [ServiceData.service_type]: prevServices[
            ServiceData.service_type
          ].map((service) =>
            service.service_name === ServiceData.service_name
              ? updatedServiceData
              : service
          ),
        }));

        // Limpiar el formulario
        setServiceData({
          service_name: "",
          service_type: "",
          service_description: "",
          service_price: 0,
          encargado: { id: "", name: "", email: "" },
          hours: [],
        });
        setTitulo("");
        setProfesional("");
        setText("");
        setPrecioNuevo(0);
      }
    } catch (error) {
      console.error("Error al actualizar el servicio", error);
      swal({
        title: "Error al actualizar el servicio",
        text: "Hubo un problema al intentar actualizar el servicio. Por favor, inténtalo de nuevo.",
        icon: "error",
        timer: 3000,
      });
    }
  }

  async function handleDeleteService() {
    if (!ServiceData.service_name) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
      return;
    }

    const willDelete = await swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, deberás subirlo de nuevo.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    });

    if (willDelete) {
      try {
        const response = await axios.delete(
          `/service/${ServiceData.service_name}`
        );

        if (response.status === 200) {
          swal({
            title: "Servicio eliminado",
            icon: "success",
            timer: 1000,
          });

          // Actualizar el estado local
          setServices((prevServices) => ({
            ...prevServices,
            [ServiceData.service_type]: prevServices[
              ServiceData.service_type
            ].filter(
              (service) => service.service_name !== ServiceData.service_name
            ),
          }));

          // Limpiar el formulario
          setServiceData({
            service_name: "",
            service_type: "",
            service_description: "",
            service_price: 0,
            encargado: { id: "", name: "", email: "" },
            hours: [],
          });
          setTitulo("");
          setProfesional("");
          setText("");
          setPrecioNuevo(0);
        }
      } catch (error) {
        console.error("Error al eliminar el servicio", error);
        swal({
          title: "Error al eliminar el servicio",
          icon: "error",
          timer: 1000,
        });
      }
    }
  }

  return (
    <div className="services-section">
      <div className="buttons">
        <div className="par">
          <select
            name="tipoTratamiento"
            onChange={(e) =>
              handleChangeOptions("tipoTratamiento", e.target.value)
            }
            value={tipoTratamiento}
          >
            <option key="default-tratamiento" value="">
              Tratamiento
            </option>
            {Object.keys(services).map((tipo, index) => (
              <option key={`tipo-${tipo}-${index}`} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          <select
            name="servicio"
            onChange={(e) => handleChangeOptions("servicio", e.target.value)}
            value={servicio}
          >
            <option key="default-servicio" value="">
              Servicio
            </option>
            {tipoTratamiento &&
              services[tipoTratamiento]?.map((serv, index) => (
                <option
                  key={`servicio-${serv.service_name}-${index}`}
                  value={serv.service_name}
                >
                  {serv.service_name}
                </option>
              ))}
          </select>
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
            name="titulo"
            type="text"
            value={titulo}
            onChange={handleInputChangeServicio}
            placeholder="Título"
          />
          <input
            name="profesional"
            type="text"
            value={profesional}
            onChange={handleInputChangeServicio}
            placeholder="Profesional"
          />
          <textarea
            name="text"
            value={text}
            onChange={handleTextAreaChangeServicio}
            placeholder="Descripción"
          />
          <input
            id="precio"
            type="number"
            value={precioNuevo}
            onChange={handleChangePrecio}
            placeholder="Precio"
          />
        </div>
        <div className="par">
          {/*
          <div className="boton">
            <label htmlFor="file-upload-servicio">Subir imagen</label>
            <input
              id="file-upload-servicio"
              type="file"
              accept="image/*"
              onChange={handleImageChangeServicio}
              style={{ display: "none" }}
            />
          </div>
          */}
          <input className="MainBoton" type="submit" value="Guardar" />
          <input
            className="borrar"
            type="button"
            value="Borrar"
            onClick={() => handleDeleteService()}
          />
        </div>
      </form>
      {/*imagePreviewServicio && (
        <div className="image-preview">
          <p>Vista previa:</p>
          <img src={imagePreviewServicio} alt="Vista previa" />
        </div>
      )} */}
    </div>
  );
}
