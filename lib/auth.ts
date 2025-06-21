import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      role?: string;
      angkatan?: string;
      email?: string;
      nim?: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    full_name?: string;
    role?: string;
    angkatan?: string;
    token?: string;
    email?: string;
    nim?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    full_name?: string;
    role?: string;
    angkatan?: string;
    token?: string;
    email?: string;
    nim?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any) {
        // Add logic here to look up the user from the credentials supplied
        const { email, password, role } = credentials as {
          email: string;
          password: string;
          role: string;
        };

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, role }),
          });

          const data = await res.json();

          if (res.status !== 200) {
            throw new Error(JSON.stringify(data)); 
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            return data.user;
          }

          return null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          
          throw new Error(e.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user;
        return {
          ...token,
          ...u,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.full_name,
          role: token.role,
          angkatan: token.angkatan,
          email: token.email,
          nim: token.nim,
        },
        accessToken: token.token,
      };
    },
  },
};
