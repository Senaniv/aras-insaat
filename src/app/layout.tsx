import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aras İnşaat | Premium Tikinti və Təmir Şirkəti",
  description: "Aras İnşaat (Aras Tikinti & Təmir Şirkəti) - Tovuz, Qazax, Ağstafa və Şəmkir bölgələrində fərdi yaşayış evlərinin, villaların tikintisi, təmiri, interyer dizaynı və fasad işləri.",
  keywords: ["Aras Insaat", "Aras Tikinti", "Aras Temir", "Tovuz tikinti", "Qazax tikinti", "Agstafa insaat", "Semkir villa tikintisi", "temir paketleri", "Azərbaycan tikinti şirkəti"],
  authors: [{ name: "Pixel Digital Services" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-brand-dark text-gray-100 font-sans selection:bg-brand-orange selection:text-white">
        {children}
      </body>
    </html>
  );
}

