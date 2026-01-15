import { addBeacon, getBeacons, cleanupBeacons } from "./beacons.js";
import fetch from "node-fetch";

// Discord webhook URL
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1461386934260732110/gxm36fmx5AHNKGLOPm4jlqFU03qN-fXM0ygysXDNt7YRI2HAnuthKf-faW3SA8OydhrO";

export function registerRoutes(app) {
    // Receive help beacon and forward to Discord
    app.post("/help", async (req, res) => {
        console.log("=== HELP ENDPOINT HIT ===");
        console.log("Request body:", JSON.stringify(req.body));
        
        const {
            player,
            server,
            x, y, z,
            enemies
        } = req.body;

        if (!player || !server || x === undefined || y === undefined || z === undefined) {
            console.log("ERROR: Missing fields");
            return res.status(400).json({ error: "Missing required fields: player, server, x, y, z" });
        }

        // Store beacon for other clients to poll
        addBeacon({ player, server, x, y, z, enemies: enemies || [] });
        console.log(`✅ Beacon stored: ${player} at (${x}, ${y}, ${z}) on ${server}`);
        
        // Forward to Discord webhook
        try {
            console.log("Attempting to send Discord webhook...");
            
            const enemyList = enemies && enemies.length > 0 
                ? enemies.join(", ") 
                : "None nearby";
            
            const discordMessage = {
                content: `🚨 **HELP SIGNAL** 🚨\n\n` +
                        `**Player:** ${player}\n` +
                        `**Server:** ${server}\n` +
                        `**Location:** ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}\n` +
                        `**Enemies:** ${enemyList}`
            };

            const webhookResponse = await fetch(DISCORD_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(discordMessage)
            });

            console.log(`Discord webhook response: ${webhookResponse.status}`);
            
            if (!webhookResponse.ok) {
                console.error(`Discord webhook failed with status: ${webhookResponse.status}`);
            } else {
                console.log(`✅ Discord webhook sent successfully for ${player}`);
            }
        } catch (error) {
            console.error("❌ Failed to send Discord webhook:", error);
            // Don't fail the request if Discord fails
        }
        
        res.json({ status: "ok", message: "Beacon added and webhook sent" });
    });

    // Poll for active beacons (teammates call this)
    app.get("/beacons", (req, res) => {
        cleanupBeacons();
        const beacons = getBeacons();
        res.json({ beacons });
    });

    // Optional: Remove a specific beacon manually
    app.delete("/beacon/:player", (req, res) => {
        const { player } = req.params;
        // You'd need to add a removeBeacon function in beacons.js
        res.json({ status: "ok", message: "Beacon removed" });
    });
}
