import React, { useMemo, useRef, useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    Animated,
    Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

type RouletteModalProps = {
    visible: boolean;
    onClose: () => void;
};

const FOODS = [
    "Steak",     // top-right
    "Fast Food",    // right
    "Chicken",  // bottom-right
    "Taco",     // bottom
    "Chinese",// bottom-left
    "Sushi",    // left
    "Burger",   // top-left
    "Pizza",    // top
];

// 8 slices = 45 degrees each
const SLICE_ANGLE = 360 / FOODS.length;
const PEG_COUNT = 24;
const PEG_ANGLE = 360 / PEG_COUNT;

// Pointer is fixed at the top, so we rotate the wheel until the chosen
// slice lines up under that pointer.
export default function RouletteModal({
  visible,
  onClose,
}: RouletteModalProps) {
    const rotation = useRef(new Animated.Value(0)).current;
    const [currentRotation, setCurrentRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedFood, setSelectedFood] = useState<string | null>(null);

    // Sound
    const tickSounds = useRef<Audio.Sound[]>([]);
    const tickIndex = useRef(0);
    const tickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const spinningRef = useRef(false);
    const lastTickSliceRef = useRef(0);
    const lastTickPegRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        const loadSounds = async () => {
            const sounds: Audio.Sound[] = [];

            for (let i = 0; i < 4; i++) {
                const { sound } = await Audio.Sound.createAsync(
                    require("../assets/sounds/tick.wav")
                );
                sounds.push(sound);
            }

            if (mounted) {
                tickSounds.current = sounds;
            } else {
                for (const sound of sounds) {
                    await sound.unloadAsync();
                }
            }
        };

        loadSounds();

        return () => {
            mounted = false;

            if (tickTimeoutRef.current) {
                clearTimeout(tickTimeoutRef.current);
            }

            tickSounds.current.forEach((sound) => {
                sound.unloadAsync();
            });
        };
    }, []);

    const playTick = async () => {
        try {
            if (tickSounds.current.length === 0) return;

            const sound = tickSounds.current[tickIndex.current];
            tickIndex.current = (tickIndex.current + 1) % tickSounds.current.length;

            await sound.setPositionAsync(0);
            await sound.playAsync();
        } catch (e) {
            console.log("tick error", e);
        }
    };

    const rotateInterpolate = useMemo(() => {
        return rotation.interpolate({
            inputRange: [0, 360],
            outputRange: ["0deg", "360deg"],
        });
    }, [rotation]);

    const normalizeDeg = (deg: number) => {
        return ((deg % 360) + 360) % 360;
    };

    const spinWheel = () => {
        if (isSpinning) return;

        spinningRef.current = true;
        setIsSpinning(true);
        setSelectedFood(null);

        const spinDuration = 4200;

        const winnerIndex = Math.floor(Math.random() * FOODS.length);

        const targetSliceCenter = winnerIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
        const desiredFinalAngle = 360 - targetSliceCenter;

        const normalizedCurrent = normalizeDeg(currentRotation);

        const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));

        let delta = desiredFinalAngle - normalizedCurrent;
        if (delta < 0) delta += 360;

        const finalRotation = currentRotation + extraSpins + delta;

        lastTickPegRef.current = Math.floor(currentRotation / PEG_ANGLE);

        const listenerId = rotation.addListener(({ value }) => {
            const currentPeg = Math.floor(value / PEG_ANGLE);

            while (currentPeg > lastTickPegRef.current) {
                lastTickPegRef.current += 1;
                // playTick();
            }
        });

        Animated.timing(rotation, {
            toValue: finalRotation,
            duration: spinDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(async () => {
            rotation.removeListener(listenerId);
            // await playTick();

            setCurrentRotation(finalRotation);
            setSelectedFood(FOODS[winnerIndex]);
            setIsSpinning(false);
            spinningRef.current = false;
        });
    };

    const close = () => {
        setCurrentRotation(0);
        onClose();
    }

    return (
        <Modal visible={visible} animationType="fade" transparent={false}>
            <SafeAreaView style={styles.container}>
                <Pressable style={styles.closeButton} onPress={close}>
                    <Ionicons name="close" size={28} color="#fff" />
                </Pressable>

                <View style={styles.content}>
                    <Text style={styles.title}>Spin for Food</Text>

                    <View style={styles.wheelArea}>
                        {/* Pointer */}
                        <View style={styles.pointerWrap}>
                            <View style={styles.pointer} />
                        </View>

                        {/* Wheel */}
                        <View style={styles.wheelWrapper}>
                            <Animated.Image
                                source={require("../assets/images/food-wheel-v2.png")}
                                style={[
                                    styles.wheelImage,
                                    {
                                        transform: [{ rotate: rotateInterpolate }],
                                    },
                                ]}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>
                            {selectedFood ? "Tonight's pick" : "Tap spin to decide"}
                        </Text>
                        <Text style={styles.resultValue}>
                            {selectedFood ?? "?"}
                        </Text>
                    </View>

                    {currentRotation > 0 && !isSpinning && <Pressable
                        style={() => [
                            styles.spinButton,
                            styles.spinButtonAccept,
                        ]}
                    >
                        <Text style={styles.spinButtonText}>
                            THIS SOUNDS GOOD
                        </Text>
                    </Pressable>}

                    <Pressable
                        onPress={spinWheel}
                        disabled={isSpinning}
                        style={({ pressed }) => [
                            styles.spinButton,
                            pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
                            isSpinning && styles.spinButtonDisabled,
                            currentRotation > 0 && styles.spinButtonSecondaryColor,
                        ]}
                    >
                        <Text style={styles.spinButtonText}>
                            {isSpinning ? "SPINNING..." : currentRotation > 0 ? "SPIN AGAIN" : "SPIN"}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f2b46",
    },
    closeButton: {
        position: "absolute",
        top: 75,
        right: 25,
        zIndex: 20,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.14)",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 22,
    },
    wheelArea: {
        width: 360,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
    },
    pointerWrap: {
        position: "absolute",
        top: -8,
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    pointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 16,
        borderRightWidth: 16,
        borderTopWidth: 28,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#ffffff",
        filter: undefined as any,
    },
    wheelWrapper: {
        width: 320,
        height: 320,
        alignItems: "center",
        justifyContent: "center",
    },
    wheelImage: {
        width: 320,
        height: 320,
    },
    resultBox: {
        minHeight: 72,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    resultLabel: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
    },
    resultValue: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "900",
    },
    spinButton: {
        width: "92%",
        maxWidth: 340,
        height: 78,
        borderRadius: 16,
        backgroundColor: "#f66a0a",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.22,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    spinButtonAccept: {
        marginBottom: 25,
    },
    spinButtonSecondaryColor: {
        backgroundColor: "#bebdb8",
    },
    spinButtonDisabled: {
        opacity: 0.7,
    },
    spinButtonText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
});