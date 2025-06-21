import axiosInstance from "@/lib/axiosInstance";

export async function fetchLabs() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/lab");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("🚀 ~ fetchLabs ~ data:", data)
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (err) {
    console.error("Error fetching labs:", err);
    throw new Error("Failed to fetch labs");
  }
}

export async function fetchModules(lab_id: number) {
  try {
    const response = await axiosInstance.get("/api/praktikum", {
      params: { lab_id },
    });

    const data = response.data;
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (err) {
    console.error("Error fetching modules:", err);
    throw new Error("Failed to fetch modules");
  }
}