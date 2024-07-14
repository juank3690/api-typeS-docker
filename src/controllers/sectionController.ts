import { Request, Response } from 'express';
import { pool } from '../db';
import {z} from 'zod';

/*
modelo de la tabla sections
CREATE TABLE sections(
    id_section serial primary key,
    title_section varchar(50) not null,
    id_user integer not null,
    foreign key (id_user) references users(id_user) on delete cascade on update cascade
);*/

const getSections = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId= req.user.id;
        const result = await pool.query("SELECT * FROM sections WHERE id_user = $1", [userId]);
        if (result.rowCount === 0) {
            return res.status(404).send("Sections not found");
        }
        return res.status(200).send(result.rows);
    }catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

const sectionSchema = z.object({
    title_section: z.string().min(3)
});

type Section = {
    title_section: string;
}

function validateSection(section: Section): boolean {
    try {
        sectionSchema.parse(section);
        return true;
    } catch (error) {
        return false;
    }
}

const createSection = async (req: Request, res: Response): Promise<Response> => {
    const {title_section} = req.body;
    if (!validateSection({title_section})) {
        return res.status(400).send("Invalid section data");
    }
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        const result = await pool.query(
            "INSERT INTO sections (title_section, id_user) VALUES ($1, $2) RETURNING *",
            [title_section, userId]
        );
        return res.status(201).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

const updateSection = async (req: Request, res: Response): Promise<Response> => {
    const {title_section} = req.body;
    const {id_section} = req.params;
    if (!validateSection({title_section})) {
        return res.status(400).send("Invalid section data");
    }
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        // Buscar la sección a actualizar para verificar que pertenece al usuario autenticado
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, userId]);
        if (sectionResult.rowCount === 0) {
            return res.status(404).send("Section not found");
        }
        const result = await pool.query( "UPDATE sections SET title_section = $1 WHERE id_section = $2 RETURNING *", [title_section, id_section]);
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

const deleteSection = async (req: Request, res: Response): Promise<Response> => {
    const {id_section} = req.params;
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        // Buscar la sección a eliminar para verificar que pertenece al usuario autenticado
        const sectionResult = await pool.query("SELECT * FROM sections WHERE id_section = $1 and id_user = $2", [id_section, userId]);
        if (sectionResult.rowCount === 0) {
            return res.status(404).send("Section not found");
        }
        await pool.query("DELETE FROM sections WHERE id_section = $1", [id_section]);
        return res.status(204).send("Section deleted");
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}


export {getSections,createSection,updateSection,deleteSection};