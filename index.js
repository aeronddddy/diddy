import express from "express";
import { PORT } from "./config.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());

// Public health check endpoint for cron jobs
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

// Register all routes - no auth needed
registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Discord Alert Bot running on port ${PORT}`);
});
