import { GOOGLE_API_KEY } from "@/lib/googlePlacesApi";

type RouteInfo = {
    distanceMiles: string;
    driveTimeText: string;
};

function metersToMiles(meters: number) {
    return meters / 1609.344;
}

function secondsToDriveText(seconds: number) {
    const totalMinutes = Math.round(seconds / 60);

    if (totalMinutes < 60) {
        return `${totalMinutes} min drive`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
        return `${hours} hr drive`;
    }

    return `${hours} hr ${minutes} min drive`;
}

function parseDurationSeconds(duration: string) {
    // Google returns strings like "734s"
    return Number(duration.replace("s", ""));
}

export async function getDriveInfo(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
): Promise<RouteInfo> {
    if (!GOOGLE_API_KEY) {
        throw new Error("Missing Google API key");
    }

    const response = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_API_KEY,
                "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
            },
            body: JSON.stringify({
                origin: {
                    location: {
                        latLng: {
                            latitude: originLat,
                            longitude: originLng,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: destLat,
                            longitude: destLng,
                        },
                    },
                },
                travelMode: "DRIVE",
                routingPreference: "TRAFFIC_AWARE",
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Routes API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const route = data.routes?.[0];

    if (!route) {
        throw new Error("No route returned");
    }

    const miles = metersToMiles(route.distanceMeters);
    const seconds = parseDurationSeconds(route.duration);

    return {
        distanceMiles: `${miles.toFixed(1)} miles away`,
        driveTimeText: secondsToDriveText(seconds),
    };
}