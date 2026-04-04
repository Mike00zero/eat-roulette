import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RouletteModal from "../components/RouletteModal";
import { FOODS } from '../constants';

const picks = [
    {
        id: "1",
        name: "Burger House",
        rating: "4.7",
        cuisine: "American",
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "2",
        name: "Sakura Sushi",
        rating: "4.6",
        cuisine: "Japanese",
        image:
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    },
];

type Restaurant = {
    id: string;
    name: string;
    rating: string;
    cuisine: string;
    image: string;
};

function RestaurantCard({ item }: { item: Restaurant }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                </Text>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#ff9d00" />
                    <Text style={styles.rating}>{item.rating}</Text>
                    <Text style={styles.meta}> · {item.cuisine}</Text>
                </View>

                <View style={styles.cardButtonsRow}>
                    <Pressable style={styles.viewButton}>
                        <Text style={styles.viewButtonText}>View</Text>
                    </Pressable>

                    <Pressable style={styles.spinAgainButton}>
                        <Text style={styles.spinAgainText}>Spin again</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const categories = FOODS;
    const [showRoulette, setShowRoulette] = useState(false);
    const [selectedIndex, setSelectedOption] = useState(null);

    const selectedFood = (foodIndex) => {
        setSelectedOption(foodIndex);
        setShowRoulette(false);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.logo}>EatRoulette</Text>

                <Text style={styles.heading}>What should we eat?</Text>

                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={18} color="#f66a0a" />
                    <Text style={styles.locationText}>Near You</Text>
                </View>

                <Pressable style={styles.decideButton} onPress={() => setShowRoulette(true)}>
                    <Text style={styles.decideButtonText}>Decide For Me</Text>
                </Pressable>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesRow}
                >
                    {categories.map((category, index) => (
                        <Pressable
                            key={category}
                            style={() => [
                                styles.categoryChip,
                                selectedIndex === index && styles.categoryChipSelected
                            ]}
                        >
                            <Text style={styles.categoryChipText}>{category}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionLine} />
                    <Text style={styles.sectionTitle}>Top Picks Nearby</Text>
                    <View style={styles.sectionLine} />
                </View>

                <View style={styles.cardsRow}>
                    {picks.map((item) => (
                        <RestaurantCard key={item.id} item={item} />
                    ))}
                </View>
            </ScrollView>
            <RouletteModal
                visible={showRoulette}
                onClose={() => setShowRoulette(false)}
                onSpin={() => {
                    console.log("Spin the wheel");
                }}
                selectedOption={selectedFood}
            />
        </SafeAreaView>
    );
}

const ORANGE = "#f66a0a";
const BG = "#f4f1ed";
const TEXT = "#273244";
const BORDER = "#d8d2cc";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    scrollContent: {
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    logo: {
        textAlign: "center",
        color: ORANGE,
        fontSize: 20,
        fontWeight: "800",
        marginTop: 8,
        marginBottom: 24,
    },
    heading: {
        fontSize: 25,
        lineHeight: 31,
        fontWeight: "800",
        color: TEXT,
        textAlign: "center",
        marginBottom: 14,
    },
    locationRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginBottom: 28,
    },
    locationText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4e5561",
    },
    decideButton: {
        backgroundColor: ORANGE,
        minHeight: 86,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 28,
        shadowColor: ORANGE,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    decideButtonText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
    },
    categoriesRow: {
        paddingRight: 12,
        marginBottom: 32,
    },
    categoryChip: {
        minWidth: 62,
        height: 34,
        paddingHorizontal: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: "#f7f4ef",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    categoryChipText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#5d5d5d",
    },
    categoryChipSelected: {
        borderColor: "#000",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#d6d0ca",
    },
    sectionTitle: {
        marginHorizontal: 12,
        fontSize: 17,
        fontWeight: "800",
        color: TEXT,
    },
    cardsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        width: 148,
        backgroundColor: "#fff",
        borderRadius: 11,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#d8d2cc",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    cardImage: {
        width: "100%",
        height: 92,
        resizeMode: "cover",
    },
    cardBody: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#3a3a3a",
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 3,
    },
    rating: {
        color: "#f47a00",
        fontSize: 12,
        fontWeight: "700",
    },
    meta: {
        color: "#5f5f5f",
        fontSize: 12,
        fontWeight: "500",
    },
    cardButtonsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    viewButton: {
        backgroundColor: ORANGE,
        paddingHorizontal: 14,
        height: 26,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    viewButtonText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "800",
    },
    spinAgainButton: {
        flex: 1,
        height: 26,
        borderRadius: 5,
        backgroundColor: "#f1efec",
        justifyContent: "center",
        alignItems: "center",
    },
    spinAgainText: {
        color: "#4f4f4f",
        fontSize: 11,
        fontWeight: "700",
    },
});