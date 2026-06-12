import type { Metadata } from "next";
import { Schibsted_Grotesk  ,Martian_Mono } from "next/font/google";
import "./globals.css";
 import LightRays from './components/LightRays';
import Navbar from "./components/Navbar";
 

const SchibstedGrotesks = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const MartianMonos = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The hub for every Dev Event that you mustn't miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${SchibstedGrotesks.variable} ${MartianMonos.variable} min-h-screen h-full antialiased`}
    >
     


      <body className="min-h-full flex flex-col">
           <Navbar/>
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
       
          
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#5dfeca"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
/>

</div>


  <main>{children}</main>      
        
        </body>
    </html>
  );
}
