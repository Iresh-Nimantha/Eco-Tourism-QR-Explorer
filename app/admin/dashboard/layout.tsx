// app/layout.tsx

export const metadata = {
  title: 'My App',
  description: 'Web app using Next.js',
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
