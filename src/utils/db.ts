import mongoose from "mongoose";


const dbClient = async () => {
    try {
        const dbUri = process.env.MONGO_URI;
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB');
     } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
     }
};

export default dbClient;