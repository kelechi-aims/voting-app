import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import RedisStore from 'connect-redis';
import dbClient from './utils/db';
import cookieParser from 'cookie-parser';
import injectRoutes from './routes/index';
import redisClient from './utils/redis';
import session from 'express-session';  
import jwt from 'jsonwebtoken'; 
import path from 'path';

dotenv.config();
dbClient();
const app = express();

app.use(express.json());
app.use(cookieParser());
 


app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['XXXXXXXXXXXXXXXXXXXXX'],
    credentials: true
}));

// Serve static files from the 'public' folder inside 'src'
const staticPath = path.join(__dirname, 'public');  // Adjusted path
console.log(`Serving static files from: ${staticPath}`);
app.use(express.static(staticPath));

app.use('/api', injectRoutes());

// Middleware to injest Socket.io into the request
app.use((req, res, next) => {
    req.io = app.get('io');
    next();
});

// Session token
(async () => {
   try {
        const redis = await redisClient();
        console.log('Redis session store set up complete');

        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7
            },
            store: new RedisStore({
                client: redis,
            })
        }));
        console.log('Redis session store set up complete')
    } catch (err) {
        console.error('Failed to set up Redis session store:', err);
    }    
});


module.exports = app;