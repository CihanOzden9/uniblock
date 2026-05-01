import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
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
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-[#525252] bg-white selection:bg-[#059669] selection:text-white">
        {children}
      </body>
    </html>
  );
}
