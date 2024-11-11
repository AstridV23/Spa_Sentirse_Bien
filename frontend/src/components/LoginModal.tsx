import swal from "sweetalert";
import "./LoginModal.css";

//login pup up

export default function LoginModal() {
  swal({
    title: "Iniciar Sesión",
    text: "Ingresa tus credenciales para continuar.",
    content: {
      element: "div",
      attributes: {
        innerHTML: `
            <div>
              <input id="swal-input-email" class="swal-content__input" placeholder="Correo electrónico" type="email">
              <br>
              <input id="swal-input-password" class="swal-content__input" placeholder="Contraseña" type="password">
            </div>
            <div class="swal-footer">
              <a href="/registro" class="register-link">¿No tienes cuenta? Regístrate aquí</a>
            </div>
          `,
      },
    },
    buttons: {
      cancel: {
        text: "Cancelar",
        visible: true,
        className: "", // O puedes añadir otra clase CSS personalizada
        closeModal: true,
      },
      confirm: {
        text: "Iniciar Sesión",
        closeModal: false,
        className: "swal-button--custom", // Clase personalizada para cambiar el color del botón
      },
    },
    className: "swal-title-custom", // Clase personalizada para cambiar el color del título
  }).then((value) => {
    if (value) {
      const email = (
        document.getElementById("swal-input-email") as HTMLInputElement
      ).value;
      const password = (
        document.getElementById("swal-input-password") as HTMLInputElement
      ).value;

      if (email && password) {
        swal("Sesión iniciada", "Has iniciado sesión correctamente", "success");
      } else {
        swal("Error", "Por favor, ingresa ambos campos.", "error");
      }
    }
  });
}
