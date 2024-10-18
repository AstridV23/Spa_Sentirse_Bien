import { ChangeEvent, FormEvent, useState /*useEffect*/ } from "react";
import "./comments.css";
import swal from "sweetalert";
// import axios from "../api/axios";
import { FaStar } from "react-icons/fa";

type User = {
  _id: string;
  username: string;
  avatar: string;
  reservas: number;
};

type Comment = {
  _id: string;
  author?: User;
  content: string;
  date: string;
  rating: number;
};

const commentFalsos: Comment[] = [
  {
    _id: "1",
    author: {
      _id: "user1",
      username: "PedritoSanchez",
      avatar: "/assets/whatsapp.png",
      reservas: 1,
    },
    content:
      "¡Increíble experiencia! El servicio fue excepcional, la comida deliciosa y el ambiente acogedor. Me encantó la atención personalizada y los detalles cuidadosamente pensados. Sin duda, volveré pronto y lo recomendaré a todos mis amigos. Una joya culinaria que no se puede perder. ¡5 estrellas!",
    date: "2024-02-14",
    rating: 4,
  },
  {
    _id: "2",
    content: "LO ODIO, NO ME GUSTA, NO VUELVO",
    date: "2024-02-15",
    rating: 2,
  },
  {
    _id: "3",
    author: {
      _id: "user4",
      username: "PatriciaFerrana",
      avatar: "/assets/Velaslim.jpg",
      reservas: 5,
    },
    content: "Este es un comentario de prueba",
    date: "2024-02-14",
    rating: 4,
  },
  {
    _id: "4",
    author: {
      _id: "user5",
      username: "PatriciaBulrrich",
      avatar: "/assets/Velaslim.jpg",
      reservas: 5,
    },
    content: "Este es un comentario de prueba",
    date: "2024-02-14",
    rating: 4,
  },
  {
    _id: "5",
    author: {
      _id: "user6",
      username: "OstiasTio",
      avatar: "/assets/Fondo1.jpg",
      reservas: 2,
    },
    content: "Este es un comentario de prueba",
    date: "2024-02-14",
    rating: 3,
  },
];

type CommentsProps = {
  mode: "home" | "admin";
};

export default function Comments({ mode }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(commentFalsos);
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number>(0);

  const isLoggedIn = false;
  const user: User = {
    _id: "23",
    username: "JuanCarlos",
    avatar: "/assets/Ultracavitacion.jpg",
    reservas: 3,
  };

  /*
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
  */

  // Maneja el envío de un nuevo comentario
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (text.trim() !== "" && rating > 0) {
      /*
      try {
        const response = await axios.post(
          "/comment",
          { content: text, rating },
          { withCredentials: true }
        );

        const newComment: Comment = {
          _id: response.data._id,
          author: response.data.author,
          content: response.data.content,
          date: response.data.date,
          rating: response.data.rating,
        };

        setComments([newComment, ...comments]);
        setText("");
        setRating(0);
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
      }
        */
      swal("Comentario enviado con éxito", {
        icon: "success",
        timer: 1000,
      });
      console.log(`comentario: ${text}, rating: ${rating}`);
      setText("");
      setRating(0);
    }
  }

  // Maneja el cambio en el campo de texto del comentario
  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const text = event.target.value.slice(0, 250);
    setText(text);
    if (event.target.value.length > 250) {
      swal("El comentario no puede tener más de 250 caracteres", {
        icon: "error",
        timer: 2500,
      });
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

  // Nuevo componente para las estrellas
  const StarRating = ({
    rating,
    onRating,
  }: {
    rating: number;
    onRating: (index: number) => void;
  }) => {
    return (
      <div>
        {[...Array(5)].map((_star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= rating ? "on" : "off"}
              onClick={() => onRating(index)}
            >
              <FaStar />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={mode === "home" ? "comments-home" : "comments-admin"}>
      <div className="comments">
        {mode === "home" && (
          <>
            <h1>Opiniones</h1>
            <form onSubmit={handleSubmit}>
              <div id="encabezado" className="par">
                <div id="user" className="par">
                  {isLoggedIn ? (
                    <>
                      <img className="avatar" src={user.avatar} alt="avatar" />
                      <div>
                        <h4>{user.username}</h4>
                        <p>{user.reservas} reservas</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        className="avatar"
                        src="/assets/perfil.jpg"
                        alt="avatar"
                      />
                      <div>
                        <h4>Usuario</h4>
                        <p>Anonimo</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div id="inputs">
                <label htmlFor="text">
                  <textarea
                    className="textbox"
                    id="text"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Escribe tu comentario"
                    maxLength={250}
                  />
                </label>
                <p
                  style={{
                    fontSize: "12px",
                    color: text.length === 250 ? "var(--rojo)" : "var(--gris)",
                  }}
                >
                  {text.length}/250 caracteres
                </p>
                <div id="buttons" className="par">
                  <div className="star-rating">
                    <StarRating
                      rating={rating}
                      onRating={(index) => setRating(index)}
                    />
                  </div>
                  <button className="MainButton" type="submit">
                    Comentar
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
        <h3>Últimos realizados</h3>
        {comments.length === 0 ? (
          <p style={{ color: "var(--gris)" }}>No hay comentarios todavía</p>
        ) : (
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <div id="comentario" className="par">
                  <div id="encabezado" className="par">
                    <div className="comment">
                      <div id="user" className="par">
                        {comment.author ? (
                          <>
                            <img
                              className="avatar"
                              src={comment.author.avatar}
                              alt="avatar"
                            />
                            <div>
                              <h4>{comment.author.username}</h4>
                              <p>{comment.author.reservas} reservas</p>
                              <p>{comment.date}</p>
                              <div className="star-rating">
                                <StarRating
                                  rating={comment.rating}
                                  onRating={() => {}}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              className="avatar"
                              src="/assets/perfil.jpg"
                              alt="avatar"
                            />
                            <div>
                              <h4>Usuario</h4>
                              <p>Anónimo</p>
                              <p>{comment.date}</p>
                              <div className="star-rating">
                                <StarRating
                                  rating={comment.rating}
                                  onRating={() => {}}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {mode === "admin" && (
                        <button
                          className="delete"
                          onClick={() => handleDeleteComment(index)}
                        >
                          Borrar
                        </button>
                      )}
                    </div>
                  </div>
                  <div id="content">
                    <p>{comment.content}</p>
                  </div>
                </div>
              </li>
            ))}
            {/*comments.map((comment, index) => (
          <li key={index}>
            <strong>{comment.author?.username || "Anónimo"}</strong> (
            {comment.date}): <br />
            <StarRating rating={comment.rating} onRating={() => {}} />
            {comment.content}
            {mode === "admin" && (
              <button
                className="delete"
                onClick={() => handleDeleteComment(index)}
              >
                Borrar
              </button>
            )}
          </li>
        ))*/}
          </ul>
        )}
      </div>
    </div>
  );
}
