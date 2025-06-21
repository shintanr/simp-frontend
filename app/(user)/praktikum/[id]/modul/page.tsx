// app/(user)/praktikum/[id]/modul/page.tsx
import { redirect } from "next/navigation";

const modulMap: Record<number, string> = {
  5: "prak-sbd",
  6: "prak-mulmed",
  7: "prak-pjk",
  9: "prak-eldas",
  12: "prak-sdl",
};

export default async function ModulIndexPage({
  params,
}: {
  params: Promise<{ id: string }>; // Changed: params is now a Promise
}) {
  const resolvedParams = await params; // Added: await the params
  const id = Number(resolvedParams.id);
  const folder = modulMap[id];

  if (folder) {
    redirect(`/praktikum/${id}/modul/${folder}`);
  }

  redirect(`/praktikum/${id}/modul/empty_modul`);
}