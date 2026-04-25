#!/usr/bin/env python3
import re, json

html = open('films.html', 'r', encoding='utf-8', errors='ignore').read()

# Extract all film entries - each is a list item with a YouTube link
film_pattern = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">([^<]+)</a>\s*\((\d+)\s*MIN\s*(\d+)\s*SEC\)</li>'
matches = re.findall(film_pattern, html)

films = []
for vid, title, mins, secs in matches:
    t = title.strip()
    duration = f"{mins}:{secs.zfill(2)}"
    # Determine category based on position/context
    films.append({'youtubeId': vid, 'title': t, 'duration': duration})

print(f"Total films extracted: {len(films)}")

# Also check for shorter pattern
film_pattern2 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">([^<]+)</a>\s*\((\d+)\s*MIN\)</li>'
matches2 = re.findall(film_pattern2, html)
for vid, title, mins in matches2:
    t = title.strip()
    # Check if already added
    if not any(f['youtubeId'] == vid for f in films):
        films.append({'youtubeId': vid, 'title': t, 'duration': f"{mins}:00"})

# Check for another pattern: (X MIN Y SEC) or (X MIN Y MIN)
film_pattern3 = r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">([^<]+)</a>\s*\(([\d.]+)\s*MIN\)</li>'
matches3 = re.findall(film_pattern3, html)
for vid, title, dur in matches3:
    t = title.strip()
    if not any(f['youtubeId'] == vid for f in films):
        # Parse duration like "0 MIN 48 SEC" or "4 MIN 52 SEC"
        films.append({'youtubeId': vid, 'title': t, 'duration': dur})

print(f"Total films after all patterns: {len(films)}")

# Deduplicate
seen = set()
deduped = []
for f in films:
    if f['youtubeId'] not in seen:
        seen.add(f['youtubeId'])
        deduped.append(f)

films = deduped
print(f"Deduplicated: {len(films)}")

# Categorize films based on their position in the file
# The file has sections: Inspiring, Air, Biology, Balancing, Chemistry, Electricity
# Let's look at surrounding headers
section_headers = re.findall(r'<p class="centerbig">([^<]+)</p>', html)
print(f"\nSection headers found: {section_headers}")

# Also look at HTML structure to determine categories
# Let's find indices of section headers
header_positions = []
for m in re.finditer(r'<p class="centerbig">([^<]+)</p>', html):
    header_positions.append((m.start(), m.group(1)))

print(f"Header positions: {header_positions[:10]}")

# Categorize by section
categories = {}
current_cat = 'inspiring'
current_idx = 0
for pos, header in header_positions:
    cats = ['inspiring','air','biology','balancing','chemistry','electricity']
    if 'air' in header.lower():
        current_cat = 'air'
    elif 'biolog' in header.lower():
        current_cat = 'biology'
    elif 'balanc' in header.lower():
        current_cat = 'balancing'
    elif 'chemist' in header.lower():
        current_cat = 'chemistry'
    elif 'electric' in header.lower():
        current_cat = 'electricity'
    categories[pos] = current_cat

# Assign categories to films
film_list = []
film_matches = list(re.finditer(r'<li><a href="https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})">([^<]+)</a>\s*\((\d+)\s*MIN\s*(\d+)\s*SEC\)</li>', html))
for m in film_matches:
    vid = m.group(1)
    title = m.group(2).strip()
    mins = m.group(3)
    secs = m.group(4).zfill(2)
    pos = m.start()
    # Find which section this belongs to
    cat = 'inspiring'
    for hp in sorted(categories.keys(), reverse=True):
        if pos > hp:
            cat = categories[hp]
            break
    film_list.append({'youtubeId': vid, 'title': title, 'duration': f"{mins}:{secs}", 'category': cat})

print(f"\nTotal categorized films: {len(film_list)}")
for cat in ['inspiring','air','biology','balancing','chemistry','electricity']:
    count = sum(1 for f in film_list if f['category'] == cat)
    print(f"  {cat}: {count}")

# Print first few
for f in film_list[:5]:
    print(f"  {f}")