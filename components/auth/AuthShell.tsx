import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Colors from "@/constants/colors";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.root}>
      {/* Background orbs */}
      <View style={[s.orb, s.orb1]} />
      <View style={[s.orb, s.orb2]} />
      <View style={[s.orb, s.orb3]} />
      <SafeAreaView style={s.safe}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoBadge />
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LogoBadge() {
  return (
    <View style={s.logoBadge}>
      <View style={s.logoPill}>
        <View style={s.logoDot} />
        <Text style={s.logoText}>Lovegotchi</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: 28, paddingTop: 16, gap: 16 },
  orb: { position: "absolute", borderRadius: 999 },
  orb1: { width: 280, height: 280, backgroundColor: Colors.primary, opacity: 0.20, top: -100, right: -80, transform: [{ scale: 1 }] },
  orb2: { width: 200, height: 200, backgroundColor: Colors.secondary, opacity: 0.15, bottom: 60, left: -60 },
  orb3: { width: 160, height: 160, backgroundColor: Colors.teal, opacity: 0.12, bottom: 180, right: 20 },
  logoBadge: { marginBottom: 4 },
  logoPill: {
    alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(127,119,221,0.20)", borderWidth: 0.5,
    borderColor: "rgba(127,119,221,0.45)", borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  logoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primaryLight },
  logoText: { fontSize: 12, fontWeight: "600", color: Colors.primaryLight, letterSpacing: 0.5 },
});