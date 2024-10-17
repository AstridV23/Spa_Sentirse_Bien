import { ChangeEvent, useEffect, useState } from "react";
import swal from "sweetalert";

type Media = {
  img: string;
  titulo?: string;
  texto?: string;
};

type NewsSectionProps = {
  news: Media[];
  setNews: (news: Media[]) => void;
};

const NewsSection: React.FC<NewsSectionProps> = ({ news, setNews }) => {
  const [titulo, setTitulo] = useState("");
  const [text, setText] = useState("");
  const [, /*image*/ setImage] = useState<File | null>(null); // image es lo que se debe mandar a la base de datos
  const [imagePreviewNew, setImagePreviewNew] = useState<string | null>(null); // imagePreviewNew es la version URL de image, para poder verla necesitamos string

  useEffect(() => {
    return () => {
      if (imagePreviewNew) {
        URL.revokeObjectURL(imagePreviewNew);
      }
    };
  }, [imagePreviewNew]);

  const handleInputChangeNew = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "titulo") {
      setTitulo(value);
    }
  };

  const handleTextAreaChangeNew = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === "text") {
      setText(value);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewNew(previewUrl);
    }
  };

  const handleSubmitNew = () => {
    if (!titulo || !text || !imagePreviewNew) {
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

      const newNew: Media = {
        img: imagePreviewNew,
        titulo,
        texto: text,
      };

      //                                        // aca se debe cambiar para añadir a la base de datos
      setNews([...news, newNew]);
      setTitulo("");
      setText("");
      setImage(null);
      setImagePreviewNew(null);
    }
  };

  const handleDeleteNew = (index: number) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar esta noticia.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const newNews = news.filter((_, i) => i !== index); // aca se debe cambiar para eliminar de la base de datos
        setNews(newNews);
        swal({
          title: "Noticia eliminada",
          icon: "success",
          timer: 1000,
        });
      }
    });
  };

  return (
    <div className="news-section">
      <div className="element-container">
        {news.map((element, index) => (
          <div className="element" key={index}>
            <div>
              <img src={element.img} alt={element.titulo} />
              <div className="text"></div>
              <h4>{element.titulo}</h4>
              <p>{element.texto}</p>
            </div>
            <button className="delete" onClick={() => handleDeleteNew(index)}>
              Borrar
            </button>
          </div>
        ))}
      </div>
      <form
        className="buttons"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitNew();
        }}
      >
        <div className="par">
          <input
            name="titulo"
            type="text"
            value={titulo}
            onChange={handleInputChangeNew}
            placeholder="Título"
          />
          <textarea
            name="text"
            value={text}
            onChange={handleTextAreaChangeNew}
            placeholder="Descripción"
          />
        </div>
        <div className="par">
          <div className="boton">
            <label htmlFor="file-upload-news">Subir imagen</label>
            <input
              id="file-upload-news"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <input className="MainBoton" type="submit" value="Guardar" />
        </div>
      </form>
      {imagePreviewNew && (
        <div className="image-preview">
          <p>Vista previa:</p>
          <img src={imagePreviewNew} alt="Vista previa" />
        </div>
      )}
    </div>
  );
};

export default NewsSection;
