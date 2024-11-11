export interface Author {
    user?: string; // ID del usuario, opcional
    name: string;
  }
  
  export interface Reply {
    author: Author;
    content: string;
    date: Date | string;
  }
  
  export interface Comment {
    _id?: string; // Opcional porque no estará presente al crear un nuevo comentario
    author: Author;
    content: string;
    date: Date | string;
    reply?: Reply;
  }
