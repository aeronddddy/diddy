const beacons = new Map();

/*
Beacon format:
{
  player,
  server,
  x, y, z,
  enemies,
  timestamp
}
*/

export function addBeacon(data) {
    beacons.set(data.player, {
        ...data,
        timestamp: Date.now()
    });
}

export function getBeacons() {
    return Array.from(beacons.values());
}

export function cleanupBeacons() {
    const now = Date.now();
    for (const [player, beacon] of beacons.entries()) {
        if (now - beacon.timestamp > 60_000) {
            beacons.delete(player);
        }
    }
}
