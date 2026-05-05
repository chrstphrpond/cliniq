import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-face",
});

export const fontVariables = [GeistSans.variable, GeistMono.variable, inter.variable].join(" ");

export const fontCssVars = {
  geistSans: GeistSans.variable,
  geistMono: GeistMono.variable,
  display: inter.variable,
};
