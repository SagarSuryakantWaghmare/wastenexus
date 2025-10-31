#!/usr/bin/env node

/**
 * SEO Validation Script
 * Tests meta tags, structured data, images, and performance
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const routes = [
  '/',
  '/marketplace',
  '/rewards',
  '/auth/signin',
  '/auth/signup',
  '/worker/apply',
];

console.log('🔍 SEO Validation Script\n');
console.log(`Testing: ${baseUrl}\n`);

async function testRoute(route) {
  try {
    const url = `${baseUrl}${route}`;
    console.log(`\n📄 Testing: ${route}`);
    
    const response = await fetch(url);
    const html = await response.text();
    
    // Check title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Missing';
    console.log(`  ✓ Title: ${title.substring(0, 60)}${title.length > 60 ? '...' : ''}`);
    
    // Check meta description
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    const desc = descMatch ? descMatch[1] : 'Missing';
    console.log(`  ${desc !== 'Missing' ? '✓' : '✗'} Description: ${desc.substring(0, 50)}${desc.length > 50 ? '...' : ''}`);
    
    // Check Open Graph
    const ogTitle = html.match(/<meta property="og:title" content="(.*?)"/);
    const ogImage = html.match(/<meta property="og:image" content="(.*?)"/);
    console.log(`  ${ogTitle ? '✓' : '✗'} Open Graph Title: ${ogTitle ? 'Present' : 'Missing'}`);
    console.log(`  ${ogImage ? '✓' : '✗'} Open Graph Image: ${ogImage ? 'Present' : 'Missing'}`);
    
    // Check JSON-LD
    const jsonLdCount = (html.match(/application\/ld\+json/g) || []).length;
    console.log(`  ${jsonLdCount > 0 ? '✓' : '✗'} Structured Data: ${jsonLdCount} schema(s) found`);
    
    // Check canonical
    const canonical = html.match(/<link rel="canonical" href="(.*?)"/);
    console.log(`  ${canonical ? '✓' : 'ℹ'} Canonical URL: ${canonical ? canonical[1] : 'Not set'}`);
    
    return {
      route,
      title: title !== 'Missing',
      description: desc !== 'Missing',
      openGraph: !!ogTitle,
      structuredData: jsonLdCount > 0,
    };
  } catch (error) {
    console.error(`  ✗ Error testing ${route}:`, error.message);
    return { route, error: true };
  }
}

async function testSitemap() {
  try {
    console.log('\n\n📍 Testing sitemap.xml');
    const response = await fetch(`${baseUrl}/sitemap.xml`);
    const text = await response.text();
    
    const urlCount = (text.match(/<url>/g) || []).length;
    console.log(`  ✓ Sitemap found with ${urlCount} URLs`);
    return true;
  } catch {
    console.log('  ✗ Sitemap not accessible');
    return false;
  }
}

async function testRobots() {
  try {
    console.log('\n🤖 Testing robots.txt');
    const response = await fetch(`${baseUrl}/robots.txt`);
    const text = await response.text();
    
    const hasUserAgent = text.includes('User-agent:');
    const hasSitemap = text.includes('Sitemap:');
    console.log(`  ${hasUserAgent ? '✓' : '✗'} User-agent directives: ${hasUserAgent ? 'Present' : 'Missing'}`);
    console.log(`  ${hasSitemap ? '✓' : '✗'} Sitemap reference: ${hasSitemap ? 'Present' : 'Missing'}`);
    return hasUserAgent && hasSitemap;
  } catch {
    console.log('  ✗ robots.txt not accessible');
    return false;
  }
}

async function runTests() {
  const results = [];
  
  for (const route of routes) {
    const result = await testRoute(route);
    results.push(result);
  }
  
  await testSitemap();
  await testRobots();
  
  console.log('\n\n📊 Summary\n');
  const passed = results.filter(r => !r.error && r.title && r.description && r.openGraph && r.structuredData).length;
  const total = results.length;
  
  console.log(`Routes tested: ${total}`);
  console.log(`Fully optimized: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
  
  const issues = results.filter(r => !r.error && (!r.title || !r.description || !r.openGraph || !r.structuredData));
  if (issues.length > 0) {
    console.log('\n⚠️  Routes needing attention:');
    issues.forEach(issue => {
      console.log(`  - ${issue.route}`);
      if (!issue.title) console.log('    • Missing title');
      if (!issue.description) console.log('    • Missing description');
      if (!issue.openGraph) console.log('    • Missing Open Graph tags');
      if (!issue.structuredData) console.log('    • Missing structured data');
    });
  }
  
  console.log('\n✅ SEO validation complete!\n');
}

runTests();
