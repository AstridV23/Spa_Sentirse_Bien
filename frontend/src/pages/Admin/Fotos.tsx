import { useEffect, useState } from "react";
import swal from "sweetalert";

type Media = {
  img: string;
};

type PhotosSectionProps = {
  photos: Media[];
  setPhotos: (photos: Media[]) => void;
};

const PhotosSection: React.FC<PhotosSectionProps> = ({ photos, setPhotos }) => {
  const [, /*image*/ setImage] = useState<File | null>(null); // image es lo que se debe mandar a la base de datos
  const [imagePreviewPhoto, setImagePreviewPhoto] = useState<string | null>(
    null
  ); // imagePreview es la version URL de image, para poder verla necesitamos string

  useEffect(() => {
    return () => {
      if (imagePreviewPhoto) {
        URL.revokeObjectURL(imagePreviewPhoto);
      }
    };
  }, [imagePreviewPhoto]);

  const handleImageChangePhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl2 = URL.createObjectURL(file);
      setImagePreviewPhoto(previewUrl2);
    }
  };

  const handleSubmitPhoto = () => {
    if (!imagePreviewPhoto) {
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

      const newPhotos: Media = {
        img: imagePreviewPhoto,
      };

      //                                        // aca se debe cambiar para añadir a la base de datos
      setPhotos([...photos, newPhotos]);
      setImage(null);
      setImagePreviewPhoto(null);
    }
  };

  const handleDeletePhoto = (index: number) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, tendras que subir la foto de nuevo.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const newPhotos = photos.filter((_, i) => i !== index); // aca se debe cambiar para eliminar de la base de datos
        setPhotos(newPhotos);
        swal({
          title: "Foto eliminada",
          icon: "success",
          timer: 1000,
        });
      }
    });
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-section">
      <div className="element-container">
        {photos.map((element, index) => (
          <div className="element-photo" key={index}>
            <div className="element-img">
              <img
                src={element.img}
                onClick={() => handleImageClick(element.img)}
              />
            </div>
            <button className="delete" onClick={() => handleDeletePhoto(index)}>
              Borrar
            </button>
          </div>
        ))}
      </div>
      <form
        className="buttons"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitPhoto();
        }}
      >
        <div className="boton">
          <label htmlFor="file-upload-photo">Subir imagen</label>
          <input
            id="file-upload-photo"
            type="file"
            accept="image/*"
            onChange={handleImageChangePhoto}
            style={{ display: "none" }}
          />
        </div>
        <input className="MainBoton" type="submit" value="Guardar" />
      </form>
      {imagePreviewPhoto && (
        <div className="image-preview">
          <p>Vista previa:</p>
          <img src={imagePreviewPhoto} alt="Vista previa" />
        </div>
      )}

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
};

export default PhotosSection;
