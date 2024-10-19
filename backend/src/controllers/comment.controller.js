import Comment from '../models/comment_model.js'

export const createComment = async (req, res) => {
    try {
        const { content, author } = req.body;

        const newComment = new Comment({
            content,
            author,
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario.', error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try{
        const comment = await Comment.findByIdAndDelete(req.params.id)

        if (!comment) return res.status(404).json({message:"Cometntario no encontrado."})

        return res.status(204).json({message: "Comentario eliminado con éxito."})
    }
    catch(error) {
        res.status(500).json({ message: 'Error al eliminar el comentario.', error });
    }
}

export const getComments = async (req, res) => {
    debugger;

    try {
        const comments = await Comment.find().sort({ createdAt: -1 });

        const formattedComments = comments.map(comment => ({
            ...comment.toObject(),
            date: new Date(comment.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        }));

        res.json(formattedComments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los comentarios.', error });
    }
}