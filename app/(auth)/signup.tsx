import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthInput } from "@/components/auth/AuthInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import Colors from "@/constants/colors";

const schema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.literal(true),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

type StrengthConfig = { color: string; width: string; label: string };

const STRENGTH_CONFIG: Record<string, StrengthConfig> = {
  "Too short": { color: "#F09595", width: "20%", label: "Too short" },
  Weak:        { color: "#F09595", width: "30%", label: "Weak" },
  Fair:        { color: "#EF9F27", width: "55%", label: "Fair — keep going" },
  Good:        { color: "#97C459", width: "75%", label: "Good — almost there" },
  Strong:      { color: "#1D9E75", width: "100%", label: "Strong 💪" },
};

export default function Signup() {
  const { signup, loginGoogle, authLoading } = useAuth();
  const toast = useToast();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },
  });

  const strength = usePasswordStrength(watch("password"));
  const strengthCfg: StrengthConfig = STRENGTH_CONFIG[strength.label] ?? STRENGTH_CONFIG["Too short"];

  const submit = handleSubmit(async (values) => {
    try {
      await signup(values.email.trim(), values.password);
      toast.show("Account created! Check your inbox to verify your email 💌");
    } catch (e: any) {
      toast.show(e?.message ?? "Sign up failed");
    }
  });

  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.header}>
        <Text style={styles.title}>Create your cozy nest 🏡</Text>
        <Text style={styles.subtitle}>Start your journey — your partner joins next.</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.fields}>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <AuthInput
              label="Username"
              autoCapitalize="none"
              autoComplete="username"
              returnKeyType="next"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AuthInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        <View style={styles.passwordGroup}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <AuthInput
                label="Password"
                secureTextEntry={!showPwd}
                autoComplete="new-password"
                returnKeyType="next"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
                rightAction={
                  <Text style={styles.showPwd} onPress={() => setShowPwd((s) => !s)}>
                    {showPwd ? "Hide" : "Show"}
                  </Text>
                }
              />
            )}
          />
          {watch("password").length > 0 && (
            <View style={styles.strengthWrap}>
              <View style={styles.strengthTrack}>
                <View
                  style={[
                    styles.strengthFill,
                    { width: strengthCfg.width, backgroundColor: strengthCfg.color },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: strengthCfg.color }]}>
                {strengthCfg.label}
              </Text>
            </View>
          )}
        </View>

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthInput
              label="Confirm password"
              secureTextEntry={!showConfirm}
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={submit}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.confirmPassword?.message}
              rightAction={
                <Text style={styles.showPwd} onPress={() => setShowConfirm((s) => !s)}>
                  {showConfirm ? "Hide" : "Show"}
                </Text>
              }
            />
          )}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.actions}>
        <PrimaryButton
          label={authLoading ? "Creating…" : "Create account ✨"}
          onPress={submit}
          disabled={authLoading}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <PrimaryButton
          label="Sign up with Google"
          variant="ghost"
          onPress={loginGoogle}
          disabled={authLoading}
          icon="google"
        />
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Link href="/(auth)/login" style={styles.footerLink}>
            Sign in
          </Link>
        </Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  fields: {
    gap: 12,
  },
  passwordGroup: {
    gap: 8,
  },
  showPwd: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primaryLight,
  },
  strengthWrap: {
    gap: 5,
  },
  strengthTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 99,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 99,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  actions: {
    gap: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  dividerText: {
    fontSize: 12,
    color: Colors.textHint,
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