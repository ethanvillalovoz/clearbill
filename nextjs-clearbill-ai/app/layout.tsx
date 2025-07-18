import "./global.css"

/**
 * Metadata for the application.
 * Used by Next.js for SEO and browser tab info.
 */
export const metadata = {
    title: "ClearBill.AI",
    description: "AI-powered bill management",
}

/**
 * Root layout component for the app.
 * Wraps all pages and components with HTML and body tags.
 *
 * @param children - React children components to render inside the layout.
 */
const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout