import mongoose from "mongoose";


const dbClient = async () => {
    try {
        const dbUri = 'mongodb+srv://kelechidenise:uzlMtjoMlSWaAlCg@cluster0.idb5p.mongodb.net/votingapp?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB');
     } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
     }
};

export default dbClient;