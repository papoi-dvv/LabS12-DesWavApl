import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biblioteca Digital",
  description: "Gestion de autores y libros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-gray-100 text-gray-800">{children}</body>
    </html>
  );
}
