import express from "express";
import {deleteUser, getUsers, signin, signup} from "../controllers/userController.js";
const router = express.Router();
router.post(`/signin`,signin);
router.post(`/signup`,signup);
router.get(`/`,getUsers);
router.delete(`/:id`,deleteUser);

export default router;