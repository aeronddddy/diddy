import express from "express";
import { PORT, API_KEY } from "./config.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    const key = req.headers["x-api-key"];
    if (key !== API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
});

registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Discord Alert Bot running on port ${PORT}`);
});
