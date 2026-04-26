// Run this anytime cityImages.ts breaks: node scripts/fix-city-images.js
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'lib', 'cityImages.ts');
const content = fs.readFileSync(file, 'utf8');

const entries = {};
for (const [, slug, url] of content.matchAll(/'([a-z0-9][a-z0-9-]+)':\s*'([^']+)'/g)) {
    if (!['width','height','slug','photo','query','auto','fit','crop','w','h','s','v'].includes(slug)) {
        entries[slug] = url;
    }
}

const lines = [
    'const CITY_IMAGES: Record<string, string> = {',
    ...Object.keys(entries).sort().map(s => `    '${s}': '${entries[s]}',`),
    '};',
    '',
    'export const CITY_IMAGES_KEYS = Object.keys(CITY_IMAGES);',
    '',
    "export function getCityImage(slug: string, width = 800, height = 600, cityName?: string): string {",
    "    const photo = CITY_IMAGES[slug];",
    "    if (photo) {",
    "        if (photo.startsWith('http') || photo.startsWith('/')) return photo;",
    "        return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;",
    "    }",
    "    const query = encodeURIComponent((cityName || slug.replace(/-/g, ' ')) + ' city skyline');",
    "    return `https://source.unsplash.com/${width}x${height}/?${query}`;",
    "}",
];

fs.writeFileSync(file, lines.join('\n') + '\n');
console.log(`✓ Fixed: ${Object.keys(entries).length} entries, 0 orphans`);
