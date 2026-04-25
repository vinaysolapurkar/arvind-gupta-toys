#!/usr/bin/env python3
import re, json

html = open('films.html', 'r', encoding='utf-8', errors='ignore').read()

# Find section boundaries using HTML comments
section_pattern = r'<!-- ([A-Z ]+) -->'
section_starts = {}
for m in re.finditer(section_pattern, html):
    section_name = m.group(1).strip().lower()
    section_starts[m.start()] = section_name

sorted_starts = sorted(section_starts.items(), key=lambda x: x[0])
print("Sections found:")
for pos, name in sorted_starts:
    print(f"  {pos}: {name}")

# Categorize films based on position
def get_category(pos):
    sorted_positions = sorted(section_starts.keys())
    cat = 'inspiring'
    for i, sp in enumerate(sorted_positions):
        if pos < sp:
            # Find previous section
            idx = sorted_positions.index(sp)
            if idx > 0:
                prev = sorted_positions[idx-1]
                prev_name = section_starts[prev].lower()
                if 'air' in prev_name: cat = 'air'
                elif 'biolog' in prev_name: cat = 'biology'
                elif 'balanc' in prev_name: cat = 'balancing'
                elif 'chemist' in prev_name: cat = 'chemistry'
                elif 'electric' in prev_name: cat = 'electricity'
                else: cat = 'inspiring'
            break
    else:
        cat = 'inspiring'
    return cat

# Extract all films with position info
films = []
film_p = r'<li><a href="https?://(?:www\.)?youtube\.com/(?:watch\?v=|youtu\.be/)([a-zA-Z0-9_-]{11})">\s*(?:ENGLISH|HINDI) - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\(([^)]+)\)'

for m in re.finditer(film_p, html):
    vid = m.group(1)
    title = m.group(2).strip()
    dur_str = m.group(3).strip()
    pos = m.start()
    cat = get_category(pos)
    films.append({'youtubeId':vid,'title':title,'duration':dur_str,'category':cat,'pos':pos})

# Deduplicate by youtubeId
seen = {}
unique = []
for f in films:
    if f['youtubeId'] not in seen:
        seen[f['youtubeId']] = True
        unique.append(f)

print(f"\nTotal unique films: {len(unique)}")
for cat in ['inspiring','air','biology','balancing','chemistry','electricity']:
    cnt = sum(1 for f in unique if f['category']==cat)
    print(f"  {cat}: {cnt}")

# Show some samples
print("\nSample per category:")
for cat in ['inspiring','air','biology','balancing','chemistry','electricity']:
    sample = next((f for f in unique if f['category']==cat), None)
    if sample:
        print(f"  [{cat}] {sample['title']} ({sample['duration']})")

# Save as JSON for later processing
with open('films_data.json', 'w') as f:
    json.dump(unique, f, indent=2)
print("\nSaved to films_data.json")