#!/usr/bin/env python3
import re

html = open('films.html', 'r', encoding='utf-8', errors='ignore').read()

# Extract YouTube video IDs and titles from the films page
# Pattern: youtube.com/watch?v=XXXXX or youtu.be/XXXXX
# Titles seem to be in headings or links near the video embeds

# Find all youtube links and surrounding context
youtube_ids = re.findall(r'youtu\.be/([a-zA-Z0-9_-]{11})', html)
youtube_ids += re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', html)

# Get unique IDs
unique_ids = list(dict.fromkeys(youtube_ids))
print(f"Total unique YouTube IDs: {len(unique_ids)}")
for vid in unique_ids[:50]:
    print(f"  {vid}")

# Let's also look at the structure of film sections
sections = re.findall(r'<p class="centerbig">([^<]+)</p>', html)
print(f"\n=== Sections ===")
for s in sections:
    print(f"  {s}")