import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch timesheets
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
    const employeeId = searchParams.get('employee_id');
    const projectId = searchParams.get('project_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('timesheets')
      .select(`
        *,
        employees(*),
        projects(*)
      `)
      .eq('organization_id', profile.organization_id);

    // Apply filters
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('date', dateTo);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    // Execute query with pagination
    const { data: timesheets, error, count } = await query
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      timesheets: timesheets || [],
      count: count || 0,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// POST - Create new timesheet entry
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
    const { employee_id, project_id, date, start_time, hours_worked } = body;
    
    if (!employee_id || !project_id || !date || !start_time || hours_worked === undefined) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // Calculate hours if not provided
    let calculatedHours = hours_worked;
    if (body.end_time && !hours_worked) {
      const start = new Date(start_time);
      const end = new Date(body.end_time);
      calculatedHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (body.break_duration || 0);
    }

    // Create timesheet entry
    const { data: timesheet, error } = await supabase
      .from('timesheets')
      .insert({
        employee_id,
        project_id,
        date,
        start_time,
        end_time: body.end_time,
        break_duration: body.break_duration || 0,
        hours_worked: calculatedHours,
        description: body.description,
        status: 'draft',
        organization_id: profile.organization_id,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, timesheet });
  } catch (error: any) {
    console.error('Error creating timesheet:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la création' }, { status: 500 });
  }
}

// PUT - Update timesheet entry
export async function PUT(request: NextRequest) {
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

    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // Verify timesheet belongs to organization
    const { data: existingTimesheet } = await supabase
      .from('timesheets')
      .select('id')
      .eq('id', id)
      .eq('organization_id', profile.organization_id)
      .single();

    if (!existingTimesheet) {
      return NextResponse.json({ error: 'Feuille de temps non trouvée' }, { status: 404 });
    }

    // Update timesheet
    const { data: timesheet, error } = await supabase
      .from('timesheets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, timesheet });
  } catch (error: any) {
    console.error('Error updating timesheet:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE - Delete timesheet entry
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

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

    // Verify timesheet belongs to organization
    const { data: existingTimesheet } = await supabase
      .from('timesheets')
      .select('id')
      .eq('id', id)
      .eq('organization_id', profile.organization_id)
      .single();

    if (!existingTimesheet) {
      return NextResponse.json({ error: 'Feuille de temps non trouvée' }, { status: 404 });
    }

    // Delete timesheet
    const { error } = await supabase
      .from('timesheets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting timesheet:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la suppression' }, { status: 500 });
  }
}