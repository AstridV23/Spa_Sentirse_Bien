import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import "./comments.css";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Simulamos un usuario logueado o no logueado con una constante
//const loggedInUser: string | null = "Anónimo"; // Cambiar a `null` si no está logueado

// Simulando que el usuario es admin
const isAdmin = true; // Cambia esto a false para simular que el usuario no es admin

type Author = {
  name: string,
  user?: string | null,
}

type Comment = {
  author: Author,
  content: string;
  date: string;
  reply?: {
    author: Author,
    text: string;
    date: string;
  };
};

export default function Comments() {
  const { getCurrentUser } = useAuth(); // Obtener el usuario desde el contexto
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState(""); 
  const [replyIndex, setReplyIndex] = useState<number | null>(null); 

  const currentUser = getCurrentUser();

  // Función para obtener los comentarios del backend
  async function fetchComments() {
    try {
      const response = await axios.get("/comment");
      
      setComments(response.data);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
    }
  }

    // Llamar a la función fetchComments cuando el componente se monte
    useEffect(() => {
      fetchComments();
    }, []);

  // Maneja el envío de un nuevo comentario
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    if (text.trim() !== "") {
      const newComment: Comment = {
        author: {
          name: currentUser?.name || "Anónimo",
          user: currentUser?.id || null
        }, 
        content: text,
        date: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
  
      try {
        // Enviar el nuevo comentario al backend
        const response = await axios.post("/comment", newComment, {withCredentials: true});
        
        setComments([response.data, ...comments]); // Agregar el comentario al inicio
        setText(""); // Limpiar el campo de texto
  
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
      }
    }
  }
  

  // Maneja el cambio en el campo de texto del comentario
  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  // Maneja el envío de una respuesta a un comentario
  function handleReplySubmit(event: FormEvent<HTMLFormElement>, index: number) {
    event.preventDefault();

    if (replyText.trim() !== "") {
      const updatedComments = [...comments];
      const newReply = {
        author: {
          name: currentUser?.name || "Anónimo",
        }, // Usar el nombre de usuario del contexto
        text: replyText,
        date: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };

      updatedComments[index].reply = newReply; // Solo se permite una respuesta
      setComments(updatedComments);
      setReplyText(""); // Limpiar el campo de respuesta
      setReplyIndex(null); // Cerrar el campo de respuesta
    }
  }

  // Maneja la eliminación de un comentario
  function handleDeleteComment(index: number) {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este comentario.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const updatedComments = comments.filter((_, i) => i !== index); // aca se debe borrar el comentario de la base de datos y volver a definirlo en una const
        setComments(updatedComments);
        swal("Comentario eliminado con éxito", {
          icon: "success",
          timer: 1500,
        });
      }
    });
  }

  return (
    <div className="comments">
      <h1>Comentarios</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">
          <input
            className="textbox"
            id="text"
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Escribe tu comentario"
          />
        </label>
        <button className="MainButton" type="submit">
          Comentar
        </button>
      </form>

      <h3>Últimos realizados</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <strong>{comment.author.name}</strong> ({comment.date}): <br/> {comment.content}
            {/* Mostrar la respuesta si existe */}
            {comment.reply && (
              <ul>
                <li className="respuesta">
                  <strong>{comment.reply.author.name}</strong> ({comment.reply.date}):{" "}
                  {comment.reply.text}
                </li>
              </ul>
            )}
            {/* Mostrar el campo de respuesta si aún no hay respuesta */}
            {!comment.reply && isAdmin && (
              <>
                {replyIndex === index ? (
                  <form onSubmit={(e) => handleReplySubmit(e, index)}>
                    <input
                      className="textbox"
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escribe una respuesta"
                    />
                    <button className="replyButton" type="submit">
                      Responder
                    </button>
                  </form>
                ) : (
                  <button
                    className="replyButton"
                    onClick={() => setReplyIndex(index)}
                  >
                    Responder
                  </button>
                )}
              </>
            )}
            {/* Botón de borrar siempre visible */}
            {isAdmin && (
              <button
                className="delete"
                onClick={() => handleDeleteComment(index)}
              >
                Borrar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}