import '../styles/globals.css';

export const metadata = {
  title: 'StructureClerk - Gestion documentaire intelligente',
  description: 'Plateforme canadienne pour la gestion de documents avec IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}