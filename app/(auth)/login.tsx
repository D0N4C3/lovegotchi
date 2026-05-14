import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthInput } from "@/components/auth/AuthInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import Colors from "@/constants/colors";

const schema = z.object({ email: z.email("Enter a valid email"), password: z.string().min(6, "Password too short") });

export default function Login() {
  const { login, loginGoogle, authLoading } = useAuth(); const toast = useToast();
  const [showPwd, setShowPwd] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const submit = handleSubmit(async (v) => { try { await login(v.email.trim(), v.password); } catch (e: any) { toast.show(e?.message ?? "Login failed"); } });
  return <AuthShell><Text style={styles.h}>Welcome back</Text>
    <Controller control={control} name="email" render={({ field }) => <AuthInput label="Email" autoCapitalize="none" keyboardType="email-address" value={field.value} onChangeText={field.onChange} error={errors.email?.message as string} />} />
    <Controller control={control} name="password" render={({ field }) => <AuthInput label="Password" secureTextEntry={!showPwd} value={field.value} onChangeText={field.onChange} error={errors.password?.message as string} />} />
    <Pressable onPress={() => setShowPwd((s) => !s)}><Text style={styles.link}>{showPwd ? "Hide" : "Show"} password</Text></Pressable>
    <Link href="/(auth)/forgot-password" style={styles.link}>Forgot password?</Link>
    <PrimaryButton label={authLoading ? "Signing in..." : "Login"} onPress={submit} disabled={authLoading} />
    <View style={styles.row}><View style={styles.line}/><Text style={styles.or}>or</Text><View style={styles.line}/></View>
    <PrimaryButton style={styles.google} label="Continue with Google" onPress={loginGoogle} disabled={authLoading} />
    <Link href="/(auth)/signup" style={styles.link}>New here? Create account</Link>
  </AuthShell>;
}
const styles = StyleSheet.create({ h: { color: Colors.text, fontSize: 26, fontWeight: "800" }, link: { color: Colors.accent, fontWeight: "600" }, row: { flexDirection: "row", alignItems: "center", gap: 10 }, line: { height: 1, flex: 1, backgroundColor: Colors.border }, or: { color: Colors.textMuted }, google: { backgroundColor: "rgba(255,255,255,0.25)" } });
