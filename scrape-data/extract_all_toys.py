#!/usr/bin/env python3
"""Extract all toys from scraped HTML files."""
import re, json, os

# Map page filename -> category id
pages = {
    'gleam-in-eye': 'gleam-eye',
    'air-and-water': 'air-water',
    'amazing-astronomy': 'astronomy',
    'beginner-biology': 'biology',
    'electricity-magnetism': 'electricity',
    'flying-toys': 'flying',
    'force-fun': 'force-fun',
    'fun-with-light': 'light',
    'fun-with-pressure': 'pressure',
    'magic-miscellany': 'miscellany',
    'math-magic': 'math-magic',
    'motor-and-generator': 'motor-generator',
    'newton-unplugged': 'newton',
    'paper-fun': 'paper-fun',
    'pumps-from-dump': 'pumps',
    'simple-sounds': 'sounds',
    'spinning-toys': 'spinning',
    'string-games': 'string-games',
    'strong-structures': 'structures',
    'tipping-toppling-toys': 'tipping',
    'k-v-potdar': 'potdar',
    'toys-from-trash': 'toys-trash',
    'tree-tales': 'tree-tales',
    'puzzles': 'puzzles',
}

# Icon mapping by category
icon_map = {
    'gleam-eye': 'Sparkles',
    'air-water': 'Droplets',
    'astronomy': 'Star',
    'biology': 'Leaf',
    'electricity': 'Zap',
    'flying': 'Plane',
    'force-fun': 'FlaskConical',
    'light': 'Sun',
    'pressure': 'Gauge',
    'miscellany': 'Wand',
    'math-magic': 'Calculator',
    'motor-generator': 'Cog',
    'newton': 'Apple',
    'paper-fun': 'FileText',
    'pumps': 'Droplets',
    'sounds': 'Volume2',
    'spinning': 'RotateCw',
    'string-games': 'GitBranch',
    'structures': 'Building',
    'tipping': 'Triangle',
    'potdar': 'User',
    'toys-trash': 'Trash',
    'tree-tales': 'TreePine',
    'puzzles': 'Puzzle',
}

toys = []
toy_id_set = set()

for page_name, cat_id in pages.items():
    filepath = f'/home/ubuntu/.openclaw/workspace/arvind-gupta-toys/scrape-data/{page_name}.html'
    if not os.path.exists(filepath):
        print(f"Missing: {page_name}")
        continue
    
    html = open(filepath, 'r', encoding='utf-8', errors='ignore').read()
    
    # Extract toy links: <a href="/./toys/NAME.html"><img.../> TOY TITLE </a>
    # Try multiple patterns
    pattern = r'<a[^>]+href=["\']/[^"\']*toys/([^"\']+)\.html["\'][^>]*>\s*<img[^>]*/>\s*([^<]+)</a>'
    matches = re.findall(pattern, html, re.DOTALL)
    
    if not matches:
        # Try another pattern
        pattern2 = r'<li[^>]*><a[^>]+href=["\']/[^"\']*toys/([^"\']+)\.html["\'][^>]*>.*?<img[^>]*/>\s*([^<]+)</a>'
        matches = re.findall(pattern2, html, re.DOTALL)
    
    icon = icon_map.get(cat_id, 'Box')
    
    for slug, name in matches:
        name = re.sub(r'<[^>]+>', '', name).strip()
        if not name or len(name) < 2:
            continue
        # Generate toy id
        base_id = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower())
        base_id = re.sub(r'-+', '-', base_id).strip('-')
        # Make unique
        tid = base_id
        counter = 1
        while tid in toy_id_set:
            tid = f"{base_id}-{counter}"
            counter += 1
        toy_id_set.add(tid)
        
        # Difficulty heuristic based on name
        difficulty = 'Beginner'
        hard_words = ['advanced', 'complex', 'science', 'electric', 'magnet', 'motor', 'generator', 'solar', 'chemistry']
        easy_words = ['simple', 'basic', 'easy', 'paper', 'card', 'balloon', 'straw']
        name_lower = name.lower()
        if any(w in name_lower for w in hard_words):
            difficulty = 'Intermediate'
        if any(w in name_lower for w in ['motor', 'generator', 'solar', 'complex']):
            difficulty = 'Advanced'
        
        toys.append({
            'id': tid,
            'title': name,
            'description': f'A science toy from the {cat_id.replace("-", " ")} category. Make it from everyday materials!',
            'category': cat_id,
            'difficulty': difficulty,
            'materials': [],
            'instructions': 'Instructions coming soon. Visit arvindguptatoys.com for full details.',
            'icon': icon,
            'slug': slug,
            'sourceUrl': f'https://www.arvindguptatoys.com/toys/{slug}.html',
        })
    
    print(f"{page_name}: {len(matches)} toys -> cat {cat_id}")

print(f"\nTotal toys: {len(toys)}")
with open('/home/ubuntu/.openclaw/workspace/arvind-gupta-toys/scrape-data/all_toys.json', 'w') as f:
    json.dump(toys, f, indent=2)
print("Saved to all_toys.json")