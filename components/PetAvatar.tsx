import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { usePetStore } from "@/store/petStore";

function FloatingHeart({ delay, x, y }: { delay: number; x: number; y: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -60,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 1500,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.heartParticle,
        {
          left: x,
          bottom: y,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <View style={styles.heartShape} />
    </Animated.View>
  );
}

function GlowOrb({ delay, x, size, color }: { delay: number; x: number; size: number; color: string }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 3000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -90,
            duration: 2500,
            easing: Easing.in(Easing.quad),
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
        styles.orb,
        {
          width: size,
          height: size,
          left: x,
          backgroundColor: color,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

export default function PetAvatar() {
  const { mood } = usePetStore();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const earLeftAnim = useRef(new Animated.Value(0)).current;
  const earRightAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.04,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();

    const blink = Animated.loop(
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.delay(3500),
      ])
    );
    blink.start();

    const earLeft = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(earLeftAnim, {
          toValue: -8,
          duration: 300,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(earLeftAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(4000),
      ])
    );
    earLeft.start();

    const earRight = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(earRightAnim, {
          toValue: 8,
          duration: 300,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(earRightAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(3800),
      ])
    );
    earRight.start();

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();

    return () => {
      bounce.stop();
      breathe.stop();
      blink.stop();
      earLeft.stop();
      earRight.stop();
      glow.stop();
    };
  }, []);

  const isSleepy = mood === "sleepy";
  const isHappy = mood === "happy" || mood === "excited";
  const isPlayful = mood === "playful";
  const isLonely = mood === "lonely";

  const petColor = isSleepy ? Colors.petCream : isHappy ? Colors.petPink : Colors.petCoral;
  const blushOpacity = isHappy ? 0.7 : isSleepy ? 0.2 : 0.35;
  const glowColor = isHappy ? Colors.primaryGlow : isSleepy ? "rgba(255,228,214,0.2)" : "rgba(255,123,107,0.25)";

  return (
    <View style={styles.container}>
      {/* Atmospheric particles */}
      <View style={styles.particles}>
        <GlowOrb delay={0} x={10} size={6} color={Colors.primary} />
        <GlowOrb delay={1200} x={90} size={4} color={Colors.accent} />
        <GlowOrb delay={2400} x={50} size={5} color={Colors.secondary} />
        <GlowOrb delay={600} x={130} size={4} color={Colors.primaryLight} />
        <GlowOrb delay={1800} x={-5} size={5} color={Colors.accentLight} />
      </View>

      {isHappy && (
        <View style={styles.heartsLayer}>
          <FloatingHeart delay={0} x={20} y={80} />
          <FloatingHeart delay={1500} x={100} y={90} />
          <FloatingHeart delay={800} x={60} y={70} />
        </View>
      )}

      {/* Glow halo */}
      <Animated.View
        style={[
          styles.halo,
          {
            opacity: glowAnim,
            backgroundColor: glowColor,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.petWrapper,
          {
            transform: [
              { translateY: bounceAnim },
              { scale: breatheAnim },
            ],
          },
        ]}
      >
        {/* Shadow */}
        <View style={styles.shadow} />

        {/* Main body */}
        <View style={[styles.body, { backgroundColor: petColor }]}>
          {/* Inner glow */}
          <View style={styles.bodyInnerGlow} />

          {/* Left ear */}
          <Animated.View
            style={[
              styles.earLeft,
              { backgroundColor: petColor, transform: [{ rotate: "-15deg" }, { translateY: earLeftAnim }] },
            ]}
          >
            <View style={styles.earInner} />
          </Animated.View>
          {/* Right ear */}
          <Animated.View
            style={[
              styles.earRight,
              { backgroundColor: petColor, transform: [{ rotate: "15deg" }, { translateY: earRightAnim }] },
            ]}
          >
            <View style={styles.earInner} />
          </Animated.View>

          {/* Face */}
          <View style={styles.face}>
            {/* Eyes */}
            <Animated.View style={[styles.eye, { opacity: blinkAnim }]}>
              <View style={styles.eyeWhite}>
                <View style={styles.pupil} />
                <View style={styles.eyeShine} />
              </View>
            </Animated.View>
            <Animated.View style={[styles.eye, { opacity: blinkAnim }]}>
              <View style={styles.eyeWhite}>
                <View style={styles.pupil} />
                <View style={styles.eyeShine} />
              </View>
            </Animated.View>
          </View>

          {/* Cheeks */}
          <View style={[styles.cheek, { opacity: blushOpacity }]} />
          <View style={[styles.cheekRight, { opacity: blushOpacity }]} />

          {/* Mouth */}
          {isSleepy ? (
            <View style={styles.mouthSleep} />
          ) : isPlayful ? (
            <View style={styles.mouthOpen} />
          ) : isLonely ? (
            <View style={styles.mouthSad} />
          ) : (
            <View style={styles.mouth} />
          )}

          {/* Little sparkle when happy */}
          {isHappy && (
            <View style={styles.sparkleLeft}>
              <View style={styles.sparkle} />
            </View>
          )}
          {isHappy && (
            <View style={styles.sparkleRight}>
              <View style={styles.sparkle} />
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 220,
    width: 200,
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orb: {
    position: "absolute",
    bottom: 50,
    borderRadius: 50,
  },
  heartsLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heartParticle: {
    position: "absolute",
  },
  heartShape: {
    width: 14,
    height: 12,
    backgroundColor: Colors.petCoral,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 7,
    transform: [{ rotate: "-45deg" }],
  },
  halo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    blurRadius: 40,
  },
  petWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    position: "absolute",
    bottom: -12,
    width: 100,
    height: 20,
    backgroundColor: Colors.shadowStrong,
    borderRadius: 50,
    opacity: 0.4,
  },
  body: {
    width: 130,
    height: 110,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: Colors.petCoral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  bodyInnerGlow: {
    position: "absolute",
    top: 8,
    left: 20,
    width: 60,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 30,
  },
  earLeft: {
    position: "absolute",
    top: -22,
    left: 15,
    width: 36,
    height: 48,
    borderRadius: 20,
    overflow: "hidden",
  },
  earRight: {
    position: "absolute",
    top: -22,
    right: 15,
    width: 36,
    height: 48,
    borderRadius: 20,
    overflow: "hidden",
  },
  earInner: {
    position: "absolute",
    bottom: 6,
    left: 8,
    width: 20,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
  },
  face: {
    flexDirection: "row",
    gap: 20,
    marginTop: -5,
  },
  eye: {
    width: 24,
    height: 28,
  },
  eyeWhite: {
    width: 24,
    height: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pupil: {
    width: 13,
    height: 15,
    backgroundColor: Colors.textDark,
    borderRadius: 7,
  },
  eyeShine: {
    position: "absolute",
    top: 4,
    right: 5,
    width: 7,
    height: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  cheek: {
    position: "absolute",
    left: 16,
    top: 56,
    width: 22,
    height: 14,
    backgroundColor: Colors.petBlush,
    borderRadius: 11,
  },
  cheekRight: {
    position: "absolute",
    right: 16,
    top: 56,
    width: 22,
    height: 14,
    backgroundColor: Colors.petBlush,
    borderRadius: 11,
  },
  mouth: {
    width: 22,
    height: 12,
    borderBottomWidth: 3,
    borderBottomColor: Colors.textDark,
    borderRadius: 12,
    marginTop: 5,
  },
  mouthSleep: {
    width: 16,
    height: 3,
    backgroundColor: Colors.textDark,
    borderRadius: 2,
    marginTop: 10,
  },
  mouthOpen: {
    width: 18,
    height: 18,
    backgroundColor: Colors.dangerLight,
    borderRadius: 10,
    marginTop: 5,
  },
  mouthSad: {
    width: 18,
    height: 10,
    borderTopWidth: 3,
    borderTopColor: Colors.textDark,
    borderRadius: 10,
    marginTop: 12,
  },
  sparkleLeft: {
    position: "absolute",
    top: -10,
    left: -15,
  },
  sparkleRight: {
    position: "absolute",
    top: -10,
    right: -15,
  },
  sparkle: {
    width: 8,
    height: 8,
    backgroundColor: Colors.accent,
    borderRadius: 4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
