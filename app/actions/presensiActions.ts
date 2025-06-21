export async function fetchPresensi(praktikumId: string) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/presensi?id_praktikum=${praktikumId}`,{
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (err) {
    console.error("Error fetching presensi:", err);
    throw new Error("Failed to fetch presensi");
  }
}

export async function fetchPresensiSummary(praktikumId: string, shiftId: string, modulId: string) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/presensi-summary?id_praktikum=${praktikumId}&id_shift=${shiftId}&id_modul=${modulId}`,{
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("🚀 ~ fetchPresensiSummary ~ data:", data)
    if (data.data) {
      return data.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (err) {
    console.error("Error fetching presensi summary:", err);
    throw new Error("Failed to fetch presensi summary");
  }
}