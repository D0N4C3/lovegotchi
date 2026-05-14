import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
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

const schema = z.object({ username: z.string().min(2), email: z.email(), password: z.string().min(8), confirmPassword: z.string(), terms: z.literal(true) }).refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export default function Signup() {
  const { signup, loginGoogle, authLoading } = useAuth(); const toast = useToast();
  const { control, watch, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { username: "", email: "", password: "", confirmPassword: "", terms: true } });
  const strength = usePasswordStrength(watch("password"));
  const submit = handleSubmit(async (v) => { try { await signup(v.email.trim(), v.password); toast.show("Account created. Check your inbox to verify email."); } catch (e: any) { toast.show(e?.message ?? "Sign up failed"); } });
  return <AuthShell><Text style={styles.h}>Create your cozy nest</Text>
    <Controller control={control} name="username" render={({ field }) => <AuthInput label="Username" value={field.value} onChangeText={field.onChange} error={errors.username?.message as string} />} />
    <Controller control={control} name="email" render={({ field }) => <AuthInput label="Email" value={field.value} onChangeText={field.onChange} error={errors.email?.message as string} />} />
    <Controller control={control} name="password" render={({ field }) => <AuthInput label="Password" secureTextEntry value={field.value} onChangeText={field.onChange} error={errors.password?.message as string} />} />
    <View style={styles.meter}><View style={[styles.fill, { width: `${Math.max(strength.score, 1) * 25}%` }]} /></View><Text style={styles.meta}>{strength.label}</Text>
    <Controller control={control} name="confirmPassword" render={({ field }) => <AuthInput label="Confirm password" secureTextEntry value={field.value} onChangeText={field.onChange} error={errors.confirmPassword?.message as string} />} />
    <PrimaryButton label={authLoading ? "Creating..." : "Create account"} onPress={submit} disabled={authLoading} />
    <PrimaryButton style={styles.google} label="Sign up with Google" onPress={loginGoogle} disabled={authLoading} />
    <Link href="/(auth)/login" style={styles.link}>Already have an account? Log in</Link>
  </AuthShell>;
}
const styles = StyleSheet.create({ h: { color: Colors.text, fontSize: 24, fontWeight: "800" }, meter: { height: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }, fill: { height: "100%", backgroundColor: Colors.primary }, meta: { color: Colors.textMuted, fontSize: 12 }, google: { backgroundColor: "rgba(255,255,255,0.25)" }, link: { color: Colors.accent, textAlign: "center" } });
