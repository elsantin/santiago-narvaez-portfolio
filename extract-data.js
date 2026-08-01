import fs from 'fs';

const html = fs.readFileSync('old-index.html', 'utf8');

const regex = /<div class="gallery-item"[^>]*data-index="([^"]*)"[^>]*data-title="([^"]*)"[^>]*data-category="([^"]*)"[^>]*data-description="([^"]*)"[^>]*data-description-es="([^"]*)"[^>]*>[\s\S]*?<img src="([^"]*)"/g;

const items = [];
let match;

while ((match = regex.exec(html)) !== null) {
  items.push({
    id: match[1],
    title: match[2],
    category: match[3],
    descriptionEn: match[4],
    descriptionEs: match[5],
    image: match[6]
  });
}

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/portfolio.json', JSON.stringify(items, null, 2));

console.log(`Extracted ${items.length} items`);
