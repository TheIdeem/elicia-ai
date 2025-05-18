import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      company,
      position,
      industry,
      email,
      phone,
      message,
    } = body;

    // Basic validation
    if (!first_name || !last_name || !company || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Insert into Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side insert
    );

    const { error } = await supabase.from('demo_requests').insert([
      {
        first_name,
        last_name,
        company,
        position,
        industry,
        email,
        phone,
        message,
        status: 'new',
        source: 'landing',
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 