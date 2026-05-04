import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Connect to MongoDB using the MONGO_URI from .env
        await mongoose.connect(process.env.MONGO_URI);


        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1); // Stop the server if DB fails
    }
};

export default connectDB;
