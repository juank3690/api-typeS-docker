/* Modelo de la tabla users
create table users (
    id_user serial primary key,
    name_user varchar(50) not null,
    user_password varchar(255) not null,
    user_email varchar(50) not null unique
);
*/

import { Request, Response } from "express";
import { pool } from "../db";
import { z } from "zod";
import jwt from "jsonwebtoken";



const userSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    email: z.string().email(),
});

type User = z.infer<typeof userSchema>;


const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        const result = await pool.query("SELECT id_user,name_user,user_email FROM users WHERE id_user = $1", [userId]);
        if (result.rowCount === 0) {
            return res.status(404).send("User not found");
        }
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, email } = req.body as User;
    if (!userSchema.safeParse(req.body).success) {
        return res.status(400).send("Invalid user data");
    }
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        const result = await pool.query(
            "UPDATE users SET name_user = $1, user_password = $2, user_email = $3 WHERE id_user = $4 RETURNING *",
            [username, password, email, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).send("User not found");
        }
        //Cambiar el token
        const token = jwt.sign({ id: userId, username, email }, process.env.JWT_SECRET as string, {
            expiresIn: "1h"
        });

        res.clearCookie("token");
        res.cookie("token", token, { httpOnly: true ,
            secure: process.env.NODE_ENV === "production",
        });
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

const deleteUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        const result = await pool.query("DELETE FROM users WHERE id_user = $1 RETURNING *", [userId]);
        if (result.rowCount === 0) {
            return res.status(404).send("User not found");
        }
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export { getUserProfile, updateUserProfile,deleteUserProfile };

