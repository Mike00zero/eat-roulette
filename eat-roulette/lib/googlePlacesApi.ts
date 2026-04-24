export const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export type PlaceResult = {
    id: string;
    name: string;
    address?: string;
    rating?: number;
    lat: number;
    lng: number;
    types?: string[];
};

type SearchNearbyParams = {
    latitude: number;
    longitude: number;
    radius?: number;
    params: any;
};

export async function searchNearbyRestaurants({
  latitude = 37.7937,
  longitude = -122.3965,
  radius = 2500,
  params,
}: SearchNearbyParams): Promise<PlaceResult[]> {
    if (!GOOGLE_API_KEY) {
        throw new Error("Missing Google Places API key");
    }

    const response = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_API_KEY,
                "X-Goog-FieldMask":
                    "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.photos,places.priceLevel",
            },
            body: JSON.stringify({
                includedTypes: params,
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: {
                            latitude,
                            longitude,
                        },
                        radius,
                    },
                },
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google Places error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    return (data.places ?? []).map((place: any) => ({
        id: place.id,
        name: place.displayName?.text ?? "Unknown",
        address: place.formattedAddress,
        rating: place.rating,
        lat: place.location?.latitude,
        lng: place.location?.longitude,
        types: place.types ?? [],
        photos: place.photos ?? [],
        priceLevel: place.priceLevel,
        websiteUri: place.websiteUri,
    })).sort((a, b) => b.rating - a.rating);
}