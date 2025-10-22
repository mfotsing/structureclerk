import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch smart quotes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
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

    // Parse query parameters
    const status = searchParams.get('status');
    const clientName = searchParams.get('client_name');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('smart_quotes')
      .select(`
        *,
        users(
          first_name,
          last_name,
          email,
          organizations(
            name,
            hourly_rate,
            price_per_meter,
            logo_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (clientName) {
      query = query.ilike('client_name', `%${clientName}%`);
    }
    
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    // Execute query with pagination
    const { data: quotes, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      quotes: quotes || [],
      count: count || 0,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Error fetching smart quotes:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// POST - Create new smart quote
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
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

    // Validate required fields
    const { client_name, project_address, items } = body;
    
    if (!client_name || !project_address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
    const TAX_RATE = 0.14975; // TPS (5%) + TVQ (9.975%)
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Create smart quote
    const { data: quote, error } = await supabase
      .from('smart_quotes')
      .insert({
        user_id: user.id,
        client_name,
        project_address,
        items,
        subtotal,
        tax,
        total,
        logo_url: body.logo_url,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error('Error creating smart quote:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la création' }, { status: 500 });
  }
}

// PUT - Update smart quote
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Get user and organization
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // Verify quote belongs to user
    const { data: existingQuote } = await supabase
      .from('smart_quotes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingQuote) {
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 });
    }

    // Recalculate totals if items changed
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum: number, item: any) => sum + item.total, 0);
      const TAX_RATE = 0.14975;
      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;
      
      updateData.subtotal = subtotal;
      updateData.tax = tax;
      updateData.total = total;
    }

    // Update quote
    const { data: quote, error } = await supabase
      .from('smart_quotes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error('Error updating smart quote:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE - Delete smart quote
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Verify quote belongs to user
    const { data: existingQuote } = await supabase
      .from('smart_quotes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingQuote) {
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 });
    }

    // Delete quote
    const { error } = await supabase
      .from('smart_quotes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting smart quote:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la suppression' }, { status: 500 });
  }
}