import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";

// ─── Color palette (matches Lovegotchi warmth) ───────────────────────────────
const Colors = {
  primary: "#FF7B6B",
  primaryLight: "#FFB4AA",
  primaryGlow: "rgba(255,123,107,0.35)",
  secondary: "#FFCBA4",
  accent: "#FF9ECD",
  accentLight: "#FFD6EC",
  petCoral: "#FFAB94",
  petPink: "#FFB4C8",
  petCream: "#FFE4D6",
  petBlush: "#FFB4B4",
  textDark: "#3D2B2B",
  shadowStrong: "rgba(61,43,43,0.18)",
  // Evolution-specific
  eggShell: "#FFF3E8",
  eggSpot: "#FFD4B8",
  babyBlue: "#C8E6FF",
  babyPurple: "#D8C8FF",
  childGreen: "#C8F0D8",
  childYellow: "#FFF0B8",
  teenTeal: "#A8E8E0",
  teenOrange: "#FFD0A0",
  adultGold: "#FFE066",
  adultAmber: "#FFAA44",
  legendaryViolet: "#C878FF",
  legendaryCyan: "#78E8FF",
  celestialPink: "#FF78C8",
  celestialGold: "#FFD878",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Mood = "happy" | "sleepy" | "playful" | "lonely" | "excited" | "neutral";

export type EvolutionStage =
  | "egg"
  | "cracking"
  | "baby"
  | "child"
  | "teen"
  | "adult"
  | "legendary"
  | "celestial";

// ──────────────────────────────────────────────────────────────────────────────
// Particle helpers
// ──────────────────────────────────────────────────────────────────────────────

function FloatingHeart({ delay, x, y }: { delay: number; x: number; y: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -60, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -100, duration: 1500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
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
    <Animated.View style={[styles.heartParticle, { left: x, bottom: y, transform: [{ translateY }, { scale }], opacity }]}>
      <View style={styles.heartShape} />
    </Animated.View>
  );
}

function FloatingStar({ delay, x, y, color }: { delay: number; x: number; y: number; color: string }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -70, duration: 2500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.9, duration: 500, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: 1, duration: 2500, useNativeDriver: true }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View style={{ position: "absolute", left: x, bottom: y, transform: [{ translateY }, { rotate: spin }], opacity }}>
      <View style={[styles.starShape, { borderBottomColor: color }]} />
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
          Animated.timing(translateY, { toValue: -50, duration: 3000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -90, duration: 2500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[styles.orb, { width: size, height: size, left: x, backgroundColor: color, transform: [{ translateY }], opacity }]} />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Stage sprites
// ──────────────────────────────────────────────────────────────────────────────

function EggSprite({ mood, bounceAnim, breatheAnim }: { mood: Mood; bounceAnim: Animated.Value; breatheAnim: Animated.Value }) {
  const wobble = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const w = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, { toValue: -4, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wobble, { toValue: 4, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wobble, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(1800),
      ])
    );
    w.start();
    return () => w.stop();
  }, []);

  const spin = wobble.interpolate({ inputRange: [-4, 4], outputRange: ["-5deg", "5deg"] });

  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }, { rotate: spin }] }]}>
      <View style={styles.shadow} />
      <View style={[styles.eggBody, { backgroundColor: Colors.eggShell }]}>
        <View style={[styles.eggSpot, { top: 22, left: 24, width: 18, height: 14 }]} />
        <View style={[styles.eggSpot, { top: 38, right: 20, width: 12, height: 10 }]} />
        <View style={[styles.eggSpot, { bottom: 24, left: 30, width: 10, height: 8 }]} />
        <View style={styles.eggShine} />
        <View style={styles.eggFace}>
          <View style={styles.eggEye} />
          <View style={styles.eggEye} />
        </View>
        <View style={styles.eggMouth} />
      </View>
    </Animated.View>
  );
}

function CrackingSprite({ mood, bounceAnim, breatheAnim }: { mood: Mood; bounceAnim: Animated.Value; breatheAnim: Animated.Value }) {
  const shake = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(shake, { toValue: -6, duration: 120, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 6, duration: 120, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -4, duration: 100, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 4, duration: 100, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.delay(1200),
      ])
    );
    s.start();
    return () => s.stop();
  }, []);

  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }, { translateX: shake }] }]}>
      <View style={styles.shadow} />
      <View style={[styles.eggBody, { backgroundColor: Colors.eggShell }]}>
        <View style={styles.crackLine1} />
        <View style={styles.crackLine2} />
        <View style={styles.crackLine3} />
        <View style={styles.peekingFace}>
          <View style={styles.eggEye} />
          <View style={styles.eggEye} />
        </View>
        <View style={styles.eggShine} />
        <View style={[styles.popStar, { top: -10, left: 10 }]} />
        <View style={[styles.popStar, { top: -8, right: 8 }]} />
      </View>
    </Animated.View>
  );
}

function BabySprite({ mood, bounceAnim, breatheAnim, blinkAnim }: any) {
  const isHappy = mood === "happy" || mood === "excited";
  const isSleepy = mood === "sleepy";
  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }] }]}>
      <View style={styles.shadow} />
      <View style={[styles.babyBody, { backgroundColor: Colors.babyBlue }]}>
        <View style={styles.bodyInnerGlow} />
        <View style={[styles.babyEarLeft, { backgroundColor: Colors.babyBlue }]} />
        <View style={[styles.babyEarRight, { backgroundColor: Colors.babyBlue }]} />
        <View style={styles.face}>
          <Animated.View style={[styles.babyEye, { opacity: blinkAnim }]}>
            <View style={styles.babyEyeWhite}>
              <View style={styles.babyPupil} />
              <View style={styles.eyeShine} />
            </View>
          </Animated.View>
          <Animated.View style={[styles.babyEye, { opacity: blinkAnim }]}>
            <View style={styles.babyEyeWhite}>
              <View style={styles.babyPupil} />
              <View style={styles.eyeShine} />
            </View>
          </Animated.View>
        </View>
        <View style={[styles.cheek, { opacity: isHappy ? 0.7 : 0.3 }]} />
        <View style={[styles.cheekRight, { opacity: isHappy ? 0.7 : 0.3 }]} />
        {isSleepy ? (
          <View style={[styles.mouthSleep, { width: 12, marginTop: 6 }]} />
        ) : isHappy ? (
          <View style={styles.babyMouthHappy} />
        ) : (
          <View style={[styles.mouthSleep, { width: 14, marginTop: 6 }]} />
        )}
        <View style={styles.babyTailNub} />
      </View>
    </Animated.View>
  );
}

function ChildSprite({ mood, bounceAnim, breatheAnim, blinkAnim, earLeftAnim, earRightAnim }: any) {
  const isSleepy = mood === "sleepy";
  const isHappy = mood === "happy" || mood === "excited";
  const isPlayful = mood === "playful";
  const isLonely = mood === "lonely";
  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }] }]}>
      <View style={styles.shadow} />
      <View style={[styles.childBody, { backgroundColor: Colors.childGreen }]}>
        <View style={styles.bodyInnerGlow} />
        <Animated.View style={[styles.childEarLeft, { backgroundColor: Colors.childGreen, transform: [{ translateY: earLeftAnim }] }]}>
          <View style={[styles.earInner, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        </Animated.View>
        <Animated.View style={[styles.childEarRight, { backgroundColor: Colors.childGreen, transform: [{ translateY: earRightAnim }] }]}>
          <View style={[styles.earInner, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        </Animated.View>
        <View style={styles.face}>
          <Animated.View style={[styles.eye, { opacity: blinkAnim }]}>
            <View style={styles.eyeWhite}><View style={styles.pupil} /><View style={styles.eyeShine} /></View>
          </Animated.View>
          <Animated.View style={[styles.eye, { opacity: blinkAnim }]}>
            <View style={styles.eyeWhite}><View style={styles.pupil} /><View style={styles.eyeShine} /></View>
          </Animated.View>
        </View>
        <View style={[styles.cheek, { opacity: isHappy ? 0.7 : 0.35 }]} />
        <View style={[styles.cheekRight, { opacity: isHappy ? 0.7 : 0.35 }]} />
        {isSleepy ? <View style={styles.mouthSleep} /> : isPlayful ? <View style={styles.mouthOpen} /> : isLonely ? <View style={styles.mouthSad} /> : <View style={styles.mouth} />}
        <View style={styles.childTail} />
        <View style={styles.childTummy} />
      </View>
    </Animated.View>
  );
}

function TeenSprite({ mood, bounceAnim, breatheAnim, blinkAnim, earLeftAnim, earRightAnim }: any) {
  const isSleepy = mood === "sleepy";
  const isHappy = mood === "happy" || mood === "excited";
  const isPlayful = mood === "playful";
  const isLonely = mood === "lonely";
  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }] }]}>
      <View style={[styles.shadow, { width: 105 }]} />
      <View style={[styles.teenBody, { backgroundColor: Colors.teenTeal }]}>
        <View style={styles.bodyInnerGlow} />
        <Animated.View style={[styles.teenEarLeft, { borderBottomColor: Colors.teenTeal, transform: [{ translateY: earLeftAnim }] }]} />
        <Animated.View style={[styles.teenEarRight, { borderBottomColor: Colors.teenTeal, transform: [{ translateY: earRightAnim }] }]} />
        <View style={styles.teenStripe1} />
        <View style={styles.teenStripe2} />
        <View style={styles.face}>
          <Animated.View style={[styles.teenEye, { opacity: blinkAnim }]}>
            <View style={styles.eyeWhite}><View style={[styles.pupil, { backgroundColor: "#1A1A2E" }]} /><View style={styles.eyeShine} /></View>
          </Animated.View>
          <Animated.View style={[styles.teenEye, { opacity: blinkAnim }]}>
            <View style={styles.eyeWhite}><View style={[styles.pupil, { backgroundColor: "#1A1A2E" }]} /><View style={styles.eyeShine} /></View>
          </Animated.View>
        </View>
        <View style={[styles.cheek, { opacity: isHappy ? 0.5 : 0.2, top: 68, left: 14 }]} />
        <View style={[styles.cheekRight, { opacity: isHappy ? 0.5 : 0.2, top: 68, right: 14 }]} />
        {isSleepy ? <View style={styles.mouthSleep} /> : isPlayful ? <View style={styles.mouthOpen} /> : isLonely ? <View style={styles.mouthSad} /> : <View style={[styles.mouth, { width: 20 }]} />}
        <View style={styles.teenTail} />
        <View style={styles.teenFluff} />
      </View>
    </Animated.View>
  );
}

function AdultSprite({ mood, bounceAnim, breatheAnim, blinkAnim, earLeftAnim, earRightAnim, glowAnim }: any) {
  const isSleepy = mood === "sleepy";
  const isHappy = mood === "happy" || mood === "excited";
  const isPlayful = mood === "playful";
  const isLonely = mood === "lonely";
  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }] }]}>
      <Animated.View style={[styles.adultHalo, { opacity: glowAnim }]} />
      <View style={[styles.shadow, { width: 115, opacity: 0.35 }]} />
      <View style={[styles.adultMane, { backgroundColor: Colors.adultAmber }]} />
      <View style={[styles.adultBody, { backgroundColor: Colors.adultGold }]}>
        <View style={styles.bodyInnerGlow} />
        <Animated.View style={[styles.adultEarLeft, { borderBottomColor: Colors.adultGold, transform: [{ translateY: earLeftAnim }] }]}>
          <View style={[styles.adultEarInner, { borderBottomColor: Colors.petBlush }]} />
        </Animated.View>
        <Animated.View style={[styles.adultEarRight, { borderBottomColor: Colors.adultGold, transform: [{ translateY: earRightAnim }] }]}>
          <View style={[styles.adultEarInner, { borderBottomColor: Colors.petBlush }]} />
        </Animated.View>
        <View style={styles.adultGem} />
        <View style={styles.face}>
          <Animated.View style={[styles.adultEye, { opacity: blinkAnim }]}>
            <View style={[styles.eyeWhite, { borderRadius: 14 }]}><View style={[styles.pupil, { width: 14, height: 16, backgroundColor: "#2D1B4E" }]} /><View style={styles.eyeShine} /><View style={styles.eyeShine2} /></View>
          </Animated.View>
          <Animated.View style={[styles.adultEye, { opacity: blinkAnim }]}>
            <View style={[styles.eyeWhite, { borderRadius: 14 }]}><View style={[styles.pupil, { width: 14, height: 16, backgroundColor: "#2D1B4E" }]} /><View style={styles.eyeShine} /><View style={styles.eyeShine2} /></View>
          </Animated.View>
        </View>
        <View style={[styles.cheek, { opacity: isHappy ? 0.65 : 0.28, top: 68, backgroundColor: "#FFB0A0" }]} />
        <View style={[styles.cheekRight, { opacity: isHappy ? 0.65 : 0.28, top: 68, backgroundColor: "#FFB0A0" }]} />
        {isSleepy ? <View style={styles.mouthSleep} /> : isPlayful ? <View style={styles.mouthOpen} /> : isLonely ? <View style={styles.mouthSad} /> : <View style={[styles.mouth, { width: 24 }]} />}
        <View style={styles.adultChestPattern} />
        <View style={styles.adultMarkingLeft} />
        <View style={styles.adultMarkingRight} />
      </View>
      <View style={styles.adultTail} />
    </Animated.View>
  );
}

function LegendarySprite({ mood, bounceAnim, breatheAnim, blinkAnim, earLeftAnim, earRightAnim, glowAnim }: any) {
  const isSleepy = mood === "sleepy";
  const isPlayful = mood === "playful";
  const isLonely = mood === "lonely";
  const wingFlap = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const w = Animated.loop(
      Animated.sequence([
        Animated.timing(wingFlap, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wingFlap, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    w.start();
    return () => w.stop();
  }, []);
  const wingScale = wingFlap.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }] }]}>
      <Animated.View style={[styles.legendaryOuterGlow, { opacity: glowAnim }]} />
      <Animated.View style={[styles.legendaryInnerGlow, { opacity: glowAnim }]} />
      <Animated.View style={[styles.wingLeft, { transform: [{ scaleX: wingScale }] }]}>
        <View style={[styles.wingInner, { backgroundColor: "rgba(200,120,255,0.3)" }]} />
      </Animated.View>
      <Animated.View style={[styles.wingRight, { transform: [{ scaleX: wingScale }] }]}>
        <View style={[styles.wingInner, { backgroundColor: "rgba(120,232,255,0.3)" }]} />
      </Animated.View>
      <View style={[styles.shadow, { width: 120, opacity: 0.25 }]} />
      <View style={[styles.legendaryBody, { backgroundColor: Colors.legendaryViolet }]}>
        <View style={[styles.bodyInnerGlow, { backgroundColor: "rgba(255,255,255,0.25)", width: 70, height: 50 }]} />
        <View style={styles.crown}>
          <View style={[styles.crownPoint, { height: 20, left: 13 }]} />
          <View style={[styles.crownPoint, { height: 28, left: 30 }]} />
          <View style={[styles.crownPoint, { height: 20, right: 13 }]} />
          <View style={styles.crownGem} />
        </View>
        <Animated.View style={[styles.legendaryEarLeft, { borderBottomColor: Colors.legendaryViolet, transform: [{ translateY: earLeftAnim }] }]}>
          <View style={[styles.legendaryEarInner, { borderBottomColor: Colors.legendaryCyan }]} />
        </Animated.View>
        <Animated.View style={[styles.legendaryEarRight, { borderBottomColor: Colors.legendaryViolet, transform: [{ translateY: earRightAnim }] }]}>
          <View style={[styles.legendaryEarInner, { borderBottomColor: Colors.legendaryCyan }]} />
        </Animated.View>
        <View style={styles.face}>
          <Animated.View style={[styles.legendaryEye, { opacity: blinkAnim }]}>
            <View style={[styles.eyeWhite, { backgroundColor: "#E8D0FF", borderRadius: 15 }]}><View style={[styles.pupil, { width: 15, height: 17, backgroundColor: "#3D008A" }]} /><View style={styles.eyeShine} /><View style={[styles.eyeShine2, { backgroundColor: Colors.legendaryCyan }]} /></View>
          </Animated.View>
          <Animated.View style={[styles.legendaryEye, { opacity: blinkAnim }]}>
            <View style={[styles.eyeWhite, { backgroundColor: "#E8D0FF", borderRadius: 15 }]}><View style={[styles.pupil, { width: 15, height: 17, backgroundColor: "#3D008A" }]} /><View style={styles.eyeShine} /><View style={[styles.eyeShine2, { backgroundColor: Colors.legendaryCyan }]} /></View>
          </Animated.View>
        </View>
        <View style={[styles.cheek, { opacity: 0.6, top: 72, backgroundColor: Colors.legendaryCyan }]} />
        <View style={[styles.cheekRight, { opacity: 0.6, top: 72, backgroundColor: Colors.legendaryCyan }]} />
        {isSleepy ? <View style={styles.mouthSleep} /> : isPlayful ? <View style={styles.mouthOpen} /> : isLonely ? <View style={styles.mouthSad} /> : <View style={[styles.mouth, { width: 26, borderBottomColor: Colors.legendaryCyan }]} />}
        <View style={styles.legendaryChestStar} />
        <View style={[styles.sparkleLeft, { top: -5 }]}><View style={[styles.sparkle, { backgroundColor: Colors.legendaryCyan, width: 10, height: 10, borderRadius: 5 }]} /></View>
        <View style={[styles.sparkleRight, { top: -5 }]}><View style={[styles.sparkle, { backgroundColor: Colors.adultGold, width: 10, height: 10, borderRadius: 5 }]} /></View>
      </View>
    </Animated.View>
  );
}

function CelestialSprite({ mood, bounceAnim, breatheAnim, blinkAnim, earLeftAnim, earRightAnim, glowAnim }: any) {
  const isSleepy = mood === "sleepy";
  const isHappy = mood === "happy" || mood === "excited";
  const isPlayful = mood === "playful";
  const isLonely = mood === "lonely";
  const haloSpin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const h = Animated.loop(
      Animated.timing(haloSpin, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    );
    h.start();
    return () => h.stop();
  }, []);
  const haloRotate = haloSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View style={[styles.petWrapper, { transform: [{ translateY: bounceAnim }, { scale: breatheAnim }] }]}>
      <Animated.View style={[styles.celestialRing, { transform: [{ rotate: haloRotate }] }]} />
      <Animated.View style={[styles.celestialOuterGlow, { opacity: glowAnim }]} />
      <View style={[styles.celestialWingLeft, { backgroundColor: "rgba(255,120,200,0.22)" }]}>
        <View style={[styles.celestialWingDetail, { backgroundColor: "rgba(255,216,120,0.35)" }]} />
      </View>
      <View style={[styles.celestialWingRight, { backgroundColor: "rgba(120,232,255,0.22)" }]}>
        <View style={[styles.celestialWingDetail, { backgroundColor: "rgba(255,216,120,0.35)" }]} />
      </View>
      <View style={[styles.shadow, { width: 125, opacity: 0.18 }]} />
      <View style={[styles.celestialBody, { backgroundColor: Colors.celestialPink }]}>
        <View style={[styles.bodyInnerGlow, { backgroundColor: "rgba(255,255,255,0.35)", width: 75, height: 55, top: 6 }]} />
        <View style={styles.celestialCrown}>
          <View style={[styles.crownPoint, { height: 16, left: 10, backgroundColor: Colors.celestialGold }]} />
          <View style={[styles.crownPoint, { height: 24, left: 28, backgroundColor: Colors.celestialGold }]} />
          <View style={[styles.crownPoint, { height: 16, right: 10, backgroundColor: Colors.celestialGold }]} />
          <View style={[styles.crownGem, { backgroundColor: Colors.legendaryCyan, width: 12, height: 12, borderRadius: 6, top: -4, left: 28 }]} />
          <View style={[styles.crownGem, { backgroundColor: Colors.celestialPink, width: 7, height: 7, borderRadius: 3.5, top: 2, left: 12 }]} />
          <View style={[styles.crownGem, { backgroundColor: Colors.celestialPink, width: 7, height: 7, borderRadius: 3.5, top: 2, right: 12 }]} />
        </View>
        <Animated.View style={[styles.celestialEarLeft, { borderBottomColor: Colors.celestialPink, transform: [{ translateY: earLeftAnim }] }]}>
          <View style={[styles.legendaryEarInner, { borderBottomColor: Colors.celestialGold, height: 35 }]} />
        </Animated.View>
        <Animated.View style={[styles.celestialEarRight, { borderBottomColor: Colors.celestialPink, transform: [{ translateY: earRightAnim }] }]}>
          <View style={[styles.legendaryEarInner, { borderBottomColor: Colors.celestialGold, height: 35 }]} />
        </Animated.View>
        <View style={styles.face}>
          <Animated.View style={[styles.celestialEye, { opacity: blinkAnim }]}>
            <View style={[styles.eyeWhite, { backgroundColor: "#FFF0F8", borderRadius: 16, width: 30, height: 32 }]}><View style={[styles.pupil, { width: 16, height: 18, backgroundColor: "#6B0080", borderRadius: 8 }]} /><View style={styles.eyeShine} /><View style={[styles.eyeShine2, { backgroundColor: Colors.celestialGold }]} /><View style={styles.eyeShine3} /></View>
          </Animated.View>
          <Animated.View style={[styles.celestialEye, { opacity: blinkAnim }]}>
            <View style={[styles.eyeWhite, { backgroundColor: "#FFF0F8", borderRadius: 16, width: 30, height: 32 }]}><View style={[styles.pupil, { width: 16, height: 18, backgroundColor: "#6B0080", borderRadius: 8 }]} /><View style={styles.eyeShine} /><View style={[styles.eyeShine2, { backgroundColor: Colors.celestialGold }]} /><View style={styles.eyeShine3} /></View>
          </Animated.View>
        </View>
        <View style={[styles.cheek, { opacity: 0.7, top: 82, left: 12, width: 28, height: 18, backgroundColor: Colors.accentLight }]} />
        <View style={[styles.cheekRight, { opacity: 0.7, top: 82, right: 12, width: 28, height: 18, backgroundColor: Colors.accentLight }]} />
        {isSleepy ? <View style={[styles.mouthSleep, { marginTop: 14 }]} /> : isPlayful ? <View style={[styles.mouthOpen, { backgroundColor: "#FFB8D8" }]} /> : isLonely ? <View style={styles.mouthSad} /> : <View style={[styles.mouth, { width: 28, borderBottomColor: Colors.celestialGold, marginTop: 12 }]} />}
        <View style={styles.celestialChestOrb} />
        <View style={[styles.constellation, { top: 30, left: 10 }]} />
        <View style={[styles.constellation, { top: 20, left: 22 }]} />
        <View style={[styles.constellation, { top: 32, left: 34 }]} />
        <View style={[styles.constellation, { top: 30, right: 10 }]} />
        <View style={[styles.constellation, { top: 20, right: 22 }]} />
        <View style={[styles.sparkleLeft, { top: -8 }]}><View style={[styles.sparkle, { backgroundColor: Colors.celestialGold, width: 12, height: 12, borderRadius: 6 }]} /></View>
        <View style={[styles.sparkleRight, { top: -8 }]}><View style={[styles.sparkle, { backgroundColor: Colors.legendaryCyan, width: 12, height: 12, borderRadius: 6 }]} /></View>
        <View style={[styles.sparkleLeft, { top: 30, left: -20 }]}><View style={[styles.sparkle, { backgroundColor: Colors.celestialPink, width: 8, height: 8, borderRadius: 4 }]} /></View>
        <View style={[styles.sparkleRight, { top: 30, right: -20 }]}><View style={[styles.sparkle, { backgroundColor: Colors.adultGold, width: 8, height: 8, borderRadius: 4 }]} /></View>
      </View>
    </Animated.View>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main PetAvatar
// ──────────────────────────────────────────────────────────────────────────────

interface PetAvatarProps {
  mood?: Mood;
  stage?: EvolutionStage;
}

export default function PetAvatar({ mood = "happy", stage = "adult" }: PetAvatarProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const earLeftAnim = useRef(new Animated.Value(0)).current;
  const earRightAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  const isEgg = stage === "egg" || stage === "cracking";

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    bounce.start();

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.04, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    breathe.start();

    const blink = Animated.loop(
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(blinkAnim, { toValue: 0.1, duration: 120, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.delay(3500),
      ])
    );
    if (!isEgg) blink.start();

    const earLeft = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(earLeftAnim, { toValue: -8, duration: 300, easing: Easing.out(Easing.sin), useNativeDriver: true }),
        Animated.timing(earLeftAnim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(4000),
      ])
    );
    if (!isEgg) earLeft.start();

    const earRight = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(earRightAnim, { toValue: 8, duration: 300, easing: Easing.out(Easing.sin), useNativeDriver: true }),
        Animated.timing(earRightAnim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(3800),
      ])
    );
    if (!isEgg) earRight.start();

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    glow.start();

    return () => {
      bounce.stop(); breathe.stop(); blink.stop();
      earLeft.stop(); earRight.stop(); glow.stop();
    };
  }, [stage]);

  const isHappy = mood === "happy" || mood === "excited";
  const isSleepy = mood === "sleepy";

  const glowColor =
    stage === "celestial" ? "rgba(255,120,200,0.3)"
    : stage === "legendary" ? "rgba(200,120,255,0.3)"
    : stage === "adult" ? "rgba(255,200,80,0.25)"
    : stage === "teen" ? "rgba(168,232,224,0.2)"
    : isHappy ? Colors.primaryGlow
    : isSleepy ? "rgba(255,228,214,0.2)"
    : "rgba(255,123,107,0.25)";

  const hasParticles = !isEgg;
  const hasHearts = isHappy && !isEgg && stage !== "baby";
  const hasStars = (stage === "legendary" || stage === "celestial") && isHappy;

  const containerHeight =
    stage === "celestial" ? 260
    : stage === "legendary" ? 250
    : stage === "adult" ? 240
    : stage === "teen" ? 230
    : 220;

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {hasParticles && (
        <View style={styles.particles}>
          <GlowOrb delay={0} x={10} size={6} color={Colors.primary} />
          <GlowOrb delay={1200} x={90} size={4} color={Colors.accent} />
          <GlowOrb delay={2400} x={50} size={5} color={Colors.secondary} />
          <GlowOrb delay={600} x={130} size={4} color={Colors.primaryLight} />
          <GlowOrb delay={1800} x={-5} size={5} color={Colors.accentLight} />
        </View>
      )}
      {hasHearts && (
        <View style={styles.heartsLayer}>
          <FloatingHeart delay={0} x={20} y={80} />
          <FloatingHeart delay={1500} x={100} y={90} />
          <FloatingHeart delay={800} x={60} y={70} />
        </View>
      )}
      {hasStars && (
        <View style={styles.heartsLayer}>
          <FloatingStar delay={0} x={15} y={85} color={Colors.celestialGold} />
          <FloatingStar delay={1000} x={110} y={95} color={Colors.legendaryCyan} />
          <FloatingStar delay={500} x={65} y={75} color={Colors.legendaryViolet} />
        </View>
      )}
      <Animated.View style={[styles.halo, { opacity: glowAnim, backgroundColor: glowColor }]} />
      {stage === "egg" && <EggSprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} />}
      {stage === "cracking" && <CrackingSprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} />}
      {stage === "baby" && <BabySprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} blinkAnim={blinkAnim} />}
      {stage === "child" && <ChildSprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} blinkAnim={blinkAnim} earLeftAnim={earLeftAnim} earRightAnim={earRightAnim} />}
      {stage === "teen" && <TeenSprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} blinkAnim={blinkAnim} earLeftAnim={earLeftAnim} earRightAnim={earRightAnim} />}
      {stage === "adult" && <AdultSprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} blinkAnim={blinkAnim} earLeftAnim={earLeftAnim} earRightAnim={earRightAnim} glowAnim={glowAnim} />}
      {stage === "legendary" && <LegendarySprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} blinkAnim={blinkAnim} earLeftAnim={earLeftAnim} earRightAnim={earRightAnim} glowAnim={glowAnim} />}
      {stage === "celestial" && <CelestialSprite mood={mood} bounceAnim={bounceAnim} breatheAnim={breatheAnim} blinkAnim={blinkAnim} earLeftAnim={earLeftAnim} earRightAnim={earRightAnim} glowAnim={glowAnim} />}
    </View>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", width: 200 },
  particles: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  orb: { position: "absolute", bottom: 50, borderRadius: 50 },
  heartsLayer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  heartParticle: { position: "absolute" },
  heartShape: { width: 14, height: 12, backgroundColor: Colors.petCoral, borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomLeftRadius: 2, borderBottomRightRadius: 7, transform: [{ rotate: "-45deg" }] },
  starShape: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 12, borderLeftColor: "transparent", borderRightColor: "transparent" },
  halo: { position: "absolute", width: 180, height: 180, borderRadius: 90 },
  petWrapper: { alignItems: "center", justifyContent: "center" },
  shadow: { position: "absolute", bottom: -12, width: 100, height: 20, backgroundColor: Colors.shadowStrong, borderRadius: 50, opacity: 0.4 },
  face: { flexDirection: "row", gap: 20, marginTop: -5 },
  eyeWhite: { width: 24, height: 28, backgroundColor: "#FFFFFF", borderRadius: 12, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  pupil: { width: 13, height: 15, backgroundColor: Colors.textDark, borderRadius: 7 },
  eyeShine: { position: "absolute", top: 4, right: 5, width: 7, height: 7, backgroundColor: "#FFFFFF", borderRadius: 4 },
  eyeShine2: { position: "absolute", bottom: 5, left: 4, width: 5, height: 5, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 3 },
  eyeShine3: { position: "absolute", top: 5, left: 4, width: 4, height: 4, backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 2 },
  eye: { width: 24, height: 28 },
  cheek: { position: "absolute", left: 16, top: 56, width: 22, height: 14, backgroundColor: Colors.petBlush, borderRadius: 11 },
  cheekRight: { position: "absolute", right: 16, top: 56, width: 22, height: 14, backgroundColor: Colors.petBlush, borderRadius: 11 },
  mouth: { width: 22, height: 12, borderBottomWidth: 3, borderBottomColor: Colors.textDark, borderRadius: 12, marginTop: 5 },
  mouthSleep: { width: 16, height: 3, backgroundColor: Colors.textDark, borderRadius: 2, marginTop: 10 },
  mouthOpen: { width: 18, height: 18, backgroundColor: "#FFB8C8", borderRadius: 10, marginTop: 5 },
  mouthSad: { width: 18, height: 10, borderTopWidth: 3, borderTopColor: Colors.textDark, borderRadius: 10, marginTop: 12 },
  bodyInnerGlow: { position: "absolute", top: 8, left: 20, width: 60, height: 40, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 30 },
  earInner: { position: "absolute", bottom: 6, left: 8, width: 20, height: 28, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 12 },
  sparkleLeft: { position: "absolute", top: -10, left: -15 },
  sparkleRight: { position: "absolute", top: -10, right: -15 },
  sparkle: { width: 8, height: 8, backgroundColor: Colors.accent, borderRadius: 4 },

  // Egg
  eggBody: { width: 100, height: 120, borderRadius: 50, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  eggSpot: { position: "absolute", backgroundColor: Colors.eggSpot, borderRadius: 10 },
  eggShine: { position: "absolute", top: 14, left: 22, width: 22, height: 30, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 14, transform: [{ rotate: "-20deg" }] },
  eggFace: { flexDirection: "row", gap: 14, marginTop: 10 },
  eggEye: { width: 9, height: 9, backgroundColor: Colors.textDark, borderRadius: 5 },
  eggMouth: { width: 10, height: 5, borderBottomWidth: 2, borderBottomColor: Colors.textDark, borderRadius: 5, marginTop: 5 },

  // Cracking
  crackLine1: { position: "absolute", top: 32, left: 40, width: 3, height: 28, backgroundColor: Colors.textDark, borderRadius: 2, transform: [{ rotate: "12deg" }], opacity: 0.5 },
  crackLine2: { position: "absolute", top: 28, left: 45, width: 2, height: 18, backgroundColor: Colors.textDark, borderRadius: 2, transform: [{ rotate: "-20deg" }], opacity: 0.45 },
  crackLine3: { position: "absolute", top: 38, right: 32, width: 2, height: 22, backgroundColor: Colors.textDark, borderRadius: 2, transform: [{ rotate: "8deg" }], opacity: 0.4 },
  peekingFace: { flexDirection: "row", gap: 12, marginTop: 20, marginLeft: 4 },
  popStar: { position: "absolute", width: 8, height: 8, backgroundColor: Colors.adultGold, borderRadius: 4 },

  // Baby
  babyBody: { width: 90, height: 80, borderRadius: 45, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: Colors.babyBlue, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 6 },
  babyEarLeft: { position: "absolute", top: -10, left: 18, width: 22, height: 28, borderRadius: 12, overflow: "hidden" },
  babyEarRight: { position: "absolute", top: -10, right: 18, width: 22, height: 28, borderRadius: 12, overflow: "hidden" },
  babyEye: { width: 20, height: 24 },
  babyEyeWhite: { width: 20, height: 24, backgroundColor: "#FFFFFF", borderRadius: 10, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  babyPupil: { width: 11, height: 13, backgroundColor: Colors.textDark, borderRadius: 6 },
  babyMouthHappy: { width: 16, height: 8, borderBottomWidth: 2.5, borderBottomColor: Colors.textDark, borderRadius: 10, marginTop: 4 },
  babyTailNub: { position: "absolute", right: -10, bottom: 20, width: 16, height: 16, backgroundColor: Colors.babyBlue, borderRadius: 10 },

  // Child
  childBody: { width: 110, height: 96, borderRadius: 55, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: Colors.childGreen, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 7 },
  childEarLeft: { position: "absolute", top: -16, left: 16, width: 28, height: 36, borderRadius: 16, overflow: "hidden" },
  childEarRight: { position: "absolute", top: -16, right: 16, width: 28, height: 36, borderRadius: 16, overflow: "hidden" },
  childTail: { position: "absolute", right: -14, bottom: 18, width: 22, height: 22, backgroundColor: Colors.childYellow, borderRadius: 12, borderWidth: 3, borderColor: Colors.childGreen },
  childTummy: { position: "absolute", bottom: 14, width: 44, height: 28, backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 22 },

  // Teen
  teenBody: { width: 118, height: 106, borderRadius: 58, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: Colors.teenTeal, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 8 },
  teenEarLeft: { position: "absolute", top: -24, left: 22, width: 0, height: 0, borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 32, borderLeftColor: "transparent", borderRightColor: "transparent" },
  teenEarRight: { position: "absolute", top: -24, right: 22, width: 0, height: 0, borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 32, borderLeftColor: "transparent", borderRightColor: "transparent" },
  teenEye: { width: 24, height: 28 },
  teenStripe1: { position: "absolute", top: 20, left: 8, width: 16, height: 6, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, transform: [{ rotate: "30deg" }] },
  teenStripe2: { position: "absolute", top: 30, left: 10, width: 10, height: 4, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 3, transform: [{ rotate: "30deg" }] },
  teenTail: { position: "absolute", right: -18, bottom: 15, width: 30, height: 24, backgroundColor: Colors.teenOrange, borderRadius: 14, transform: [{ rotate: "20deg" }] },
  teenFluff: { position: "absolute", bottom: -8, width: 60, height: 22, backgroundColor: Colors.teenOrange, borderRadius: 14, opacity: 0.85 },

  // Adult
  adultHalo: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,200,80,0.22)" },
  adultBody: { width: 130, height: 116, borderRadius: 65, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: Colors.adultGold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.45, shadowRadius: 22, elevation: 10 },
  adultMane: { position: "absolute", top: -15, width: 148, height: 120, borderRadius: 74, opacity: 0.7, zIndex: -1 },
  adultEarLeft: { position: "absolute", top: -28, left: 20, width: 0, height: 0, borderLeftWidth: 15, borderRightWidth: 15, borderBottomWidth: 38, borderLeftColor: "transparent", borderRightColor: "transparent" },
  adultEarRight: { position: "absolute", top: -28, right: 20, width: 0, height: 0, borderLeftWidth: 15, borderRightWidth: 15, borderBottomWidth: 38, borderLeftColor: "transparent", borderRightColor: "transparent" },
  adultEarInner: { position: "absolute", bottom: 4, left: 6, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 22, borderLeftColor: "transparent", borderRightColor: "transparent" },
  adultEye: { width: 26, height: 30 },
  adultGem: { position: "absolute", top: 8, width: 12, height: 14, backgroundColor: Colors.petBlush, borderRadius: 7, borderWidth: 2, borderColor: Colors.adultAmber },
  adultChestPattern: { position: "absolute", bottom: 18, width: 50, height: 34, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 25 },
  adultMarkingLeft: { position: "absolute", top: 28, left: 8, width: 12, height: 28, backgroundColor: "rgba(255,160,68,0.3)", borderRadius: 8, transform: [{ rotate: "15deg" }] },
  adultMarkingRight: { position: "absolute", top: 28, right: 8, width: 12, height: 28, backgroundColor: "rgba(255,160,68,0.3)", borderRadius: 8, transform: [{ rotate: "-15deg" }] },
  adultTail: { position: "absolute", right: -22, bottom: 18, width: 38, height: 30, backgroundColor: Colors.adultAmber, borderRadius: 18, transform: [{ rotate: "25deg" }] },

  // Legendary
  legendaryOuterGlow: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(200,120,255,0.18)" },
  legendaryInnerGlow: { position: "absolute", width: 170, height: 170, borderRadius: 85, backgroundColor: "rgba(120,232,255,0.14)" },
  wingLeft: { position: "absolute", left: -42, top: 30, width: 56, height: 80, backgroundColor: "rgba(200,120,255,0.35)", borderRadius: 30, transform: [{ rotate: "-15deg" }] },
  wingRight: { position: "absolute", right: -42, top: 30, width: 56, height: 80, backgroundColor: "rgba(120,232,255,0.35)", borderRadius: 30, transform: [{ rotate: "15deg" }] },
  wingInner: { position: "absolute", top: 10, left: 8, right: 8, bottom: 10, borderRadius: 22 },
  legendaryBody: { width: 136, height: 120, borderRadius: 68, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: Colors.legendaryViolet, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 28, elevation: 12 },
  crown: { position: "absolute", top: -30, width: 80, height: 32, flexDirection: "row", alignItems: "flex-end" },
  crownPoint: { position: "absolute", width: 14, height: 24, backgroundColor: Colors.adultGold, borderTopLeftRadius: 7, borderTopRightRadius: 7, bottom: 0 },
  crownGem: { position: "absolute", width: 10, height: 10, backgroundColor: Colors.legendaryCyan, borderRadius: 5, top: -2, left: 35 },
  legendaryEarLeft: { position: "absolute", top: -32, left: 18, width: 0, height: 0, borderLeftWidth: 16, borderRightWidth: 16, borderBottomWidth: 44, borderLeftColor: "transparent", borderRightColor: "transparent" },
  legendaryEarRight: { position: "absolute", top: -32, right: 18, width: 0, height: 0, borderLeftWidth: 16, borderRightWidth: 16, borderBottomWidth: 44, borderLeftColor: "transparent", borderRightColor: "transparent" },
  legendaryEarInner: { position: "absolute", bottom: 4, left: 7, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 28, borderLeftColor: "transparent", borderRightColor: "transparent" },
  legendaryEye: { width: 28, height: 32 },
  legendaryChestStar: { position: "absolute", bottom: 22, width: 16, height: 16, backgroundColor: Colors.adultGold, borderRadius: 3, transform: [{ rotate: "45deg" }] },

  // Celestial
  celestialRing: { position: "absolute", width: 220, height: 40, borderRadius: 110, borderWidth: 3, borderColor: Colors.celestialGold, borderStyle: "dashed", opacity: 0.5 },
  celestialOuterGlow: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255,120,200,0.16)" },
  celestialWingLeft: { position: "absolute", left: -55, top: 15, width: 70, height: 100, borderRadius: 40, transform: [{ rotate: "-12deg" }] },
  celestialWingRight: { position: "absolute", right: -55, top: 15, width: 70, height: 100, borderRadius: 40, transform: [{ rotate: "12deg" }] },
  celestialWingDetail: { position: "absolute", top: 12, left: 10, right: 10, bottom: 12, borderRadius: 30 },
  celestialBody: { width: 144, height: 128, borderRadius: 72, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: Colors.celestialPink, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 32, elevation: 14 },
  celestialCrown: { position: "absolute", top: -34, width: 86, height: 36, flexDirection: "row", alignItems: "flex-end" },
  celestialEarLeft: { position: "absolute", top: -38, left: 15, width: 0, height: 0, borderLeftWidth: 18, borderRightWidth: 18, borderBottomWidth: 52, borderLeftColor: "transparent", borderRightColor: "transparent" },
  celestialEarRight: { position: "absolute", top: -38, right: 15, width: 0, height: 0, borderLeftWidth: 18, borderRightWidth: 18, borderBottomWidth: 52, borderLeftColor: "transparent", borderRightColor: "transparent" },
  celestialEye: { width: 30, height: 32 },
  celestialChestOrb: { position: "absolute", bottom: 24, width: 22, height: 22, backgroundColor: Colors.legendaryCyan, borderRadius: 11, shadowColor: Colors.legendaryCyan, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, borderWidth: 2, borderColor: Colors.celestialGold },
  constellation: { position: "absolute", width: 4, height: 4, backgroundColor: Colors.celestialGold, borderRadius: 2, opacity: 0.6 },
  eyeShine3: { position: "absolute", top: 5, left: 4, width: 4, height: 4, backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 2 }
});