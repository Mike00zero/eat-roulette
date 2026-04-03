import React, { useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    SafeAreaView,
    Animated,
    Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type RouletteModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function RouletteModal({
                                          visible,
                                          onClose,
                                      }: RouletteModalProps) {
    const rotation = useRef(new Animated.Value(0)).current;
    const [isSpinning, setIsSpinning] = useState(false);

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);

        rotation.setValue(0);

        const randomExtraDegrees = Math.floor(Math.random() * 360);
        const totalRotation = 360 * 6 + randomExtraDegrees;

        Animated.timing(rotation, {
            toValue: totalRotation,
            duration: 3200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setIsSpinning(false);
        });
    };

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.modalCard}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={26} color="#fff" />
                    </Pressable>

                    <View style={styles.content}>
                        <View style={styles.wheelWrapper}>
                            <Animated.Image
                                source={require("../assets/images/food-wheel.png")}
                                style={[
                                    styles.wheelImage,
                                    {
                                        transform: [{ rotate: rotateInterpolate }],
                                    },
                                ]}
                                resizeMode="contain"
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.spinButton,
                                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                                isSpinning && { opacity: 0.7 },
                            ]}
                            onPress={spinWheel}
                            disabled={isSpinning}
                        >
                            <Text style={styles.spinButtonText}>
                                {isSpinning ? "SPINNING..." : "SPIN"}
                            </Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalCard: {
        width: "100%",
        maxWidth: 390,
        height: "92%",
        borderRadius: 34,
        overflow: "hidden",
        backgroundColor: "#0f2b46",
    },
    closeButton: {
        position: "absolute",
        top: 18,
        right: 18,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.14)",
        alignItems: "center",
        justifyContent: "center",
    },
    spinButton: {
        width: "92%",
        height: 82,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f66a0a",
        shadowColor: "#000",
        shadowOpacity: 0.22,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    spinButtonText: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingBottom: 36,
    },
    wheelWrapper: {
        width: 320,
        height: 320,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 44,
    },
    wheelImage: {
        width: 320,
        height: 320,
    },
});