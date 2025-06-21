// utils/logout.ts

export const logout = async (): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8080/api/logout", {
        method: "POST",
        credentials: "include", // penting untuk mengirim cookie
      });
  
      if (res.ok) {
        return true;
      } else {
        console.error("Logout gagal");
        return false;
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat logout:", err);
      return false;
    }
  };
  