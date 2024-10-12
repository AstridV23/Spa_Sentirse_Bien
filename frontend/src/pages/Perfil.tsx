import { useEffect, useLayoutEffect, useState } from "react";
import "./Perfil.css";
import React from "react";
import Dropdown from "../components/Dropdown";

type Perfil = {
  names: string;
  surnames: string; 
  username: string;
  email: string;
  phone: string;
  genero: string;
  img: string;
  password: string;
  registro: Date;
  reservas: number;
};
const DataPerfil: Perfil = {
  names: "Julian Ismael",
  surnames: "Codina de Pedro",
  username: "JulianCodina",
  email: "depedrojulianismael@gmail.com",
  phone: "3624242424",
  genero: "Hombre",
  img: "/assets/perfil.jpg",
  password: "StarWars1234",
  registro: new Date("07-09-24"),
  reservas: 3,
};


export default function Perfil() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const[perfil, setPerfil] = useState<Perfil>(DataPerfil);

  const [names, setNames] = useState<string>("");
  const [surnames, setSurnames] = useState<string>("");
  const [usernames, setUsernames] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [genero, setGenero] = useState<string>("");
  const [image, setImage] = useState<string | undefined>();

  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [reset, setReset] = useState(false);

  useEffect(() => {
    setPerfil(DataPerfil)
    setImage(perfil.img)
  }, []);

  const registroString = `${perfil.registro.getDate()}/${
    perfil.registro.getMonth() + 1
  }/${perfil.registro.getFullYear()}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Actualiza el estado con la imagen cargada
      };
      reader.readAsDataURL(file); // Lee el archivo como una URL de datos
    }
  };

  const handleChangeOption = (value: string) => {
    setGenero(value);
    setReset(false);
  };

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
 
if(password1 !== password2){
  swal({
    title: "La contraseña no coincide",
    icon: "warning",
    timer: 1000,
  });
  return;
}else{
      if(!names && !surnames && !email && !phone && !genero && !password1 && !password2 ) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
      return;
    } else {

      swal({
        title: "Cambios Hechos",
        icon: "success",
        timer: 1200,
      });

    setPerfil((prevPerfil) => ({
      ...prevPerfil,
      names: names || prevPerfil.names,
      surnames: surnames || prevPerfil.surnames,
      username: usernames || prevPerfil.username,
      email: email || prevPerfil.email,
      phone: phone || prevPerfil.phone,
      genero: genero || prevPerfil.genero,
      password: password1 || prevPerfil.password
    }));
    setNames("")
    setSurnames("")
    setUsernames("")
    setEmail("")
    setPhone("")
    setGenero("")
    setPassword1("")
    setPassword2("")
    setReset(true);
  }
  }
  };

  return (
    <div className="perfil-page">
      <div className="background-image" />
      <div className="perfil-container">
        <div className="titulo">
          <h1>PERFIL</h1>
          <hr />
        </div>
        <div className="section-container">
          <div className="perfil-section">
            <h3>Mi perfil</h3>
            <div className="tarjetaPerfil">
              <div className="nombres">
              <h2>{perfil.names}</h2><h2>{perfil.surnames}</h2>
              </div>
              <p>{perfil.email}</p>
              <p>@{perfil.username}</p>
              <p>📞 {perfil.phone}</p>
              <p>{perfil.genero}</p>
              <img src={image} alt="Foto" />
              <div className="button">
                <label htmlFor="file-upload" className="MainButton">
                  Cambiar Foto
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <p>Miembro desde: {registroString}</p>
              <p>Reservas: {perfil.reservas}</p>
            </div>
          </div>

          <div className="editperfil-section">
            <h3>Editar información de perfil</h3>
            <div className="tarjetaEditarPerfil">
              <form onSubmit={handleSaveChanges}>
                <div className="par">
                  <input
                    className="textbox"
                    type="text"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    placeholder="Nombre"
                  />
                  <input
                    className="textbox"
                    type="text"
                    value={surnames}
                    onChange={(e) => setSurnames(e.target.value)}
                    placeholder="Apellido"
                  />
                </div>

                <div className="par">
                  <input
                    className="textbox"
                    type="text"
                    value={usernames}
                    onChange={(e) => setUsernames(e.target.value)}
                    placeholder="Usuario"
                  />
                  <input
                    className="textbox"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                  />
                </div>

                <div className="par">
                  <input
                    className="textbox"
                    type="password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    placeholder="Nueva contraseña"
                  />
                  <input
                    className="textbox"
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirmar contraseña"
                  />
                </div>

                <div className="par">
                  <Dropdown
                    label={"Genero"}
                    options={["Hombre", "Mujer", "Otro"]}
                    reset={reset}
                    onChange={handleChangeOption}
                  />
                  <input
                    className="textbox"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Número de Telefono"
                  />
                </div>
                <button className="MainButton" type="submit">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}