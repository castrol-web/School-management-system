import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import teacherRoutes from "./routes/teacher.js";
import parentRoutes from "./routes/parent.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
const app = express();

//cross origin middleware 
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongooseUrl = process.env.MONGOOSE_CONNECTION;
//Database connection
try {
    await mongoose.connect(mongooseUrl);
    console.log("DB connection successful");
} catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
}


app.use("/api/admin",adminRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/teacher",teacherRoutes);
app.use("/api/parent",parentRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes)

const port = process.env.PORT || 8050
//listening port 
app.listen(port, "0.0.0.0", (err) => {
    if (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
    console.log(`listening on localhost:${port}`);
})



