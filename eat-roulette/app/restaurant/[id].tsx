import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {GOOGLE_API_KEY} from "@/lib/googlePlacesApi";

export default function RestaurantDetailScreen() {
    const params = useLocalSearchParams<{
        id: string;
        name?: string;
        rating?: string;
        priceLevel?: string;
        distanceText?: string;
        driveTimeText?: string;
        imageUrl?: string;
    }>();

    const {
        name = "Burger House",
        rating = "4.7",
        priceLevel = "$$",
        distanceText = "0.6 miles away",
        driveTimeText = "12 min drive",
        imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    } = params;

    function getPhotoUrl(photoName: string, apiKey: string, maxWidth = 400) {
        return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`;
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.container}>
                <View style={styles.heroWrapper}>
                    <Image source={{ uri: getPhotoUrl(imageUrl?.[1]?.name, GOOGLE_API_KEY) }} style={styles.heroImage} />

                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </Pressable>

                    <Text style={styles.heroTitle}>{name}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{name}</Text>

                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingText}>⭐ {rating}</Text>
                        <Text style={styles.ratingText}>⭐ {priceLevel}</Text>
                    </View>

                    <Text style={styles.locationText}>
                        📍 {distanceText} • {driveTimeText}
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
        width: "100%",
        height: 330,
    },
    backButton: {
        position: "absolute",
        top: 52,
        left: 18,
        zIndex: 2,
    },
    heroTitle: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
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
        flexDirection: "row",
        justifyContent: "center",
        gap: 18,
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