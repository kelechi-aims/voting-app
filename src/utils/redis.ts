import { createClient } from 'redis';


const redisClient = async () => {
    try {
        const client = createClient({
            password: 'hkKRcdlqlnluIcy4pHoeilW1ympiLrRn',
            socket: {
                host: 'redis-12478.c81.us-east-1-2.ec2.redns.redis-cloud.com',
                port: 12478
            }
        });
    
        await client.connect();
    
        client.on('connect', () => console.log('Connected to Redis'));
        client.on('error', (err) => console.log('Redis Client Error', err));    
    
        return client;

    } catch (err) {
        console.error('Error connecting to Redis', err);
    }
};

export default redisClient;