import express from "express";
import { Authcontroller } from "../controllers/auth";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createPoll, getActivePolls, voteOnPoll, getPollResults } from "../controllers/pollController";
import { validatePollCreation, validateVote } from "../middlewares/pollValidateMiddleware";

const injectRoutes = () => {
    const router = express.Router();

    // User authentication routes
    router.post('/auth/login', Authcontroller.login);
    router.post('/auth/register', Authcontroller.register);

    // Poll routes
    router.post('/polls', authMiddleware,validatePollCreation, createPoll);
    router.get('/polls', authMiddleware, getActivePolls);
    router.post('/polls/:pollId/vote', authMiddleware, validateVote, voteOnPoll);
    router.get('/polls/:pollId/results', authMiddleware, getPollResults);

    return router;
}

export default injectRoutes;