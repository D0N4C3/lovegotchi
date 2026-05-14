import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Moon, Sparkles, Zap } from 'lucide-react-native';
import { usePetStore } from '@/store/petStore';
import AppScreen from '@/components/ui/AppScreen';
import GlassCard from '@/components/ui/GlassCard';
import PetAvatar from '@/components/PetAvatar';
import Colors from '@/constants/colors';

const MOOD_LINES: Record<string, string> = {
  happy:   'Mochi is glowing with affection tonight ✨',
  sleepy:  'Mochi feels sleepy and wants a cozy tuck-in 🌙',
  hungry:  'Tiny tummy alert — a snack would be magical 🍓',
  playful: 'Mochi has zoomies and wants to play 🎈',
  lonely:  'Mochi misses your duo energy 💞',
  excited: 'Mochi is bursting with happy wiggles 💫',
};

const ACTIONS = [
  { label: 'Feed',   colors: ['#FF879E', '#FFB3AF'] as const },
  { label: 'Play',   colors: ['#F39CFF', '#B58FFF'] as const },
  { label: 'Cuddle', colors: ['#FF5C8A', '#FF8FB1'] as const },
  { label: 'Sleep',  colors: ['#7598FF', '#8B5CF6'] as const },
];

interface StatPillProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  tint: string;
}

function StatPill({ label, value, icon, tint }: StatPillProps) {
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

  const actionHandlers: Record<string, () => void> = {
    Feed:   pet.feed,
    Play:   pet.play,
    Cuddle: pet.cuddle,
    Sleep:  pet.sleep,
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Love Nest</Text>
        <Text style={styles.subtitle}>{pet.streak}-day together streak 🔥</Text>
      </View>

      {/* Hero Pet Card */}
      <GlassCard style={styles.heroCard}>
        <LinearGradient
          colors={Colors.gradients.cardGlow}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.moodLine}>
              {MOOD_LINES[pet.mood] ?? MOOD_LINES.happy}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Sparkles size={13} color={Colors.accent} />
            <Text style={styles.levelText}>Lv {pet.level}</Text>
          </View>
        </View>
        <View style={styles.avatarWrap}>
          <PetAvatar />
        </View>
      </GlassCard>

      {/* Vitals */}
      <GlassCard style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Emotional Vitals</Text>
        <View style={styles.statsGrid}>
          <StatPill
            label="Love"
            value={pet.love}
            icon={<Heart size={14} color="#FF8FB1" fill="#FF8FB1" />}
            tint="rgba(255,143,177,0.45)"
          />
          <StatPill
            label="Joy"
            value={pet.happiness}
            icon={<Sparkles size={14} color="#F6C8FF" />}
            tint="rgba(246,200,255,0.45)"
          />
          <StatPill
            label="Energy"
            value={pet.energy}
            icon={<Zap size={14} color="#A5BAFF" />}
            tint="rgba(165,186,255,0.45)"
          />
          <StatPill
            label="Rest"
            value={pet.cleanliness}
            icon={<Moon size={14} color="#BDA8FF" />}
            tint="rgba(189,168,255,0.45)"
          />
        </View>
      </GlassCard>

      {/* Care Actions */}
      <Text style={styles.sectionTitle}>Care Rituals</Text>
      <View style={styles.actionGrid}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            onPress={actionHandlers[action.label]}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          >
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
  header: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  heroCard: {
    padding: 18,
    minHeight: 340,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  petName: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  moodLine: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 200,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  levelText: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  avatarWrap: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statsCard: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statPill: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 5,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  statValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#2A1230',
    fontWeight: '800',
    fontSize: 14,
  },
});