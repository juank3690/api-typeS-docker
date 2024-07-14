import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {z} from "zod";
import { pool } from "../db";

const userSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    email: z.string().email(),
});

interface UserInterface {
    username?: string;
    password: string;
    email: string;
}


const register = async (req: Request, res: Response):Promise<Response> => {
    const user: UserInterface = req.body;
    try {
        const isValid = userSchema.safeParse(req.body);
        if (!isValid.success) {
            return res.status(400).send(isValid.error.errors);
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        const result = await pool.query(
            "INSERT INTO users (name_user, user_password, user_email) VALUES ($1, $2, $3) RETURNING id_user, name_user, user_email",
            [user.username, hashedPassword, user.email]
        );
        if (result.rowCount === 0) {
            return res.status(400).send("The user could not be created");
        }

        return res.status(201).send(result.rows[0]);
    } catch (error:any) {
        if (error.code=="23505") {
            return res.status(400).send("The user already exists");
        }
        // otros errores
        return res.status(500).send("Internal Server Error");
    }
};

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
    

const login = async (req: Request, res: Response):Promise<Response> => {
    const { email, password } = req.body;
    try {
        const isValid = loginSchema.safeParse(req.body);
        if (!isValid.success) {
            return res.status(400).send(isValid.error.errors);
        }
        // Buscar el usuario en la base de datos
        const result = await pool.query(
            "SELECT * FROM users WHERE user_email = $1",
            [email]
        );
        if (result.rowCount === 0) {
            return res.status(400).send("The user does not exist");
        }
        // Extraer el usuario de la base de datos
        const user = result.rows[0];
        // console.log(user);

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compareSync(password, user.user_password);
        if (!isPasswordValid) {
            return res.status(400).send("The password is invalid");
        }
        // Crear el token
        const token = jwt.sign({ id: user.id_user, username: user.name_user, email: user.user_email }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        //Configurar la cookie
        res.cookie("token", token, {
            httpOnly: true, // La cookie no puede ser leída por JavaScript
            secure: process.env.NODE_ENV === "production", // La cookie solo se envía por HTTPS en producción
        });
        //Enviar id y email del usuario
        return res.status(200).send({ id: user.id_user, email: user.user_email });
    } catch (error:any) {
        return res.status(500).send("Internal Server Error");
    }
}

const logout = (req:Request, res: Response) => {
    res.clearCookie("token");
    return res.send("Logged out");
}


export { register,login,logout };