import "./globals.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIMS",
  description: "Student Information Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        
            {children}
        
      </body>
    </html>
  );
}
