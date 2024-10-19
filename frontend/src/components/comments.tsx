import { ChangeEvent, FormEvent, useEffect  } from "react";
import "./comments.css";
//import swal from "sweetalert";
//import axios from "../api/axios";
import { useAuth } from "../context/AuthContext"

const isAdmin = true;

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
}


export default function Comments() {
  const [comment, setComment] = useState<Array<Comment>>([]);
  const [comments, setComments] = useState<Array<CommentResponse>>([]);
  const [text, setText] = useState("");
  const { user } = useAuth();


  /* Función para obtener los comentarios del backend
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
          author: user.username || "Anónimo"// Asumiendo que tienes acceso a 'user'
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

  // Maneja el cambio en el campo de texto del comentario
  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
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
    <di className="comments">
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
      <u>
        {comments.map((comment, index) => (
          <l key={index}>
            <strong>{comment.author}</strong> ({comment.date}): <br/> {comment.content}
            {/* Mostrar la respuesta si existe */}
            
            {/* Botón de borrar siempre visible */}
            {isAdmin && (
              <button
                className="delete"
                onClick={() => handleDeleteComment(index)}
              >
                Borrar
              </button>
            )}

