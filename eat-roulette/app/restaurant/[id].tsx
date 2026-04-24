import React, {useRef, useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    SafeAreaView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { getDriveInfo } from "@/lib/googleRoutesApi";
import { GOOGLE_API_KEY } from "@/lib/googlePlacesApi";

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
    const params = useLocalSearchParams<{
        id: string;
        name?: string;
        rating?: string;
        priceLevel?: string;
        distanceText?: string;
        driveTimeText?: string;
        photos?: object;
        websiteUri?: string;
    }>();

    const {
        name,
        rating = "",
        priceLevel = "",
        restaurantLat,
        restaurantLng,
        userLat = 40.930657713557366,
        userLng = -73.86751997116457,
        photos,
        websiteUri,
    } = params;
    const [distanceText, setDistanceText] = useState('');
    const [driveTimeText, setDriveTimeText] = useState('');

    useEffect(() => {
        let cancelled = false;

        const loadRoute = async () => {
            try {
                const result = await getDriveInfo(
                    userLat,
                    userLng,
                    restaurantLat,
                    restaurantLng
                );

                if (cancelled) return;

                setDistanceText(result.distanceMiles);
                setDriveTimeText(result.driveTimeText);
            } catch (err) {
                if (!cancelled) {
                    console.log("route error", err);
                }
            }
        };

        loadRoute();

        return () => {
            cancelled = true;
        };
    }, [userLat, userLng, restaurantLat, restaurantLng]);

    const [activeIndex, setActiveIndex] = useState(0);

    const CARD_WIDTH = width - 32;

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
        setActiveIndex(index);
    };

    const API_KEY = GOOGLE_API_KEY;
    const galleryPhotos = JSON.parse(photos);

    const galleryImages =
        galleryPhotos?.map((photo: any, index: number) => ({
            id: `${index}`,
            uri: `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=1200&key=${API_KEY}`,
            width: photo.widthPx,
            height: photo.heightPx,
        })) ?? [];

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.heroWrapper}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}
                >
                    {galleryImages.map((item) => {
                        return (
                            <Image
                                key={item.id}
                                source={{uri: item.uri}}
                                style={styles.heroImage}
                                resizeMode="cover"
                            />
                        )
                    })}
                </ScrollView>

                <View style={styles.pagination}>
                    {galleryImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
            </View>

            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{name}</Text>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={13} color="#ff9d00" />
                        <Text style={styles.ratingText}>{rating}</Text>
                        <Text style={styles.ratingText}>{priceLevel}</Text>
                    </View>

                    <Text style={styles.locationText}>
                        <Ionicons name="location" size={18} color="#f66a0a" /> {distanceText} • {driveTimeText}
                    </Text>

                    <View style={styles.divider} />

                    <Pressable style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>View Menu</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Get Directions</Text>
                    </Pressable>

                    <Pressable style={styles.disabledButton} onPress={() => router.back()}>
                        <Text style={styles.disabledButtonText}>Try Another</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f1ed",
    },
    heroWrapper: {
        position: "relative",
    },
    heroImage: {
        width,
        height: 480,
    },
    pagination: {
        position: "absolute",
        bottom: 16,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 999,
        marginHorizontal: 4,
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    activeDot: {
        backgroundColor: "#fff",
        width: 10,
        height: 10,
    },
    backButton: {
        position: "absolute",
        top: 52,
        left: 18,
        zIndex: 2,
    },
    content: {
        flex: 1,
        marginTop: -8,
        backgroundColor: "#f4f1ed",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingHorizontal: 24,
        paddingTop: 22,
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "800",
        color: "#111",
        marginBottom: 12,
    },
    ratingRow: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 12,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#444",
    },
    locationText: {
        textAlign: "center",
        fontSize: 15,
        color: "#444",
        marginBottom: 18,
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginBottom: 18,
    },
    primaryButton: {
        height: 58,
        borderRadius: 10,
        backgroundColor: "#f66a0a",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
    secondaryButton: {
        height: 58,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#d4d4d4",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    secondaryButtonText: {
        color: "#1f2a44",
        fontSize: 18,
        fontWeight: "800",
    },
    disabledButton: {
        height: 58,
        borderRadius: 10,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    disabledButtonText: {
        color: "#333",
        fontSize: 18,
        fontWeight: "800",
    },
});