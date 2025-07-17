import "./globals.css"

export const metadata = {
    title: "ClearBill.AI",
    description: "AI-powered bill management",
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout