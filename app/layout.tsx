import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "../components/LightRays";
import Navbar from "../components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "A platform to discover and share developer events worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <div
          className="fixed inset-0 -z-10"
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#dd00ff"
            raysSpeed={1.0  }
            lightSpread={2.0}
            rayLength={10.0}
            followMouse={true}
            mouseInfluence={0.3}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
        <main>
          <Navbar/>
          {children}
        </main>
      </body>
    </html>
  );
}
