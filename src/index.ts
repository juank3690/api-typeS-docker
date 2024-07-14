import express from "express";
import {PORT} from "./config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import sectionRouter from "./routes/sectionRouter";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
import { Request, Response } from "express";
console.clear();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
    res.send("Kanban API");
});

app.use("/api",authRouter);
app.use("/api",sectionRouter);
app.use("/api",taskRouter);
app.use("/api",userRouter);

// // Middleware para manejar rutas no encontradas
// app.use((_: Request, res: Response) => {
//     res.status(404).send("Path not found");
// });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
