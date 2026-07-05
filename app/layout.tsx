import type { Metadata } from "next";
import { Baloo_2, Noto_Sans_Devanagari } from "next/font/google";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SoundProvider } from "@/components/SoundProvider";
import { SpeechEngineBootstrap } from "@/components/SpeechEngineBootstrap";
import {
  BRAND_ASSETS,
  BRAND_NAME,
  buildOpenGraphImage,
} from "@/lib/branding";
import "./globals.css";

const baloo2 = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["400", "500", "600", "700", "800"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://learning-island.vercel.app",
  ),
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "ICSE Class 1 practice games for TV and remote navigation.",
  icons: {
    icon: BRAND_ASSETS.faviconPath,
    apple: BRAND_ASSETS.faviconPath,
  },
  openGraph: {
    title: BRAND_NAME,
    description: "ICSE Class 1 practice games for TV and remote navigation.",
    siteName: BRAND_NAME,
    type: "website",
    images: [buildOpenGraphImage()],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_NAME,
    description: "ICSE Class 1 practice games for TV and remote navigation.",
    images: [BRAND_ASSETS.openGraphPath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo2.variable} ${notoDevanagari.variable}`}>
        <ProgressProvider>
          <SoundProvider>
            <SpeechEngineBootstrap />
            {children}
          </SoundProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
