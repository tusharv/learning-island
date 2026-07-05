import type { Metadata } from "next";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SoundProvider } from "@/components/SoundProvider";
import { SpeechEngineBootstrap } from "@/components/SpeechEngineBootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learning Island",
  description: "ICSE Class 1 practice games for TV and remote navigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
