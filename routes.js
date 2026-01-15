import { addBeacon, getBeacons, cleanupBeacons } from "./beacons.js";

export function registerRoutes(app) {

    // Send help beacon
    app.post("/help", (req, res) => {
        const {
            player,
            server,
            x, y, z,
            enemies
        } = req.body;

        if (!player || !server) {
            return res.status(400).json({ error: "Missing fields" });
        }

        addBeacon({ player, server, x, y, z, enemies });
        res.json({ status: "ok" });
    });

    // Poll for active beacons
    app.get("/beacons", (req, res) => {
        cleanupBeacons();
        res.json(getBeacons());
    });
}
