import { useState } from "react";
import swal from "sweetalert";
import Dropdown from "../../components/Dropdown";

type Props = {
  horas: string[];
  setHoras: (horas: string[]) => void;
};

const HorasSection: React.FC<Props> = ({ horas, setHoras }) => {
  const [newHora, setNewHora] = useState("");
  const [selectedHora, setSelectedHora] = useState("");
  const [reset, setReset] = useState(false);

  const handleChangeOption = (value: string) => {
    setSelectedHora(value);
    setReset(false);
  };

  function handleChangeHora(event: React.ChangeEvent<HTMLInputElement>) {
    setNewHora(event.target.value);
  }
  const handleSubmitHora = () => {
    if (!newHora) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
      return;
    }

    // Verificar si la nueva hora ya existe
    if (horas.includes(newHora)) {
      swal({
        title: "Esta hora ya está registrada",
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

      setHoras([...horas, newHora]);
      setNewHora("");
    }
  };

  const handleDeleteHora = () => {
    if (!selectedHora) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
      return;
    } else {
      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, tendras que subir la hora de nuevo.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          const updatedHoras = horas.filter((h) => h !== selectedHora);
          setHoras(updatedHoras);
          setNewHora("");
          setSelectedHora("");
          setReset(true);
          swal({
            title: "Hora eliminada",
            icon: "success",
            timer: 1000,
          });
        }
      });
    }
  };

  return (
    <div className="hours-section">
      <div className="buttons">
        <div id="horas" className="par">
          <Dropdown
            label="Horarios"
            options={horas}
            reset={reset}
            onChange={handleChangeOption}
          />
          <input
            type="time"
            placeholder="Agregar"
            value={newHora}
            onChange={handleChangeHora}
          />
        </div>
        <div className="par">
          <input
            type="submit"
            className="MainBoton"
            value="Guardar"
            onClick={handleSubmitHora}
          />
          <input
            type="submit"
            className="borrar"
            value="Borrar"
            onClick={handleDeleteHora}
          />
        </div>
      </div>
    </div>
  );
};

export default HorasSection;
