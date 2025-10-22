#!/bin/bash

echo "Fixing all apostrophe and quote entities in all files..."

# Dashboard page
sed -i '' "s/Action requise pour maintenir les projets en cours/Action requise pour maintenir les projets en cours/" src/app/\(dashboard\)/dashboard/page.tsx
sed -i '' "s/Centre de Commandement IAC - Prise de Décision Proactive/Centre de Commandement IAC - Prise de Décision Proactive/" src/app/\(dashboard\)/dashboard/page.tsx

# Files page
sed -i '' "s/(Factures, Soumissions, Reçus). L&rsquo;IA fait le reste./(Factures, Soumissions, Reçus). L&rsquo;IA fait le reste./" src/app/\(dashboard\)/files/page.tsx
sed -i '' "s/Documents traités par l&rsquo;IA/Documents traités par l&rsquo;IA/" src/app/\(dashboard\)/files/page.tsx

# Landing page
sed -i '' "s/L&rsquo;IA qui transforme vos documents en décisions/L&rsquo;IA qui transforme vos documents en décisions/" src/app/page.tsx
sed -i '' "s/Rejoignez les entrepreneurs qui transforment leur gestion documentaire avec StructureClerk/Rejoignez les entrepreneurs qui transforment leur gestion documentaire avec StructureClerk/" src/app/page.tsx

# Comparison section
sed -i '' "s/Arrêtez de gérer des feuilles de calcul. Obtenez de l&rsquo;intelligence, pas un autre logiciel complexe./Arrêtez de gérer des feuilles de calcul. Obtenez de l&rsquo;intelligence, pas un autre logiciel complexe./" src/components/landing/ComparisonSection.jsx
sed -i '' "s/Notre IA est entraînée spécifiquement sur les documents du bâtiment (factures, soumissions, contrats). Elle reconnaît les termes techniques, les codes de matériaux et les structures de prix spécifiques à votre industrie./Notre IA est entraînée spécifiquement sur les documents du bâtiment (factures, soumissions, contrats). Elle reconnaît les termes techniques, les codes de matériaux et les structures de prix spécifiques à votre industrie./" src/components/landing/ComparisonSection.jsx
sed -i '' "s/Recevez des alertes immédiates lors de dépassements de budget. Notre système surveille vos documents en temps réel et vous notifie avant qu&rsquo;un problème ne devienne une crise./Recevez des alertes immédiates lors de dépassements de budget. Notre système surveille vos documents en temps réel et vous notifie avant qu&rsquo;un problème ne devienne une crise./" src/components/landing/ComparisonSection.jsx
sed -i '' "s/Alerte de dépassement de budget/Alerte de dépassement de budget/" src/components/landing/ComparisonSection.jsx
sed -i '' "s/Projet &ldquo;Centre Commercial Sainte-Foy&rdquo; : risque de dépassement de 8,500$/Projet &ldquo;Centre Commercial Sainte-Foy&rdquo; : risque de dépassement de 8,500$/" src/components/landing/ComparisonSection.jsx
sed -i '' "s/Prêt à simplifier votre gestion documentaire ?/Prêt à simplifier votre gestion documentaire ?/" src/components/landing/ComparisonSection.jsx

# Credibility section
sed -i '' "s/&ldquo;Avant StructureClerk, je passais mes dimanches à rentrer des factures. Maintenant, l&rsquo;IA fait ça en temps réel. J&rsquo;ai enfin récupéré mes week-ends et évité un dépassement de 8000$ sur un projet.&rdquo;/&ldquo;Avant StructureClerk, je passais mes dimanches à rentrer des factures. Maintenant, l&rsquo;IA fait ça en temps réel. J&rsquo;ai enfin récupéré mes week-ends et évité un dépassement de 8000$ sur un projet.&rdquo;/" src/components/landing/CredibilitySection.jsx
sed -i '' "s/Seulement 15 entrepreneurs sélectionnés pour notre programme bêta. Profitez d&rsquo;un accès prioritaire et d&rsquo;un support personnalisé./Seulement 15 entrepreneurs sélectionnés pour notre programme bêta. Profitez d&rsquo;un accès prioritaire et d&rsquo;un support personnalisé./" src/components/landing/CredibilitySection.jsx
sed -i '' "s/Testez gratuitement avec vos 5 premiers documents. Pas de carte bancaire requise. Annulez à tout moment./Testez gratuitement avec vos 5 premiers documents. Pas de carte bancaire requise. Annulez à tout moment./" src/components/landing/CredibilitySection.jsx

# FAQ section
sed -i '' "s/Oui, absolument. Nous utilisons un chiffrement de bout en bout (AES-256) pour protéger vos documents. Vos données sont sauvegardées automatiquement sur des serveurs sécurisés avec redondance géographique. Nous sommes conformes RGPD et HIPAA, et nous ne partageons jamais vos données avec des tiers sans votre consentement explicite./Oui, absolument. Nous utilisons un chiffrement de bout en bout (AES-256) pour protéger vos documents. Vos données sont sauvegardées automatiquement sur des serveurs sécurisés avec redondance géographique. Nous sommes conformes RGPD et HIPAA, et nous ne partageons jamais vos données avec des tiers sans votre consentement explicite./" src/components/landing/FAQSection.jsx

# Feature grid
sed -i '' "s/Glissez-déposez factures, soumissions et contrats. L&rsquo;IA fait le reste./Glissez-déposez factures, soumissions et contrats. L&rsquo;IA fait le reste./" src/components/landing/FeatureGrid.jsx

# Hero section
sed -i '' "s/(Factures, Soumissions, Reçus). L&rsquo;IA fait le reste./(Factures, Soumissions, Reçus). L&rsquo;IA fait le reste./" src/components/landing/HeroSection.jsx

# Mobile demo
sed -i '' "s/&ldquo;J&rsquo;utilise StructureClerk directement sur mes chantiers. Je prends une photo d&rsquo;une facture et je sais immédiatement si ça affecte mon budget. Plus besoin d&rsquo;attendre de rentrer au bureau.&rdquo;/&ldquo;J&rsquo;utilise StructureClerk directement sur mes chantiers. Je prends une photo d&rsquo;une facture et je sais immédiatement si ça affecte mon budget. Plus besoin d&rsquo;attendre de rentrer au bureau.&rdquo;/" src/components/landing/MobileDemo.jsx

# Simplicity flow
sed -i '' "s/Glissez-déposez factures, soumissions et contrats. L&rsquo;IA fait le reste./Glissez-déposez factures, soumissions et contrats. L&rsquo;IA fait le reste./" src/components/landing/SimplicityFlow.jsx

echo "All entity fixes completed!"