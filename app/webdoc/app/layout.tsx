import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Uplofile Webdoc",
  description: "Demo/Docs for the uplofile component library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-3xl p-6">{children}</div>
      </body>
      <Analytics />
    </html>
  );
}
