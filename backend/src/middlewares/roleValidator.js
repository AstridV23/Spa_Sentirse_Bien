const isAdmin = (req, res, next) => {
    if ( req.user && req.user.role.includes("admin")) {
        return next()
    }

    return res.status(403).json({message: "Acceso denegado. Se requieren permisos de administrador."})
}

const isProfesional = (req, res, next) => {
    if (req.user && req.user.role.include("profesional")) {
        return next()
    }

    return res.status(403).json({message: "Acceso denegado. Se requieren permisos de profesional o administrador."})
}

const isSecretario = (req, res, next) => {
    if (req.user && req.user.role.include("secretario")) {
        return next()
    }

    return res.status(403).json({message: "Acceso denegado. Se requieren permisos de secretario o administrador."})
}