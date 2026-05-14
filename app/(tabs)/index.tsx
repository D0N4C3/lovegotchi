import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Moon, Sparkles, Zap } from 'lucide-react-native';
import { usePetStore } from '@/store/petStore';
import AppScreen from '@/components/ui/AppScreen';
import GlassCard from '@/components/ui/GlassCard';
import PetAvatar from '@/components/PetAvatar';
import Colors from '@/constants/colors';

const moodLine: Record<string, string> = {
  happy: 'Mochi is glowing with affection tonight ✨',
  sleepy: 'Mochi feels sleepy and wants a cozy tuck-in 🌙',
  hungry: 'Tiny tummy alert. A snack would be magical 🍓',
  playful: 'Mochi has zoomies and wants to play 🎈',
  lonely: 'Mochi misses your duo energy 💞',
  excited: 'Mochi is bursting with happy wiggles 💫',
};

function StatPill({ label, value, icon, tint }: { label: string; value: number; icon: React.ReactNode; tint: string }) {
  return (
    <View style={[styles.statPill, { borderColor: tint }]}>
      {icon}
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}%</Text>
    </View>
  );
}

export default function HomeScreen() {
  const pet = usePetStore();

  const actions = [
    { label: 'Feed', onPress: pet.feed, colors: ['#FF879E', '#FFB3AF'] as const },
    { label: 'Play', onPress: pet.play, colors: ['#F39CFF', '#B58FFF'] as const },
    { label: 'Cuddle', onPress: pet.cuddle, colors: ['#FF5C8A', '#FF8FB1'] as const },
    { label: 'Sleep', onPress: pet.sleep, colors: ['#7598FF', '#8B5CF6'] as const },
  ];

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Love Nest</Text>
        <Text style={styles.subtitle}>{pet.streak}-day together streak</Text>
      </View>

      <GlassCard style={styles.heroCard}>
        <LinearGradient colors={Colors.gradients.cardGlow} style={StyleSheet.absoluteFill} />
        <View style={styles.heroTop}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.levelBadge}><Sparkles size={14} color={Colors.accent} /><Text style={styles.levelText}>Lv {pet.level}</Text></View>
        </View>
        <Text style={styles.mood}>{moodLine[pet.mood] ?? moodLine.happy}</Text>
        <View style={styles.avatarWrap}><PetAvatar /></View>
      </GlassCard>

      <GlassCard style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Emotional Vitals</Text>
        <View style={styles.statsRow}>
          <StatPill label="Love" value={pet.love} icon={<Heart size={14} color="#FF8FB1" />} tint="rgba(255,143,177,0.5)" />
          <StatPill label="Joy" value={pet.happiness} icon={<Sparkles size={14} color="#F6C8FF" />} tint="rgba(246,200,255,0.5)" />
        </View>
        <View style={styles.statsRow}>
          <StatPill label="Energy" value={pet.energy} icon={<Zap size={14} color="#A5BAFF" />} tint="rgba(165,186,255,0.5)" />
          <StatPill label="Rest" value={pet.cleanliness} icon={<Moon size={14} color="#BDA8FF" />} tint="rgba(189,168,255,0.5)" />
        </View>
      </GlassCard>

      <Text style={styles.sectionTitle}>Care Rituals</Text>
      <View style={styles.actionGrid}>
        {actions.map((action) => (
          <Pressable key={action.label} onPress={action.onPress} style={styles.actionButton}>
            <LinearGradient colors={action.colors} style={styles.actionGradient}>
              <Text style={styles.actionText}>{action.label}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4 },
  title: { color: Colors.text, fontSize: 34, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: 14 },
  heroCard: { padding: 18, minHeight: 360 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { color: Colors.text, fontSize: 28, fontWeight: '800' },
  levelBadge: { flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  levelText: { color: Colors.accent, fontWeight: '700' },
  mood: { color: Colors.textMuted, marginTop: 8, fontSize: 14, lineHeight: 20 },
  avatarWrap: { marginTop: 10, alignItems: 'center', justifyContent: 'center' },
  statsCard: { padding: 16, gap: 12 },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statPill: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', gap: 5 },
  statLabel: { color: Colors.textMuted, fontSize: 12 },
  statValue: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionButton: { width: '48%', borderRadius: 16, overflow: 'hidden' },
  actionGradient: { paddingVertical: 14, alignItems: 'center' },
  actionText: { color: '#2A1230', fontWeight: '800', fontSize: 14 },
});
