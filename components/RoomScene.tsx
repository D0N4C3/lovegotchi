import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

function TwinkleStar({ delay, top, left, size }: { delay: number; top: number; left: number; size: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          top,
          left,
          width: size,
          height: size,
          opacity,
        },
      ]}
    />
  );
}

function FloatingDust({ delay, left }: { delay: number; left: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -30,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -60,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dust,
        {
          left,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

export default function RoomScene({ children }: { children?: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* Sky / wall gradient */}
      <LinearGradient
        colors={["#1E1A2E", "#2D2440", "#3D3050"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.wall}
      />

      {/* Stars */}
      <TwinkleStar delay={0} top={20} left={30} size={3} />
      <TwinkleStar delay={500} top={40} left={80} size={2} />
      <TwinkleStar delay={1000} top={15} left={140} size={2} />
      <TwinkleStar delay={1500} top={50} left={200} size={3} />
      <TwinkleStar delay={800} top={25} left={260} size={2} />
      <TwinkleStar delay={1200} top={45} left={310} size={2} />
      <TwinkleStar delay={300} top={60} left={170} size={2} />

      {/* Floating dust */}
      <FloatingDust delay={0} left={50} />
      <FloatingDust delay={2000} left={150} />
      <FloatingDust delay={4000} left={250} />
      <FloatingDust delay={3000} left={100} />

      {/* Moon glow */}
      <View style={styles.moonGlow}>
        <View style={styles.moon} />
      </View>

      {/* Floor */}
      <View style={styles.floor}>
        <LinearGradient
          colors={["#3A3048", "#2D2438"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.floorGradient}
        />
      </View>

      {/* Window */}
      <View style={styles.window}>
        <LinearGradient
          colors={["#1E2A4A", "#2A3A5A", "#3A4A6A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.windowGlass}
        />
        <View style={styles.windowFrameV} />
        <View style={styles.windowFrameH} />
        {/* Window stars */}
        <View style={[styles.windowStar, { top: 10, left: 14 }]} />
        <View style={[styles.windowStar, { top: 22, left: 44 }]} />
        <View style={[styles.windowStar, { top: 8, left: 70 }]} />
        <View style={[styles.windowStar, { top: 30, left: 28 }]} />
        {/* Window sill glow */}
        <View style={styles.windowSill} />
      </View>

      {/* Little plant */}
      <View style={styles.plantPot}>
        <View style={styles.plantStem} />
        <View style={styles.plantLeaf1} />
        <View style={styles.plantLeaf2} />
        <View style={styles.plantLeaf3} />
      </View>

      {/* Cozy rug */}
      <View style={styles.rug}>
        <View style={styles.rugInner} />
      </View>

      {/* Bed */}
      <View style={styles.bed}>
        <View style={styles.bedBase} />
        <View style={styles.bedBlanket} />
        <View style={styles.bedPillow} />
      </View>

      {/* Ambient light overlay */}
      <View style={styles.ambientOverlay} />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 340,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  wall: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: "absolute",
    backgroundColor: Colors.star,
    borderRadius: 2,
  },
  dust: {
    position: "absolute",
    bottom: 80,
    width: 3,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  moonGlow: {
    position: "absolute",
    top: 25,
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,248,231,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  moon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,248,231,0.6)",
    shadowColor: Colors.moon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  floor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  floorGradient: {
    flex: 1,
  },
  window: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: "#1A2440",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.15)",
  },
  windowGlass: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  windowFrameV: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 2,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    marginLeft: -1,
  },
  windowFrameH: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: -1,
  },
  windowStar: {
    position: "absolute",
    width: 2,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 1,
  },
  windowSill: {
    position: "absolute",
    bottom: 0,
    left: -3,
    right: -3,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  plantPot: {
    position: "absolute",
    bottom: 60,
    left: 24,
    width: 32,
    height: 30,
    backgroundColor: "#5A4A3A",
    borderRadius: 6,
    alignItems: "center",
  },
  plantStem: {
    position: "absolute",
    bottom: 24,
    width: 3,
    height: 26,
    backgroundColor: "#6B8F5E",
    borderRadius: 2,
  },
  plantLeaf1: {
    position: "absolute",
    bottom: 36,
    left: -8,
    width: 16,
    height: 12,
    backgroundColor: "#7BA87B",
    borderRadius: 8,
    transform: [{ rotate: "-20deg" }],
  },
  plantLeaf2: {
    position: "absolute",
    bottom: 42,
    right: -8,
    width: 16,
    height: 12,
    backgroundColor: "#8FBC8F",
    borderRadius: 8,
    transform: [{ rotate: "20deg" }],
  },
  plantLeaf3: {
    position: "absolute",
    bottom: 48,
    width: 14,
    height: 12,
    backgroundColor: "#6B8F5E",
    borderRadius: 7,
  },
  rug: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 40,
    backgroundColor: "rgba(139, 119, 101, 0.3)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rugInner: {
    width: 100,
    height: 30,
    backgroundColor: "rgba(139, 119, 101, 0.2)",
    borderRadius: 15,
  },
  bed: {
    position: "absolute",
    bottom: 60,
    right: 24,
    width: 72,
    height: 38,
  },
  bedBase: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 18,
    backgroundColor: "#5A4A5A",
    borderRadius: 6,
  },
  bedBlanket: {
    position: "absolute",
    bottom: 10,
    left: 4,
    width: 52,
    height: 22,
    backgroundColor: "#6B7B8F",
    borderRadius: 11,
  },
  bedPillow: {
    position: "absolute",
    bottom: 12,
    right: 4,
    width: 20,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 8,
  },
  ambientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,140,100,0.03)",
    borderRadius: 28,
  },
});
