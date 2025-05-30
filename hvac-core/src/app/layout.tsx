import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HVAC.app - HVAC Service Management",
  description: "Streamline your HVAC business with our all-in-one platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ServiceWorkerRegister />
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
