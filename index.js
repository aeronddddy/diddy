import express from "express";
import { PORT } from "./config.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());

// Public health check endpoint - NO AUTH REQUIRED
app.get("/health", (req, res) => {
    res.status(200).json({ status: "alive", timestamp: Date.now() });
});

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

// Register all other routes (these can have auth or not, your choice)
registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
