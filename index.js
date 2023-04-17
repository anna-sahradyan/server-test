import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
//?Constants

const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config();


//?Middleware
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use(`/user`,userRouter);
//?Routes


//?Connect
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => console.log(`Server is running in http://localhost:${PORT}`))).catch((error) => console.log(error.message));


