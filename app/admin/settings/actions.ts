"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession, createSession } from "@/lib/session";

export type SettingsFormState = { ok: true } | { error: string } | undefined;

export async function updateCredentials(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const session = await getSession();
  if (!session) return { error: "Your session has expired. Please sign in again." };

  const currentPassword = String(formData.get("currentPassword") || "");
  const newEmail = String(formData.get("newEmail") || "").trim();
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "Account not found." };

  const currentOk = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!currentOk) return { error: "Current password is incorrect." };

  if (newPassword && newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }
  if (newPassword && newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  const data: { email?: string; passwordHash?: string } = {};
  if (newEmail && newEmail !== user.email) data.email = newEmail;
  if (newPassword) data.passwordHash = await bcrypt.hash(newPassword, 12);

  if (Object.keys(data).length === 0) {
    return { error: "Enter a new username or password to update." };
  }

  const updated = await prisma.adminUser.update({ where: { id: user.id }, data });
  await createSession({ userId: updated.id, email: updated.email });
  return { ok: true };
}
