import axiosInstance from "@/lib/axiosInstance";

export async function getAllUsers(page: number, limit: number, search: string, orderBy: string, sortDirection: string) {
  try {
    const response = await axiosInstance.get("/api/users", {
      params: {
        page,
        limit,
        search,
        orderBy,
        sortDirection
      },
    });

    const data = response.data;
    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
}