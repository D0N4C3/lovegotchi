import React from "react";
import { ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BookHeart, Plus, Sparkles } from "lucide-react-native";
import Colors from "@/constants/colors";
import { usePetStore } from "@/store/petStore";
import MemoryCard from "@/components/MemoryCard";

export default function MemoriesScreen() {
  const { memories, name } = usePetStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Memory Vault</Text>
            <Text style={styles.subtitle}>
              {memories.length} memories with {name}
            </Text>
          </View>
          <Pressable style={styles.addButton}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color={Colors.text} />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Empty state or list */}
        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrapper}>
              <BookHeart size={48} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptyText}>
              Add your first memory with your partner and {name} will treasure it forever.
            </Text>
            <Pressable style={styles.emptyButton}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyButtonGradient}
              >
                <Sparkles size={16} color={Colors.text} />
                <Text style={styles.emptyButtonText}>Add First Memory</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  addButton: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "rgba(255,139,123,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  list: {
    paddingTop: 4,
  },
  bottomSpacer: {
    height: 30,
  },
});
