import { readFile, readdir, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join } from 'node:path';

// Run after the production build. No browser or extra dependencies required.
async function walk(directory) {
  const paths = await Promise.all((await readdir(directory)).map(async (name) => {
    const path = join(directory, name);
    return (await stat(path)).isDirectory() ? walk(path) : [path];
  }));
  return paths.flat();
}
let pages = 0;
let panels = 0;
for (const file of await walk('dist')) {
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  if (!html.includes('data-explorer')) continue;
  const panelTags = [...html.matchAll(/<section\b[^>]*data-explorer-panel[^>]*>/g)].map(([tag]) => tag);
  const tabs = [...html.matchAll(/<a\b[^>]*data-explorer-tab[^>]*>/g)].map(([tag]) => tag);
  assert.equal(tabs.length, panelTags.length, `${file}: every choice has a panel`);
  assert.ok(panelTags.length > 0, `${file}: content exists`);
  for (const tag of panelTags) {
    assert.ok(!/\shidden(?:\s|=|>)/.test(tag), `${file}: content readable without JavaScript`);
    const id = tag.match(/\bid="([^"]+)"/)[1];
    assert.ok(tabs.some((tab) => tab.includes(`href="#${id}"`)), `${file}: fallback anchor matches panel`);
  }
  assert.ok(html.includes('G-WPMY8CH9ZJ'), `${file}: GA4 preserved`);
  assert.ok(html.includes('data-ga-event="contact_whatsapp"'), `${file}: WhatsApp tracking preserved`);
  assert.ok(html.includes('rel="canonical"'), `${file}: canonical preserved`);
  for (const [, href] of html.matchAll(/class="explorer-link"[^>]*href="([^"]+)"/g)) {
    assert.ok((await stat(join('dist', href, 'index.html'))).isFile(), `${file}: destination ${href} exists`);
  }
  panels += panelTags.length;
  pages++;
}
assert.equal(pages, 16, 'All intended routes include the new interactions');
console.log(`PASS: ${pages} routes, ${panels} panels; no-JS content, fallback anchors, internal destinations, canonical and GA4 checks.`);
