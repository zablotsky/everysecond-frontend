import UserInfo from './UserInfo'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
      <UserInfo />
    </html>
  );
}
