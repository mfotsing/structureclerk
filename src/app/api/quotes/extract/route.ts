import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get user and organization
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non supporté' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'quotes');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const fileId = randomUUID();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Start processing timer
    const startTime = Date.now();

    // Extract data using AI (mock implementation for now)
    const extractedData = await extractQuoteData(filePath, file.type);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Store extracted data in database (optional)
    const { data: extractedQuote } = await supabase
      .from('extracted_quotes')
      .insert({
        organization_id: profile.organization_id,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        extracted_data: extractedData,
        confidence_score: extractedData.confidence_score,
        processing_time_ms: processingTime,
        created_by: user.id
      })
      .select()
      .single();

    // Clean up file (optional)
    // await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      extracted_quote_id: extractedQuote.id,
      extracted_data: extractedData,
      processing_time_ms: processingTime
    });

  } catch (error: any) {
    console.error('Error extracting quote data:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de lextraction' }, { status: 500 });
  }
}

// Mock AI extraction function
// In a real implementation, this would call an AI service or use OCR
async function extractQuoteData(filePath: string, fileType: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  // Generate mock extracted data based on file type
  const isImage = fileType.startsWith('image/');
  const confidenceScore = 0.85 + Math.random() * 0.1; // 85-95% confidence

  // Mock project data
  const projectTypes = [
    'Rénovation résidentielle complète',
    'Construction neuve',
    'Agrandissement',
    'Rénovation cuisine',
    'Rénovation salle de bain',
    'Aménagement extérieur',
    'Fondations et structure',
    'Toiture et couverture'
  ];

  const projectNames = [
    'Résidence des Pins',
    'Maison Famille Tremblay',
    'Cottage Lac Supérieur',
    'Immeuble Rue Sainte-Catherine',
    'Bureau Quartier Latin',
    'Chalet Mont-Tremblant',
    'Condo Griffintown',
    'Villa Westmount'
  ];

  const mockData = {
    project_name: projectNames[Math.floor(Math.random() * projectNames.length)],
    client_name: `Client ${Math.floor(Math.random() * 1000)}`,
    client_address: `${Math.floor(Math.random() * 999)} Rue de la Construction`,
    client_city: ['Montréal', 'Québec', 'Laval', 'Longueuil', 'Brossard'][Math.floor(Math.random() * 5)],
    client_province: 'QC',
    client_email: `client${Math.floor(Math.random() * 1000)}@example.com`,
    client_phone: `(438) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    description: projectTypes[Math.floor(Math.random() * projectTypes.length)],
    scope: 'Travaux complets selon plans et cahiers des charges',
    requirements: 'Conformité aux normes du bâtiment du Québec. Permis requis obtenu par le client.',
    estimated_duration: `${Math.floor(Math.random() * 20) + 5} semaines`,
    estimated_start_date: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total_area: Math.floor(Math.random() * 500) + 100, // 100-600 m²
    confidence_score: confidenceScore,
    line_items: generateMockLineItems(),
    ai_source_document: isImage ? 'Plan scanné' : 'Plan PDF numérique'
  };

  return mockData;
}

// Generate mock line items for the quote
function generateMockLineItems() {
  const constructionItems = [
    { description: 'Préparation du site et excavation', unit: 'forfait', unit_price: 2500, quantity: 1 },
    { description: 'Fondations en béton armé', unit: 'm³', unit_price: 250, quantity: 15 },
    { description: 'Structure en bois d\'œuvre', unit: 'm²', unit_price: 85, quantity: 120 },
    { description: 'Isolation murs et toit', unit: 'm²', unit_price: 25, quantity: 180 },
    { description: 'Revêtement extérieur', unit: 'm²', unit_price: 45, quantity: 120 },
    { description: 'Installation fenêtres et portes', unit: 'unité', unit_price: 850, quantity: 8 },
    { description: 'Couverture toiture', unit: 'm²', unit_price: 65, quantity: 120 },
    { description: 'Planchers et sous-planchers', unit: 'm²', unit_price: 35, quantity: 120 },
    { description: 'Cloisons sèches intérieures', unit: 'm²', unit_price: 30, quantity: 80 },
    { description: 'Installation électrique complète', unit: 'forfait', unit_price: 5500, quantity: 1 },
    { description: 'Plomberie complète', unit: 'forfait', unit_price: 4200, quantity: 1 },
    { description: 'Système de chauffage', unit: 'forfait', unit_price: 3800, quantity: 1 },
    { description: 'Finitions intérieures', unit: 'm²', unit_price: 40, quantity: 120 },
    { description: 'Peinture intérieure et extérieure', unit: 'm²', unit_price: 15, quantity: 200 },
    { description: 'Aménagement paysager', unit: 'forfait', unit_price: 3200, quantity: 1 }
  ];

  // Select 8-12 random items
  const numItems = Math.floor(Math.random() * 5) + 8;
  const selectedItems = [];
  
  // Create a copy of the array and shuffle it
  const shuffledItems = [...constructionItems].sort(() => Math.random() - 0.5);
  
  // Take the first numItems
  for (let i = 0; i < numItems && i < shuffledItems.length; i++) {
    const item = shuffledItems[i];
    
    // Add some variation to quantities and prices
    const quantityVariation = 0.8 + Math.random() * 0.4; // 80-120% of base quantity
    const priceVariation = 0.9 + Math.random() * 0.2; // 90-110% of base price
    
    const adjustedQuantity = item.unit === 'forfait' || item.unit === 'unité' 
      ? item.quantity 
      : Math.round(item.quantity * quantityVariation);
    
    const adjustedPrice = Math.round(item.unit_price * priceVariation * 100) / 100;
    
    selectedItems.push({
      description: item.description,
      quantity: adjustedQuantity,
      unit: item.unit,
      unit_price: adjustedPrice,
      amount: Math.round(adjustedQuantity * adjustedPrice * 100) / 100
    });
  }
  
  return selectedItems;
}