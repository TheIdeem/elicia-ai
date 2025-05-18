// Service pour utiliser Firecrawl MCP et scraper une page Driven Properties

export async function scrapeDrivenProperties(url: string): Promise<any> {
  // Appel à l'API MCP Firecrawl (via un endpoint local ou MCP direct)
  // Ici, on suppose qu'on a un endpoint local /api/firecrawl qui relaie la requête MCP
  const response = await fetch('/api/firecrawl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!response.ok) {
    throw new Error('Erreur lors du scraping Firecrawl');
  }
  const data = await response.json();
  return data;
} 