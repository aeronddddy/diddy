import { addBeacon, getBeacons, cleanupBeacons } from "./beacons.js";

export function registerRoutes(app) {
    // Send help beacon
    app.post("/help", (req, res) => {
        const { player, server, x, y, z, enemies } = req.body;
        
        if (!player || !server) {
            return res.status(400).json({ error: "Missing required fields: player, server" });
        }
        
        addBeacon({ player, server, x, y, z, enemies });
        console.log(`Help beacon from ${player} at (${x}, ${y}, ${z}) with ${enemies || 0} enemies`);
        
        res.json({ status: "ok", message: "Beacon sent" });
    });
    
    // Poll for active beacons
    app.get("/beacons", (req, res) => {
        cleanupBeacons();
        const beacons = getBeacons();
        res.json({ beacons, count: beacons.length });
    });
    
    // Optional: Delete a specific beacon manually
    app.delete("/beacon/:player", (req, res) => {
        const { player } = req.params;
        // You'll need to add deleteBeacon function to beacons.js
        res.json({ status: "ok", message: `Beacon for ${player} cleared` });
    });
}
