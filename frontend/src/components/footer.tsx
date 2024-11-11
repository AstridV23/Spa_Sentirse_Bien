import "./footer.css";
import GoogleMap from "./googleMap";
import GoogleMapsWrapper from "./GoogleMapsWrapper";
import { usePopUp } from "./PopUpContext";
import { FormPopUp } from "./FormPopUp";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const { openPopUp } = usePopUp();

  const location = useLocation();
  const isOnSpecificPage =
    location.pathname === "/admin" || location.pathname.startsWith("/informe/");

  return (
    <div>
      {!isOnSpecificPage && (
        <div className="footer" id="contact">
          <div className="contact">
            <div className="par">
              <div className="contactInfo">
                <h3>CONTÁCTANOS</h3>
                <div className="item">
                  <img src="../assets/ubicacion.png" alt="Ubicacion" />
                  <p>C. French 414, H3506 Resistencia, Chaco</p>
                </div>
                <div className="item">
                  <img src="../assets/gmail.png" alt="Gmail" />
                  <p>correoelectronico@email.com</p>
                </div>
                <div className="item">
                  <img src="../assets/whatsapp.png" alt="Whatsapp" />
                  <p>+54 3624242424</p>
                </div>
                <div className="item">
                  <img src="../assets/facebook.png" alt="facebook" />
                  <p>@Sentirse.bien</p>
                </div>
              </div>
              <div>
                <GoogleMapsWrapper>
                  <GoogleMap />
                </GoogleMapsWrapper>
              </div>
            </div>
            <div className="par2">
              <div className="itemEmpleo">
                <h3>DESARROLLADORES</h3>
                <a href="https://github.com/JulianCodina">Julian Codina</a>
                <a href="https://github.com/AstridV23">Astrid Viñuela</a>
                <a href="https://github.com/exequielcabrera98">
                  Exequiel Cabrera
                </a>
              </div>
              <div className="itemEmpleo">
                <h3>EMPLEO</h3>
                <button onClick={() => openPopUp("form")}>
                  Envianos tu CV
                </button>
              </div>
            </div>
          </div>
          <FormPopUp />
        </div>
      )}
    </div>
  );
}
