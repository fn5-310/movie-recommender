import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movies.routes.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
