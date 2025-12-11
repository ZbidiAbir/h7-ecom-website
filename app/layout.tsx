import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CartProvider } from "./hooks/useCart";

import FooterWrapper from "@/components/FooterWrapper";
import { ThemeProviders } from "./admin/dashboard/components/providers";
import VisitorTracker from "./admin/dashboard/visitors/components/VisitorTracker";
import VisitorCount from "./admin/dashboard/visitors/components/VisitorCount";

export const metadata: Metadata = {
  title: "HASHSEVEN",
  description: "HASHSEVEN STORE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={""}>
        <ThemeProviders>
          <Providers>
            <CartProvider>
              {children}
              <FooterWrapper />
            </CartProvider>
          </Providers>
        </ThemeProviders>
      </body>
    </html>
  );
}
