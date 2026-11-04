import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?error=Silakan+masuk+sebagai+admin");
  if (user.role !== "ADMIN") redirect("/akun?error=Akses+admin+ditolak");
  return user;
}
