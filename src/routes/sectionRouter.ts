import { Router } from "express";
import authMiddleware from "../middleware/authMiddlware";
import { createSection, getSections,updateSection,deleteSection } from "../controllers/sectionController";

const sectionRouter = Router();

sectionRouter.use(authMiddleware);
sectionRouter.get("/sections", getSections);
sectionRouter.post("/sections",createSection);
sectionRouter.put("/sections/:id_section",updateSection);
sectionRouter.delete("/sections/:id_section",deleteSection);

export default sectionRouter;