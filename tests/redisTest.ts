import { createClient } from 'redis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const testRedisConnection = async () => {
    try {
        const client = createClient({
            url: process.env.REDIS_URL
        });

        await client.connect();
        console.log('Connected to Redis successfully');
        
        // Close the connection once done
        await client.disconnect();
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
};

testRedisConnection();
