import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/provider/nextAuthProvider";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/provider/reduxProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "SI Praktikum | %s",
    default: "Dashboard",
  },
  description: "Sistem Informasi Praktikum",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SIMP",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SIMP" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${nunito.className} antialiased`}>
        <NextAuthProvider>
          <ReduxProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                classNames: {
                  error:
                    "!bg-destructive !text-destructive-foreground !border-0 !text-white",
                  success: "!bg-green-600 !text-white !border-0",
                  loading: "!bg-primary !text-primary-foreground !border-0",
                  warning: "!bg-yellow-500 !text-white !border-0",
                },
              }}
            />
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
