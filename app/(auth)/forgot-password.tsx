import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthInput } from "@/components/auth/AuthInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import Colors from "@/constants/colors";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { forgotPassword, authLoading } = useAuth();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit(async ({ email }) => {
    try {
      await forgotPassword(email.trim());
      toast.show("Password reset email sent 💌");
      router.back();
    } catch (e: any) {
      toast.show(e?.message ?? "Could not send reset email");
    }
  });

  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.iconWrap}>
        <Text style={styles.icon}>💌</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          No worries — we'll send a magic reset link straight to your inbox.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140).springify()}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AuthInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={submit}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.email?.message}
            />
          )}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.actions}>
        <PrimaryButton
          label={authLoading ? "Sending…" : "Send reset link 💌"}
          onPress={submit}
          disabled={authLoading}
        />
        <Text style={styles.hint}>
          Check your spam folder if it doesn't arrive within a few minutes.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).springify()} style={styles.footer}>
        <Text style={styles.footerText}>
          Remember it?{" "}
          <Link href="/(auth)/login" style={styles.footerLink}>
            Back to login
          </Link>
        </Text>
      </Animated.View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  icon: {
    fontSize: 56,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 21,
  },
  actions: {
    gap: 12,
  },
  hint: {
    fontSize: 12,
    color: Colors.textHint,
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.textMuted,
  },
  footerLink: {
    color: Colors.primaryLight,
    fontWeight: "600",
  },
});