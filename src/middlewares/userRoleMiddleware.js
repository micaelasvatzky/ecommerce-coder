//middleware a nivel endpoint

export const userRoleMiddleware = 
(req, res, next) => {
    const { role } = req.body;
    //validar que el usuario tiene el rol de administrador

    if(role !== "admin") return res.status(403).json({status: "error", error: "Usuario no autorizado"});

    next();
}