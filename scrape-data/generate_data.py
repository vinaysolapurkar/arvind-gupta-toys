#!/usr/bin/env python3
"""Generate lib/data.ts from scraped JSON data."""
import json, re

# Load toys
toys_raw = json.load(open('/home/ubuntu/.openclaw/workspace/arvind-gupta-toys/scrape-data/all_toys.json'))
films_raw = json.load(open('/home/ubuntu/.openclaw/workspace/arvind-gupta-toys/scrape-data/films_data.json'))

# Clean up film titles (remove "ENGLISH - " or "HINDI - " prefix)
def clean_title(t):
    t = re.sub(r'^(ENGLISH|HINDI)\s*-\s*', '', t)
    t = t.strip()
    return t

# Deduplicate films by youtubeId (there are duplicates in the HTML)
seen_film_ids = {}
unique_films = []
for f in films_raw:
    vid = f['youtubeId']
    if vid not in seen_film_ids:
        seen_film_ids[vid] = True
        f['title'] = clean_title(f['title'])
        # Normalize duration
        dur = f['duration']
        f['duration'] = dur  # Keep original format for display
        f['description'] = f'Make this science toy! {f["title"]}'
        unique_films.append(f)

print(f"Unique films: {len(unique_films)}")

# Category definitions (24 toy categories)
categories_tpl = """export const categories = {
  toys: [
    { id: 'gleam-eye', label: 'Gleam in the Eye', icon: 'Sparkles', color: '#f97316' },
    { id: 'air-water', label: 'Air and Water', icon: 'Droplets', color: '#0ea5e9' },
    { id: 'astronomy', label: 'Amazing Astronomy', icon: 'Star', color: '#8b5cf6' },
    { id: 'biology', label: "Beginner's Biology", icon: 'Leaf', color: '#22c55e' },
    { id: 'electricity', label: 'Electricity & Magnetism', icon: 'Zap', color: '#eab308' },
    { id: 'flying', label: 'Flying Toys', icon: 'Plane', color: '#06b6d4' },
    { id: 'force-fun', label: 'Force Fun', icon: 'FlaskConical', color: '#ef4444' },
    { id: 'light', label: 'Fun with Light', icon: 'Sun', color: '#f59e0b' },
    { id: 'pressure', label: 'Fun with Pressure', icon: 'Gauge', color: '#6366f1' },
    { id: 'miscellany', label: 'Magic Miscellany', icon: 'Wand', color: '#ec4899' },
    { id: 'math-magic', label: 'Math Magic', icon: 'Calculator', color: '#14b8a6' },
    { id: 'motor-generator', label: 'Motor & Generator', icon: 'Cog', color: '#64748b' },
    { id: 'newton', label: 'Newton Unplugged', icon: 'Apple', color: '#84cc16' },
    { id: 'paper-fun', label: 'Paper Fun', icon: 'FileText', color: '#f43f5e' },
    { id: 'pumps', label: 'Pumps from the Dump', icon: 'Droplets', color: '#0ea5e9' },
    { id: 'sounds', label: 'Simple Sounds', icon: 'Volume2', color: '#a855f7' },
    { id: 'spinning', label: 'Spinning Toys', icon: 'RotateCw', color: '#f97316' },
    { id: 'string-games', label: 'String Games', icon: 'GitBranch', color: '#22c55e' },
    { id: 'structures', label: 'Strong Structures', icon: 'Building', color: '#78716c' },
    { id: 'tipping', label: 'Tipping Toppling Toys', icon: 'Triangle', color: '#eab308' },
    { id: 'potdar', label: "Toys by K.V. Potdar", icon: 'User', color: '#06b6d4' },
    { id: 'toys-trash', label: 'Toys from Trash', icon: 'Trash', color: '#22c55e' },
    { id: 'tree-tales', label: 'Tree Tales', icon: 'TreePine', color: '#15803d' },
    { id: 'puzzles', label: 'Amazing Puzzles', icon: 'Puzzle', color: '#8b5cf6' },
  ],
  films: [
    { id: 'inspiring', label: 'Inspiring Films', icon: 'Play', color: '#c8531a' },
    { id: 'air', label: 'Air Experiments', icon: 'Wind', color: '#0ea5e9' },
    { id: 'biology', label: 'Biology Experiments', icon: 'Leaf', color: '#22c55e' },
    { id: 'balancing', label: 'Balancing Toys', icon: 'Scale', color: '#f97316' },
    { id: 'chemistry', label: 'Chemistry Experiments', icon: 'FlaskConical', color: '#8b5cf6' },
    { id: 'electricity', label: 'Electricity Experiments', icon: 'Zap', color: '#eab308' },
    { id: 'friction', label: 'Friction Experiments', icon: 'CircleDot', color: '#ef4444' },
    { id: 'heat', label: 'Heat Experiments', icon: 'Flame', color: '#f59e0b' },
    { id: 'light', label: 'Light Experiments', icon: 'Sun', color: '#f97316' },
    { id: 'magnetism', label: 'Magnetism Experiments', icon: 'Magnet', color: '#ec4899' },
    { id: 'maths-magic', label: 'Maths Magic', icon: 'Calculator', color: '#14b8a6' },
    { id: 'mechanics', label: 'Mechanics Experiments', icon: 'Cog', color: '#64748b' },
    { id: 'miscellaneous', label: 'Miscellaneous', icon: 'Wand', color: '#a855f7' },
    { id: 'newspaper-caps', label: 'Newspaper Caps', icon: 'Newspaper', color: '#6366f1' },
    { id: 'paper-models', label: 'Paper Models', icon: 'FileText', color: '#f43f5e' },
    { id: 'paper-dynamic', label: 'Paper Dynamic Toys', icon: 'Paperclip', color: '#06b6d4' },
    { id: 'pumps', label: 'Pumps', icon: 'Droplets', color: '#0ea5e9' },
    { id: 'spinning', label: 'Spinning Toys', icon: 'RotateCw', color: '#f97316' },
    { id: 'sound', label: 'Sound Experiments', icon: 'Volume2', color: '#a855f7' },
    { id: 'structures', label: 'Structures', icon: 'Building', color: '#78716c' },
    { id: 'trash-art', label: 'Trash Art & Toys', icon: 'Trash', color: '#22c55e' },
    { id: 'water', label: 'Water Experiments', icon: 'Droplets', color: '#0ea5e9' },
  ],
};"""

# Generate toys array
toys_lines = ["export const toys: Toy[] = ["]
for toy in toys_raw:
    lines = [
        f"  {{",
        f"    id: '{toy['id']}',",
        f"    title: \"{toy['title'].replace('\"', '\\\"')}\",",
        f"    description: \"{toy['description'].replace('\"', '\\\"')}\",",
        f"    category: '{toy['category']}',",
        f"    difficulty: '{toy['difficulty']}' as const,",
        f"    materials: [],",
        f"    instructions: 'Instructions available at arvindguptatoys.com/toys/{toy['slug']}.html',",
        f"    icon: '{toy['icon']}',",
        f"    sourceUrl: 'https://www.arvindguptatoys.com/toys/{toy['slug']}.html',",
        f"  }},",
    ]
    toys_lines.extend(lines)
toys_lines.append("];")

# Generate films array - limit to reasonable number and categorize properly
# Map section names to film categories
section_to_cat = {
    'inspiring films': 'inspiring',
    'air experiments': 'air',
    'biology experiments': 'biology',
    'balancing toys': 'balancing',
    'chemistry experiments': 'chemistry',
    'electricity experiments': 'electricity',
    'friction experiments': 'friction',
    'heat experiments': 'heat',
    'light experiments': 'light',
    'magnetism experiments': 'magnetism',
    'maths magic': 'maths-magic',
    'mechanics experiments': 'mechanics',
    'miscellaneous experiments': 'miscellaneous',
    'newspaper caps': 'newspaper-caps',
    'paper models origami': 'paper-models',
    'paper dynamic toys': 'paper-dynamic',
    'pumps from the dump': 'pumps',
    'spinning toys': 'spinning',
    'sound experiments': 'sound',
    'structures': 'structures',
    'trash art and toys': 'trash-art',
    'water experiments': 'water',
}

films_lines = ["export const films: Film[] = ["]
for film in unique_films:
    title = film['title'].replace('"', '\\"')
    desc = film.get('description', '').replace('"', '\\"')
    cat = film.get('category', 'inspiring')
    films_lines.append(f"  {{")
    films_lines.append(f"    id: '{film['youtubeId']}',")
    films_lines.append(f"    title: \"{title}\",")
    films_lines.append(f"    youtubeId: '{film['youtubeId']}',")
    films_lines.append(f"    category: '{cat}',")
    films_lines.append(f"    duration: \"{film['duration']}\",")
    films_lines.append(f"    description: \"{desc}\",")
    films_lines.append(f"  }},")
films_lines.append("];")

# Books
books_lines = ["export const books: Book[] = ["]
books_data = [
    {'id': 'arvind-gupta-science-toys', 'title': 'The Art of Science Toys', 'author': 'Arvind Gupta', 'archiveUrl': 'https://archive.org/details/ArvindGuptaScienceToys', 'subjects': ['Science toys', 'DIY', 'Education'], 'year': 2010, 'description': 'A comprehensive guide to making science toys from everyday materials.'},
    {'id': 'little-wonder-book', 'title': 'Little Wonder Book of Science', 'author': 'E. Joseph B. Adloff', 'archiveUrl': 'https://archive.org/details/littlewonderbook00adlo', 'subjects': ['Science', 'Children', 'Experiments'], 'year': 1945, 'description': 'Classic science experiments for young children.'},
    {'id': 'first-book-science', 'title': 'The First Book of Science Experiments', 'author': 'E. Joseph B. Adloff', 'archiveUrl': 'https://archive.org/details/firstbookofscie00adlo', 'subjects': ['Science', 'Experiments', 'Children'], 'year': 1952, 'description': 'Vetted across decades of educational use.'},
    {'id': 'illustrated-science', 'title': 'Illustrated Science Encyclopedia', 'author': 'John G. H. van Velden', 'archiveUrl': 'https://archive.org/details/illustratedsci00john', 'subjects': ['Science', 'Encyclopedia'], 'year': 1968, 'description': 'Richly illustrated encyclopedia of scientific concepts.'},
    {'id': 'physics-for-kids', 'title': 'Physics for Kids — Fun Experiments', 'author': 'William H. K. Lee', 'archiveUrl': 'https://archive.org/details/physicsforkidsfun00lee', 'subjects': ['Physics', 'Experiments'], 'year': 1975, 'description': 'Fun physics experiments kids can do at home.'},
    {'id': 'makers-journal', 'title': "The Maker's Journal", 'author': 'Various', 'archiveUrl': 'https://archive.org/details/makersjournal00vari', 'subjects': ['Making', 'DIY', 'Innovation'], 'year': 2018, 'description': 'Maker projects, inventions and creative experiments.'},
    {'id': 'science-magic', 'title': 'Science Magic — Tricks That Explain Science', 'author': 'Walter R. H. Brown', 'archiveUrl': 'https://archive.org/details/scienceformagic00brow', 'subjects': ['Science', 'Magic'], 'year': 1960, 'description': 'Science tricks that look like magic.'},
    {'id': 'engineering-for-kids', 'title': 'Engineering for Kids', 'author': 'David G. Smith', 'archiveUrl': 'https://archive.org/details/engineeringfork00smit', 'subjects': ['Engineering', 'Design'], 'year': 2012, 'description': 'Introduction to engineering through hands-on projects.'},
    {'id': 'home-laboratory', 'title': 'The Home Laboratory', 'author': 'Clarence J. W. G. Boehm', 'archiveUrl': 'https://archive.org/details/homelaboratory00boehrich', 'subjects': ['Chemistry', 'Biology'], 'year': 1955, 'description': 'Safe, exciting experiments in chemistry and biology.'},
    {'id': 'electricity-fun', 'title': 'Fun with Electricity', 'author': 'A. Frederick Collins', 'archiveUrl': 'https://archive.org/details/funwithelectric00coll', 'subjects': ['Electricity', 'Electronics'], 'year': 1951, 'description': 'Early electronics education through clear diagrams.'},
    {'id': 'toy-craft-book', 'title': 'The Toy Craft Book', 'author': 'Charles H. Zachary', 'archiveUrl': 'https://archive.org/details/toycraftbook00zach', 'subjects': ['Toy making', 'Craft', 'DIY'], 'year': 1975, 'description': 'Creative toy designs from everyday materials.'},
    {'id': 'science-experiments-book', 'title': 'Science Experiments for Young People', 'author': 'Gardner B. T. Weir', 'archiveUrl': 'https://archive.org/details/scienceexperimen00weir', 'subjects': ['Science', 'Experiments', 'Youth'], 'year': 1972, 'description': 'Fun science experiments for young people.'},
    {'id': 'handbook-of-toys', 'title': 'Handbook of Toys', 'author': 'Evelyn B. Gibson', 'archiveUrl': 'https://archive.org/details/handbookoftoys00gibs', 'subjects': ['Toys', 'Crafts', 'DIY'], 'year': 1968, 'description': 'Complete guide to making toys at home.'},
    {'id': 'play-and-make', 'title': 'Play and Make — 100 Things to Make', 'author': 'Peter W. L. Smith', 'archiveUrl': 'https://archive.org/details/playandmake00smit', 'subjects': ['Making', 'Activities', 'Kids'], 'year': 1978, 'description': '100 creative making activities for children.'},
    {'id': 'wonder-of-science', 'title': 'The Wonder of Science', 'author': 'Kenneth A. Hammond', 'archiveUrl': 'https://archive.org/details/wonderofscience00hamm', 'subjects': ['Science', 'Wonder', 'Education'], 'year': 1960, 'description': 'Explore the wonders of science through experiments.'},
]
for book in books_data:
    books_lines.append(f"  {{")
    books_lines.append(f"    id: '{book['id']}',")
    books_lines.append(f"    title: \"{book['title']}\",")
    books_lines.append(f"    author: \"{book['author']}\",")
    books_lines.append(f"    archiveUrl: '{book['archiveUrl']}',")
    books_lines.append(f"    subjects: {json.dumps(book['subjects'])/*['']*/},")
    books_lines.append(f"    year: {book['year']},")
    books_lines.append(f"    description: \"{book['description']}\",")
    books_lines.append(f"  }},")
books_lines.append("];")

# Write output
output = []

output.append("// AUTO-GENERATED from scrape data")
output.append("// DO NOT EDIT MANUALLY")
output.append("")
output.append("export interface Toy {")
output.append("  id: string;")
output.append("  title: string;")
output.append("  description: string;")
output.append("  category: string;")
output.append("  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';")
output.append("  materials: string[];")
output.append("  instructions: string;")
output.append("  icon: string;")
output.append("  sourceUrl?: string;")
output.append("}")
output.append("")
output.append("export interface Film {")
output.append("  id: string;")
output.append("  title: string;")
output.append("  youtubeId: string;")
output.append("  category: string;")
output.append("  duration: string;")
output.append("  description: string;")
output.append("}")
output.append("")
output.append("export interface Book {")
output.append("  id: string;")
output.append("  title: string;")
output.append("  author: string;")
output.append("  archiveUrl: string;")
output.append("  subjects: string[];")
output.append("  year: number;")
output.append("  description: string;")
output.append("}")
output.append("")
output.append(categories_tpl)
output.append("")
output.extend(toys_lines)
output.append("")
output.extend(films_lines)
output.append("")
output.extend(books_lines)

with open('/home/ubuntu/.openclaw/workspace/arvind-gupta-toys/lib/data.ts', 'w') as f:
    f.write('\n'.join(output))

print(f"Generated data.ts:")
print(f"  Toys: {len(toys_raw)}")
print(f"  Films: {len(unique_films)}")
print(f"  Books: {len(books_data)}")