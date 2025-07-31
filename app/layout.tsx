import "./globals.css";

export const metadata = {
  title: "Eco Tourism",
  description: "Discover and share stunning eco-friendly travel locations.",
  icons: {
    icon: "./logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
