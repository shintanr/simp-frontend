// lib/getSessionServer.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan path ini sesuai

export async function getSessionServer() {
  const session = await getServerSession(authOptions);

  return session;
}
