import { /*ChangeEvent,*/ FormEvent, useEffect, useState } from "react";
import "./comments.css";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

type Comment = {
  author: string;
  content: string;
};

type CommentResponse = {
  _id: string;
  author: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Props = {
  mode: string;
};

export default function Comments({ mode }: Props) {
  const [comment, setComment] = useState<Array<Comment>>([]);
  const [comments, setComments] = useState<Array<CommentResponse>>([]);
  const [text, setText] = useState("");
  const { user } = useAuth();

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
      try {
        const response = await axios.post("/comment", {
          content: text.trim(),
          author: user.username || "Anónimo", // Asumiendo que tienes acceso a 'user'
        });

        const newComment: Comment = {
          author: user.username,
          content: response.data.content,
        };

        setComment([newComment, ...comment]);
        setText("");
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
      }

      swal("Comentario enviado con éxito", {
        icon: "success",
        timer: 1000,
      });
      console.log(`comentario: ${text}`);
      setText("");
    }
  }
  /*
  // Maneja el cambio en el campo de texto del comentario
  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }*/

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
      <div className={`comments-${mode}`}>
        {mode === "home" && (
          <>
            <h1>Comentarios</h1>
            <form onSubmit={handleSubmit}>
              <div id="inputs">
                <label htmlFor="text">
                  <textarea
                    className="textbox"
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe tu comentario"
                  />
                </label>
              </div>
              <div id="buttons">
                <button className="MainButton" type="submit">
                  Comentar
                </button>
              </div>
            </form>
          </>
        )}
        <h3>Últimos realizados</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index} id="comentario">
              <div id="user" className="par">
                <img src="/assets/perfil.jpg" alt="Avatar" className="avatar" />
                <div id="content">
                  <h4>{comment.author}</h4>
                  <p>{comment.date}</p>
                  <p className="content">{comment.content}</p>
                </div>
              </div>
              {mode === "admin" && (
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
    </div>
  );
}
