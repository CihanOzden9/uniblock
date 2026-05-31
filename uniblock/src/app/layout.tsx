import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Academic Pulse — tek tip aile: Inter (gövde + başlık)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const interHeading = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "UniBlock — Üniversite Topluluk Ekosistemi",
  description: "Öğrenciler, kulüpler, proje takımları ve işletmeleri bir araya getiren kampüs ağı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${interHeading.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}
