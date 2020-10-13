import { Router } from "express";
import UserController from "../controller/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get User
router.post("/", [checkJwt], UserController.getOneById);

//Create a new user
router.post("/newUser", UserController.newUser);

//Create a note
router.post("/newNote", [checkJwt], UserController.newNote);

export default router;