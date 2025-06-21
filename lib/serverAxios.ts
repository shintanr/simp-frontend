// lib/serverAxios.ts
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createServerAxios = async (req: any, res: any) => {
  const session = await getServerSession(req, res, authOptions);

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : "",
    },
    withCredentials: true,
  });
};

export default createServerAxios;