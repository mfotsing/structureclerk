import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { subscriptionEndpoint, keys } = await request.json();
    
    if (!subscriptionEndpoint || !keys) {
      return NextResponse.json({ error: 'Données d\'inscription incomplètes' }, { status: 400 });
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('endpoint', subscriptionEndpoint)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { error } = await supabase
        .from('push_subscriptions')
        .update({
          p256dh_key: keys.p256dh,
          auth_key: keys.auth,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id);

      if (error) throw error;
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          organization_id: profile.organization_id,
          endpoint: subscriptionEndpoint,
          p256dh_key: keys.p256dh,
          auth_key: keys.auth,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error registering push subscription:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { subscriptionEndpoint } = await request.json();
    
    if (!subscriptionEndpoint) {
      return NextResponse.json({ error: 'Endpoint manquant' }, { status: 400 });
    }

    // Delete subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', subscriptionEndpoint);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error unregistering push subscription:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la désinscription' }, { status: 500 });
  }
}