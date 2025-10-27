export const metadata = {
  title: 'StructureClerk - Debug',
  description: 'Debug page',
};

export default function NoCSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
          padding: 0
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}