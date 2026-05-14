import React from "react";
import { StyleSheet, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthInput } from "@/components/auth/AuthInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import Colors from "@/constants/colors";

const schema = z.object({ email: z.email("Enter a valid email") });

export default function ForgotPassword() {
  const { forgotPassword, authLoading } = useAuth(); const toast = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const submit = handleSubmit(async ({ email }) => { try { await forgotPassword(email.trim()); toast.show("Password reset email sent 💌"); } catch (e: any) { toast.show(e?.message ?? "Could not send reset email"); } });
  return <AuthShell><Text style={styles.h}>Reset password</Text><Controller control={control} name="email" render={({ field }) => <AuthInput label="Email" value={field.value} onChangeText={field.onChange} error={errors.email?.message as string} />} /><PrimaryButton label={authLoading ? "Sending..." : "Send reset link"} onPress={submit} disabled={authLoading} /></AuthShell>;
}

const styles = StyleSheet.create({ h: { color: Colors.text, fontWeight: "800", fontSize: 25 } });
