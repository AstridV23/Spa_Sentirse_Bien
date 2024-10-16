import { useLayoutEffect, useState } from "react";
import "./Gallery.css";

type Media = {
  img: string;
  titulo?: string;
  texto?: string;
};
const news: Media[] = [
  {
    img: "../assets/noticia1.jpeg",
    titulo: "Titulo noticia 1",
    texto: "Prueba noticia 1",
  },
  {
    img: "../assets/noticia1.jpeg",
    titulo: "Titulo noticia 2",
    texto: "Prueba noticia 2",
  },
];
const photos: Media[] = [
  {
    img: "../assets/masaje-antiestres.jpg",
  },
  {
    img: "../assets/temp.png",
  },
  {
    img: "../assets/Dermohealth.jpg",
  },
  {
    img: "../assets/masaje-antiestres.jpg",
  },
  {
    img: "../assets/temp.png",
  },
  {
    img: "../assets/Dermohealth.jpg",
  },
];

export default function Gallery() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      <div className="background-image" />
      <div className="gallery-container">
        <div className="titulo">
          <h1>GALERÍA</h1>
          <hr className="linea-gallery" />
        </div>
        <div className="gallery-types">
          <div className="gallery-section">
            <h3>Noticias</h3>
            <div id="noticias" className="element-container">
              {news.map((element, index) => (
                <div className="element" key={index}>
                  <img src={element.img} />
                  <div className="text">
                    <h4>{element.titulo}</h4>
                    <p>{element.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="gallery-section">
            <hr className="linea-gallery" />
            <h3>Fotos</h3>
            <div className="element-container">
              {photos.map((element, index) => (
                <div className="element-img" key={index}>
                  <img
                    src={element.img}
                    alt="gallery"
                    onClick={() => handleImageClick(element.img)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              ⨉
            </span>
            <img src={selectedImage} alt="Modal" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}
