#!/usr/bin/env python3
import re, json

html = open('films.html', 'r', encoding='utf-8', errors='ignore').read()

# Find section headers (subhead class)
section_pattern = r'<p class="subhead"[^>]*><b>\s*([^:<]+?)\s*:?\s*</b></p>'
section_starts = []
for m in re.finditer(section_pattern, html):
    name = m.group(1).strip().lower()
    pos = m.start()
    section_starts.append((pos, name))

# Sort by position
section_starts.sort(key=lambda x: x[0])
print("Sections found:")
for pos, name in section_starts[:30]:
    print(f"  {pos}: {name}")

# Build category mapping
def name_to_cat(name):
    n = name.lower()
    if 'inspiring' in n: return 'inspiring'
    if 'air' in n: return 'air'
    if 'biolog' in n: return 'biology'
    if 'balancing' in n: return 'balancing'
    if 'chemist' in n: return 'chemistry'
    if 'electric' in n: return 'electricity'
    if 'friction' in n: return 'friction'
    if 'heat' in n: return 'heat'
    if 'light' in n: return 'light'
    if 'magnet' in n: return 'magnetism'
    if 'math' in n: return 'maths-magic'
    if 'mechanic' in n: return 'mechanics'
    if 'miscellaneous' in n or 'miscellan' in n: return 'miscellaneous'
    if 'newspaper' in n: return 'newspaper-caps'
    if 'paper model' in n and 'dynamic' in n: return 'paper-dynamic'
    if 'paper model' in n or 'origami' in n: return 'paper-models'
    if 'paper dynamic' in n: return 'paper-dynamic'
    if 'pump' in n: return 'pumps'
    if 'spinning' in n: return 'spinning'
    if 'sound' in n: return 'sound'
    if 'structure' in n: return 'structures'
    if 'trash' in n or 'art' in n: return 'trash-art'
    if 'water' in n: return 'water'
    return 'inspiring'

# Assign category to each film based on position
def get_category_for_pos(pos):
    for i in range(len(section_starts)-1, -1, -1):
        if pos >= section_starts[i][0]:
            return name_to_cat(section_starts[i][1])
    return 'inspiring'

# Extract all films
film_re = r'<li><a href="https?://(?:www\.)?youtube\.com/(?:watch\?v=|youtu\.be/)([a-zA-Z0-9_-]{11})">\s*(?:ENGLISH|HINDI|MALAYALAM|MARATHI)\s*-\s*([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\(([^)]+)\)'

films = []
for m in re.finditer(film_re, html):
    vid = m.group(1)
    title = re.sub(r'^(ENGLISH|HINDI|MALAYALAM|MARATHI)\s*-\s*', '', m.group(2)).strip()
    dur_str = m.group(3).strip()
    pos = m.start()
    cat = get_category_for_pos(pos)
    
    films.append({'youtubeId': vid, 'title': title, 'duration': dur_str, 'category': cat})

# Deduplicate
seen = {}
unique = []
for f in films:
    if f['youtubeId'] not in seen:
        seen[f['youtubeId']] = True
        unique.append(f)

print(f"\nTotal unique films: {len(unique)}")
for cat in ['inspiring','air','biology','balancing','chemistry','electricity','friction','heat','light','magnetism','maths-magic','mechanics','miscellaneous','newspaper-caps','paper-models','paper-dynamic','pumps','spinning','sound','structures','trash-art','water']:
    cnt = sum(1 for f in unique if f['category']==cat)
    if cnt > 0:
        print(f"  {cat}: {cnt}")

print("\nSamples:")
for cat in ['inspiring','air','biology','balancing','chemistry','electricity','friction','light','magnetism','maths-magic','spinning','water']:
    s = next((f for f in unique if f['category']==cat), None)
    if s:
        print(f"  [{cat}] {s['title']} ({s['duration']})")

with open('films_data.json', 'w') as f:
    json.dump(unique, f, indent=2)
print("\nSaved to films_data.json")