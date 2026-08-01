import express, {Request, Response} from "express";
import authroutes from "./routes/auth.routes"
const app = express();
app.use(express.json());
import "dotenv/config";
app.use("/api/auth", authroutes);
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`)
})