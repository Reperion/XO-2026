import type { Metadata } from "next";
import "./globals.css";
import Layout from '@/components/ui/Layout';

export const metadata: Metadata = {
  title: "Hermes Dashboard",
  description: "XO&apos;s view into Hermes agent — sessions, tools, jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}