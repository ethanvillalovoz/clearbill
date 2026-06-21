import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./global.css";

export const metadata: Metadata = {
    title: "ClearBill.AI",
    description: "AI assistant for explaining medical bills, insurance terms, and healthcare charges.",
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
