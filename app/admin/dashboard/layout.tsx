// app/layout.tsx

export const metadata = {
  title: "Eco Tourism",
  description: "Discover and share stunning eco-friendly travel locations.",
  icons: {
    icon: "/favicon.png",
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
