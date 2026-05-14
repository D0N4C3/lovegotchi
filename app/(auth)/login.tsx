import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useForm, Controller } from "react-hook-form";
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
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login, loginGoogle, authLoading } = useAuth();
  const toast = useToast();
  const [showPwd, setShowPwd] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await login(values.email.trim(), values.password);
    } catch (e: any) {
      toast.show(e?.message ?? "Login failed");
    }
  });

  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.header}>
        <Text style={styles.title}>Welcome back 💌</Text>
        <Text style={styles.subtitle}>Your pet missed you. Let's pick up where you left off.</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.fields}>
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

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <AuthInput
              label="Password"
              secureTextEntry={!showPwd}
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={submit}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.password?.message}
              rightAction={
                <Pressable onPress={() => setShowPwd((s) => !s)} hitSlop={8}>
                  <Text style={styles.showPwd}>{showPwd ? "Hide" : "Show"}</Text>
                </Pressable>
              }
            />
          )}
        />

        <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
          Forgot password?
        </Link>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.actions}>
        <PrimaryButton
          label={authLoading ? "Signing in…" : "Sign in"}
          onPress={submit}
          disabled={authLoading}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <PrimaryButton
          label="Continue with Google"
          variant="ghost"
          onPress={loginGoogle}
          disabled={authLoading}
          icon="google"
        />
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          New here?{" "}
          <Link href="/(auth)/signup" style={styles.footerLink}>
            Create account
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
  showPwd: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primaryLight,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primaryLight,
    alignSelf: "flex-end",
    marginTop: 2,
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