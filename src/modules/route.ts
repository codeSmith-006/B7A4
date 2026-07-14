import { Router } from "express";
import { authRoutes } from "./Auth/route";

// router 
const router = Router()

// auth route
router.use("/auth", authRoutes)