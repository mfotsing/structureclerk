import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface AnalyticsEvent {
  event_name: string;
  event_params?: Record<string, any>;
  user_properties?: Record<string, any>;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate required fields
    if (!event.event_name) {
      return NextResponse.json(
        { error: 'event_name is required' },
        { status: 400 }
      );
    }

    // Add server-side timestamp
    const serverTimestamp = new Date().toISOString();

    // Extract client IP
    const clientIP = request.ip ||
                   request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

    // Extract user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Prepare the event record
    const eventRecord = {
      event_name: event.event_name,
      event_params: event.event_params || {},
      user_properties: event.user_properties || {},
      client_timestamp: event.timestamp || serverTimestamp,
      server_timestamp: serverTimestamp,
      ip_address: clientIP,
      user_agent: userAgent,
      session_id: event.event_params?.session_id || null,
      user_id: event.user_properties?.user_id || null,
      page_path: event.event_params?.page_path || null,
      created_at: serverTimestamp
    };

    // Store in Supabase analytics_events table
    const { error: dbError } = await supabase
      .from('analytics_events')
      .insert([eventRecord]);

    if (dbError) {
      console.error('Failed to store analytics event:', dbError);
      // Continue even if DB storage fails - we'll still log it
    }

    // Log to console for development/debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', {
        name: event.event_name,
        params: event.event_params,
        timestamp: serverTimestamp,
        ip: clientIP
      });
    }

    // Send to external analytics services if configured
    await sendToExternalServices(eventRecord);

    return NextResponse.json({
      success: true,
      event_id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Analytics endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendToExternalServices(event: any) {
  try {
    // Send to Google Analytics 4 if configured
    if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
      await sendToGA4(event);
    }

    // Send to Mixpanel if configured
    if (process.env.MIXPANEL_TOKEN) {
      await sendToMixpanel(event);
    }

    // Send to Segment if configured
    if (process.env.SEGMENT_WRITE_KEY) {
      await sendToSegment(event);
    }

  } catch (error) {
    console.error('Failed to send to external services:', error);
  }
}

async function sendToGA4(event: any) {
  const ga4Payload = {
    client_id: event.session_id || 'anonymous',
    events: [{
      name: event.event_name,
      params: {
        ...event.event_params,
        ...event.user_properties,
        engagement_time_msec: 100
      }
    }]
  };

  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ga4Payload)
  });
}

async function sendToMixpanel(event: any) {
  const mixpanelPayload = {
    event: event.event_name,
    properties: {
      ...event.event_params,
      ...event.user_properties,
      distinct_id: event.user_id || event.session_id || 'anonymous',
      token: process.env.MIXPANEL_TOKEN,
      time: new Date(event.server_timestamp).getTime() / 1000
    }
  };

  await fetch('https://api.mixpanel.com/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([mixpanelPayload])
  });
}

async function sendToSegment(event: any) {
  const segmentPayload = {
    userId: event.user_id,
    anonymousId: event.session_id,
    event: event.event_name,
    properties: {
      ...event.event_params,
      ...event.user_properties
    },
    timestamp: event.server_timestamp
  };

  await fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(process.env.SEGMENT_WRITE_KEY + ':').toString('base64')}`
    },
    body: JSON.stringify(segmentPayload)
  });
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}