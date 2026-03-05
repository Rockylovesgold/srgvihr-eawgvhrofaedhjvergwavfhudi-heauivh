import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "RockMount AI — Command Center",
  description:
    "We build the autonomous engines for the world's most strategic enterprises.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-white antialiased">
        <TopNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
