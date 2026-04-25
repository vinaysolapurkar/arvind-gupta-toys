#!/usr/bin/env python3
import os, re, sys

pages = ['gleam-in-eye','air-and-water','amazing-astronomy','beginner-biology','electricity-magnetism',
         'flying-toys','force-fun','fun-with-light','fun-with-pressure','magic-miscellany',
         'math-magic','motor-and-generator','newton-unplugged','paper-fun','pumps-from-dump',
         'simple-sounds','spinning-toys','string-games','strong-structures','tipping-toppling-toys',
         'k-v-potdar','toys-from-trash','tree-tales','puzzles']

for page in pages:
    try:
        html = open(f'{page}.html', 'r', encoding='utf-8', errors='ignore').read()
    except:
        print(f'=== {page}: FILE NOT FOUND ===')
        continue

    # Extract toy names from list items
    # Pattern: <li><a href="/./toys/NAME.html"><img.../> NAME</a></li>
    links = re.findall(r'<a[^>]+href=["\']/[^"\']*toys/([^"\']+)\.html["\'][^>]*>.*?<img[^>]*/>\s*([^<]+)</a>', html, re.DOTALL)
    # Also try simpler pattern
    links2 = re.findall(r'toys/([a-zA-Z0-9_!]+)\.html["\'][^>]*>.*?<img[^>]*/>\s*([^<]+)</a>', html, re.DOTALL)

    toponyms = []
    for l,n in links:
        name = re.sub(r'<[^>]+>', '', n).strip()
        if name and len(name) > 1:
            toponyms.append(name)

    print(f'=== {page} ({len(toponyms)} toys) ===')
    for t in toponyms[:80]:
        print(f'  {t}')