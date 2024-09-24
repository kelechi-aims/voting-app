import express from "express";
import { Authcontroller } from "../controllers/auth";

const injectRoutes = () => {
    const router = express.Router();

    router.post('/auth/login', Authcontroller.login);
    router.post('/auth/register', Authcontroller.register);

    return router;
}

export default injectRoutes;