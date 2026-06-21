import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Metadata, Viewport } from "next";
import { CopilotProvider } from "@/components/app/copilot";
import { SavedProvider } from "@/components/app/saved-store";
import { Header } from "@/components/app/Header";

export const metadata: Metadata = {
  title: "AgenticZillow — Find it. Tour it. Own it.",
  description:
    "A Zillow-faithful real-estate experience with a multi-agent AI copilot. Portfolio/demo — synthetic data, not affiliated with Zillow Group.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SavedProvider>
          <CopilotProvider>
            <Header />
            <main>{children}</main>
          </CopilotProvider>
        </SavedProvider>
      </body>
    </html>
  );
}
