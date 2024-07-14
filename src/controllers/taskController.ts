import { Request,Response } from "express";
import { pool } from "../db";
import {z} from 'zod';
import {marked} from 'marked';
/* modelo de la card o tarea
CREATE TABLE tasks(
    id_task serial primary key,
    title_task varchar(50) not null,
    description_task TEXT not null,
    id_section integer not null,
    foreign key (id_section) references sections(id_section) on delete cascade on update cascade
);
*/



const getTask = async (req: Request, res: Response): Promise<Response> => {
    const {id_task} = req.params;
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        const result = await pool.query("SELECT * FROM tasks WHERE id_task = $1 AND id_section in (SELECT id_section FROM sections WHERE id_user = $2)", [id_task, userId]);
        if (result.rowCount === 0) {
            return res.status(404).send("Task not found");
        }
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}


const getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId= req.user.id;
        const result = await pool.query("SELECT * FROM tasks WHERE id_section in (SELECT id_section FROM sections WHERE id_user = $1)", [userId]);
        if (result.rowCount === 0) {
            return res.status(404).send("Tasks not found");
        }
        return res.status(200).send(result.rows);
    }catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

const taskSchema = z.object({
    title_task: z.string().min(3),
    description_task: z.string().min(3).optional(),
    id_section: z.string().regex(/^\d+$/)
});

type Task = {
    title_task: string;
    description_task?: string;
    id_section: number;
}

function validateTask(task: Task): boolean {
    try {
        taskSchema.parse(task);
        return true;
    } catch (error) {
        return false;
    }
}

const createTask = async (req: Request, res: Response): Promise<Response> => {
    const {title_task, description_task, id_section} = req.body;
    // console.log(title_task, description_task, id_section);
    if (!validateTask({title_task, description_task, id_section})) {
        return res.status(400).send("Invalid task data");
    }
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        //Buscar si la sección pertenece al usuario
        const section = await pool.query("SELECT * FROM sections WHERE id_section = $1 AND id_user = $2", [id_section, userId]);
        if (section.rowCount === 0) {
            return res.status(404).send("Section not found or does not belong to the user");
        }

        // SI la descripción de la tarea no es undefined
        if (description_task!==undefined){
            const result = await pool.query(
                "INSERT INTO tasks (title_task, description_task, id_section) VALUES ($1, $2, $3) RETURNING *",
                [title_task, description_task, id_section]
            );
            return res.status(201).send(result.rows[0]);
        }else{
            const result = await pool.query(
                "INSERT INTO tasks (title_task, id_section) VALUES ($1, $2) RETURNING *",
                [title_task, id_section]
            );
            return res.status(201).send(result.rows[0]);
        }        
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}


const updateTask = async (req: Request, res: Response): Promise<Response> => {
    const {title_task, description_task, id_section} = req.body;
    const {id_task} = req.params;
    if (!validateTask({title_task, description_task, id_section})) {
        return res.status(400).send("Invalid task data");
    }
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        // Buscar la tarea a actualizar para verificar que pertenece al usuario autenticado
        const taskResult = await pool.query("SELECT * FROM tasks WHERE id_task = $1 and id_section in (SELECT id_section FROM sections WHERE id_user = $2)", [id_task, userId]);
        if (taskResult.rowCount === 0) {
            return res.status(404).send("Task not found");
        }
        //Buscar si la nueva sección pertenece al usuario
        const section = await pool.query("SELECT * FROM sections WHERE id_section = $1 AND id_user = $2", [id_section, userId]);
        if (section.rowCount === 0) {
            return res.status(404).send("Section not found or does not belong to the user");
        }

        const result = await pool.query(
            "UPDATE tasks SET title_task = $1, description_task = $2, id_section = $3 WHERE id_task = $4 RETURNING *",
            [title_task, description_task, id_section, id_task]
        );
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}


const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    const {id_task} = req.params;
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const userId = req.user.id;
        // Buscar la tarea a eliminar para verificar que pertenece al usuario autenticado
        const taskResult = await pool.query("SELECT * FROM tasks WHERE id_task = $1 and id_section in (SELECT id_section FROM sections WHERE id_user = $2)", [id_task, userId]);
        if (taskResult.rowCount === 0) {
            return res.status(404).send("Task not found");
        }
        await pool.query("DELETE FROM tasks WHERE id_task = $1", [id_task]);
        return res.status(204).send();
    } catch (error) {
        // console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export {getAllTasks,createTask,updateTask,deleteTask,getTask};