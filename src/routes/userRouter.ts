import { Router } from "express";
import authMiddleware from "../middleware/authMiddlware";
import { getUserProfile,updateUserProfile,deleteUserProfile } from "../controllers/userController";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/user/profile", getUserProfile);
userRouter.patch("/user/profile", updateUserProfile);
userRouter.delete("/user/profile", deleteUserProfile);


export default userRouter;