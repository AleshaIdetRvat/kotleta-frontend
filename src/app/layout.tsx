import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/lib/query-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Распознавание карьеров",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
