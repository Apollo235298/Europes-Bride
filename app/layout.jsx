import { Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif" });

export const metadata = {
  title: "Europe's Bride — Growth Dashboard",
  description: "Client growth portal by Rank Local Now"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
