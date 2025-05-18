import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FIRECRAWL_API_KEY not configured' }, { status: 500 });
    }
    const firecrawlRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        formats: ['html'],
        // onlyMainContent: true, // Désactivé pour récupérer tout le HTML
        removeBase64Images: true,
        location: { country: 'ae', languages: ['en'] },
        waitFor: 12000,
        timeout: 60000
      })
    });
    if (!firecrawlRes.ok) {
      const errBody = await firecrawlRes.text();
      console.error('Firecrawl error response:', errBody);
      return NextResponse.json({ error: 'Firecrawl error', details: errBody }, { status: 500 });
    }
    let data;
    try {
      data = await firecrawlRes.json();
      console.log('Firecrawl raw response:', data);
    } catch (parseError) {
      const raw = await firecrawlRes.text();
      console.error('Firecrawl JSON parse error:', parseError, 'Raw response:', raw);
      return NextResponse.json({ error: 'Firecrawl JSON parse error', details: raw }, { status: 500 });
    }
    if (data && data.data && data.data.html) {
      return NextResponse.json({ html: data.data.html, metadata: data.data.metadata, url });
    }
    return NextResponse.json({ debug: true, data, url });
  } catch (error: any) {
    console.error('Firecrawl API error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 