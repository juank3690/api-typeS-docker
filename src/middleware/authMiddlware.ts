import { JwtPayload, Secret } from "jsonwebtoken";
import e, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// Extiende el espacio de nombres global de TypeScript para incluir una definición personalizada
declare global {
    // Extiende el espacio de nombres 'Express' de Express.js
    namespace Express {
        // Extiende la interfaz 'Request' de Express para incluir una propiedad opcional 'user' de tipo JwtPayload
        interface Request {
            user?: JwtPayload; // Propiedad opcional que almacenará los datos del usuario autenticado decodificados del token JWT
        }
    }
}


const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Obtener el token de la cookie (asegúrate de configurar correctamente las cookies en Express)
        const token = req.cookies.token;

        if (!token) {
            res.status(401).send("Unauthorized"); // Enviar respuesta 401 si no hay token
            return;
        }

        if (!process.env.JWT_SECRET) {
            res.status(500).send("Internal Server Error"); // Enviar respuesta 500 si no hay secret
            return;
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
        // console.log(token, decoded)

        // Asignar los datos del usuario decodificados al objeto req para usar en rutas posteriores
        req.user = decoded;
        // console.log("User authenticated:", decoded);
        // console.log(req.user.id);

        // Llama a next() para pasar al siguiente middleware o ruta
        next();
    } catch (error:any) {
        res.status(401).send("Unauthorized"); // Enviar respuesta 401 en caso de error de autenticación
    }
}

export default authMiddleware;
