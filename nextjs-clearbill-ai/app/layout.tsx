import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./global.css";

export const metadata: Metadata = {
    title: "ClearBill | Healthcare Cost Explainer",
    description: "Source-backed educational explanations for medical bills, insurance terms, and healthcare charges.",
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    colorScheme: "light",
    themeColor: "#f7f8f6",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
