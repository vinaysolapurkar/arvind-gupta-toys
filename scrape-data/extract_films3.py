#!/usr/bin/env python3
import re, json

html = open('films.html', 'r', encoding='utf-8', errors='ignore').read()

# Find all section headers (centerbig)
# These come before each film's category section
sections_raw = re.findall(r'<p class="centerbig">([^<]+)</p>', html)
print(f"Section headers: {sections_raw}")

# Find all film entries with various duration formats
films = []

# Pattern 1: (X MIN Y SEC) format
p1 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">\s*ENGLISH - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\((\d+)\s*MIN\s*(\d+)\s*SEC\)'
for m in re.finditer(p1, html):
    vid = m.group(1)
    title = m.group(2).strip()
    mins = m.group(3)
    secs = m.group(4).zfill(2)
    if not any(f['youtubeId']==vid for f in films):
        films.append({'youtubeId':vid,'title':title,'duration':f"{mins}:{secs}"})

# Pattern 2: (X MIN Y MIN) format (typo in HTML)
p2 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">\s*ENGLISH - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\((\d+)\s*MIN\s*(\d+)\s*MIN\)'
for m in re.finditer(p2, html):
    vid = m.group(1)
    title = m.group(2).strip()
    mins = m.group(3)
    secs = m.group(4).zfill(2)
    if not any(f['youtubeId']==vid for f in films):
        films.append({'youtubeId':vid,'title':title,'duration':f"{mins}:{secs}"})

# Pattern 3: (X MIN) format
p3 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">\s*ENGLISH - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\((\d+)\s*MIN\)'
for m in re.finditer(p3, html):
    vid = m.group(1)
    title = m.group(2).strip()
    mins = m.group(3)
    if not any(f['youtubeId']==vid for f in films):
        films.append({'youtubeId':vid,'title':title,'duration':f"{mins}:00"})

# Pattern 4: (X MIN Y MIN) typo from line 285
p4 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">\s*ENGLISH - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\(([\d.]+)\s*MIN\)'
for m in re.finditer(p4, html):
    vid = m.group(1)
    title = m.group(2).strip()
    dur = m.group(3)
    if not any(f['youtubeId']==vid for f in films):
        films.append({'youtubeId':vid,'title':title,'duration':dur})

# Pattern 5: Just (X SEC)
p5 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">\s*ENGLISH - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\((\d+)\s*SEC\)'
for m in re.finditer(p5, html):
    vid = m.group(1)
    title = m.group(2).strip()
    secs = int(m.group(3))
    mins = secs // 60
    secs = secs % 60
    if not any(f['youtubeId']==vid for f in films):
        films.append({'youtubeId':vid,'title':title,'duration':f"{mins}:{secs:02d}"})

print(f"\nTotal films extracted: {len(films)}")

# Now categorize films based on their position relative to section headers
# Get positions of all section headers
header_matches = list(re.finditer(r'<p class="centerbig">([^<]+)</p>', html))
header_positions = [(m.start(), m.group(1)) for m in header_matches]
# Add end of file as sentinel
header_positions.append((len(html), ''))

# Categorize based on which section header the film appears after
def get_category(pos):
    cat = 'inspiring'
    for i, (hp, hn) in enumerate(header_positions[:-1]):
        if hp <= pos < header_positions[i+1][0]:
            h = hn.lower()
            if 'biology' in h: cat='biology'
            elif 'balanc' in h: cat='balancing'
            elif 'chemist' in h: cat='chemistry'
            elif 'electric' in h: cat='electricity'
            elif 'air' in h: cat='air'
            elif 'inspiring' in h: cat='inspiring'
            elif 'film' in h: cat='inspiring'
            break
    return cat

# Re-extract with position info
all_films = []
p_all = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">\s*ENGLISH - ([^<]+?)\s*(?:<span>[^<]*</span>)?\s*</a>\s*\(([^)]+)\)'
for m in re.finditer(p_all, html):
    vid = m.group(1)
    title = m.group(2).strip()
    dur_str = m.group(3)
    pos = m.start()
    cat = get_category(pos)
    all_films.append({'youtubeId':vid,'title':title,'duration':dur_str,'category':cat})

# Deduplicate
seen = set()
unique = []
for f in all_films:
    if f['youtubeId'] not in seen:
        seen.add(f['youtubeId'])
        unique.append(f)

print(f"Unique films: {len(unique)}")
for cat in ['inspiring','air','biology','balancing','chemistry','electricity']:
    cnt = sum(1 for f in unique if f['category']==cat)
    print(f"  {cat}: {cnt}")

# Print some sample films
print("\nSample films:")
for f in unique[:10]:
    print(f"  [{f['category']}] {f['title']} ({f['duration']}) -> {f['youtubeId']}")