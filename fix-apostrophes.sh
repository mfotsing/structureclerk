#!/bin/bash

echo "Fixing apostrophes in dashboard page..."

# Fix apostrophes in dashboard page
sed -i '' "s/en attente d'approbation/en attente d&rsquo;approbation/" src/app/\(dashboard\)/dashboard/page.tsx
sed -i '' "s/Aujourd'hui/Aujourd&rsquo;hui/" src/app/\(dashboard\)/dashboard/page.tsx

echo "Fixed dashboard page"