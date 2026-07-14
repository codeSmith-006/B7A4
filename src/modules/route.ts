import { Router } from "express";

// router 
const router = Router()

// auth route
router.use("/auth", authRoutes)