import Comment from '../models/comment_model.js'

export const createComment = async (req, res) => {
    debugger;
    try {
        const { content, reply, user } = req.body;
        const author = {
            user: req.user,
            name: req.user,
        };

        const newComment = new Comment({
            author: user.name,
            content,
            reply: reply || null,      
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario.', error });
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
        const comments = await Comment.find().sort({ date: -1 }).populate('author.user', 'username');

        const formattedComments = comments.map(comment => ({
            ...comment.toObject(),
            date: comment.date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) // Formato DD/MM/AAAA
        }));

        res.json(formattedComments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los comentarios.', error });
    }
}