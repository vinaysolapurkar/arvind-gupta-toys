#!/usr/bin/env python3
"""Enrich books.json with better metadata: descriptions, subcategories, thumbnails, format."""

import json
import re
import os

BOOKS_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'books.json')

# Subcategory detection from title keywords
SUBCATEGORY_KEYWORDS = {
    'NBTM': 'National Book Trust Marathi',
    'NBT ': 'National Book Trust',
    'NBT-': 'National Book Trust',
    'NCERT': 'NCERT Textbook',
    'CBSE': 'CBSE Textbook',
    'ICSE': 'ICSE Textbook',
    'EKLAVYA': 'Eklavya Publication',
    'ARVIND GUPTA': 'Arvind Gupta Collection',
    'NAVNEET': 'Navneet Publication',
    'CHAKMAK': 'Chakmak Magazine',
    'SANDARBH': 'Sandarbh Magazine',
    'SROTE': 'Srote Magazine',
    'PITARA': 'Pitara',
    'VIGYAN PRASAR': 'Vigyan Prasar',
}

# Book type detection from title keywords
BOOK_TYPE_KEYWORDS = {
    'children': ['CHILDREN', 'KIDS', 'CHILD', 'YOUNG', 'LITTLE', 'FAIRY', 'NURSERY', 'BEDTIME'],
    'textbook': ['TEXTBOOK', 'TEXT BOOK', 'NCERT', 'CBSE', 'ICSE', 'SYLLABUS', 'CLASS ', 'GRADE '],
    'biography': ['BIOGRAPHY', 'LIFE OF', 'STORY OF', 'MEMOIR', 'AUTOBIOGRAPHY', 'GANDHI', 'NEHRU'],
    'novel': ['NOVEL', 'FICTION'],
    'poetry': ['POEM', 'POETRY', 'VERSE', 'BALLAD', 'RHYME'],
    'science': ['SCIENCE', 'EXPERIMENT', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'LABORATORY', 'SCIENTIFIC'],
    'mathematics': ['MATH', 'ALGEBRA', 'GEOMETRY', 'ARITHMETIC', 'CALCULUS', 'NUMBER'],
    'craft': ['CRAFT', 'ORIGAMI', 'PAPER FOLD', 'TOY', 'DIY', 'MAKE ', 'MAKING'],
    'article': ['ARTICLE', 'NEWSPAPER', 'MAGAZINE', 'JOURNAL', 'TIMES OF INDIA', 'HINDU', 'OUTLOOK'],
    'cookbook': ['COOK', 'RECIPE', 'FOOD', 'KITCHEN', 'NUTRITION'],
    'history': ['HISTORY', 'ANCIENT', 'MEDIEVAL', 'CIVILIZATION', 'DYNASTY', 'EMPIRE'],
    'environment': ['ENVIRONMENT', 'ECOLOGY', 'CONSERVATION', 'CLIMATE', 'POLLUTION', 'GREEN'],
    'astronomy': ['ASTRONOMY', 'PLANET', 'STAR', 'SOLAR', 'SPACE', 'UNIVERSE', 'COSMOS', 'GALAXY'],
    'health': ['HEALTH', 'MEDICAL', 'DISEASE', 'MEDICINE', 'BODY', 'NUTRITION', 'HYGIENE'],
    'puzzle': ['PUZZLE', 'RIDDLE', 'QUIZ', 'BRAIN TEASER', 'MAGIC TRICK'],
    'art': ['ART', 'DRAWING', 'PAINTING', 'SKETCH', 'ILLUSTRATION'],
    'music': ['MUSIC', 'SONG', 'SINGING', 'INSTRUMENT', 'MELODY'],
    'story': ['STORY', 'STORIES', 'TALE', 'TALES', 'FABLE', 'FOLK'],
    'guide': ['GUIDE', 'HANDBOOK', 'MANUAL', 'HOW TO', 'INTRODUCTION TO'],
}

# Format detection from archiveId
FORMAT_PATTERNS = {
    'PDF': ['-pdf', 'Pdf', 'PDF'],
    'DOC': ['-doc', 'Doc', 'DOC', '.doc'],
    'PPT': ['-ppt', 'Ppt', 'PPT', 'Powerpoint', 'Presentation'],
    'EPUB': ['-epub', 'Epub', 'EPUB'],
}

# Category-based description templates
CATEGORY_DESCRIPTIONS = {
    'Stories & Literature': 'A literary work exploring themes of {topic}.',
    'History & Biography': 'A historical account about {topic}.',
    'Science & Experiments': 'An exploration of scientific concepts related to {topic}.',
    'Toys & Crafts': 'A hands-on guide to making and creating {topic}.',
    'Animals & Birds': 'A study of wildlife and nature focusing on {topic}.',
    'Education & Teaching': 'An educational resource about {topic}.',
    'Nature & Environment': 'A work about the natural world and {topic}.',
    'Philosophy & Society': 'A thoughtful examination of {topic} and society.',
    'Space & Astronomy': 'An astronomical exploration of {topic}.',
    'Health & Nutrition': 'A guide to health and wellness covering {topic}.',
    'Mathematics & Puzzles': 'A mathematical exploration of {topic}.',
    'Art & Drawing': 'A creative guide to {topic} and artistic expression.',
    'Water & Energy': 'An examination of energy and resources related to {topic}.',
    'Language & Literacy': 'A language and literacy resource about {topic}.',
    'Poetry & Songs': 'A collection of poetic works about {topic}.',
    'Music & Performance': 'A musical exploration of {topic} and performance.',
}


def is_weak_description(desc: str) -> bool:
    if not desc or not desc.strip():
        return True
    weak_patterns = [
        'PDF available',
        'pdf available',
        'Available on Internet Archive',
        'available on internet archive',
    ]
    for p in weak_patterns:
        if p.lower() in desc.lower():
            return True
    # Very short descriptions that are just dates or publication names
    if len(desc.strip()) < 10:
        return True
    return False


def detect_format(book: dict) -> str:
    aid = book.get('archiveId', '')
    url = book.get('archiveUrl', '')
    combined = aid + ' ' + url
    for fmt, patterns in FORMAT_PATTERNS.items():
        for p in patterns:
            if p.lower() in combined.lower():
                return fmt
    return 'PDF'  # Default assumption for archive.org


def detect_subcategory(book: dict) -> str:
    title = book.get('title', '').upper()
    author = book.get('author', '').upper()
    desc = book.get('description', '').upper()
    combined = f"{title} {author} {desc}"

    for keyword, subcat in SUBCATEGORY_KEYWORDS.items():
        if keyword.upper() in combined:
            return subcat

    # Detect book type as subcategory
    for book_type, keywords in BOOK_TYPE_KEYWORDS.items():
        for kw in keywords:
            if kw in title:
                return book_type.capitalize()

    return ''


def clean_title_author(book: dict) -> tuple:
    """Split title and author if title contains 'TITLE - AUTHOR' pattern."""
    title = book.get('title', '')
    author = book.get('author', '')

    # Check for patterns like "TITLE - AUTHOR" in the title
    separators = [' - ', ' -- ', ' — ', ' BY ']
    for sep in separators:
        if sep in title:
            parts = title.split(sep, 1)
            if len(parts) == 2:
                potential_title = parts[0].strip()
                potential_author = parts[1].strip()
                # Only split if the second part looks like an author name
                if len(potential_author) > 2 and len(potential_author) < 60:
                    if not author or author == potential_author:
                        return potential_title, potential_author

    return title, author


def generate_description(book: dict) -> str:
    """Generate a short description from title, author, and category."""
    title = book.get('title', '')
    author = book.get('author', '')
    category = book.get('category', '')
    language = book.get('language', 'English')

    # Extract meaningful words from title for topic
    stop_words = {'THE', 'A', 'AN', 'OF', 'IN', 'ON', 'AND', 'FOR', 'TO', 'BY', 'WITH', 'FROM', 'IS', 'IT', 'AT', 'AS'}
    words = [w for w in title.split() if w.upper() not in stop_words and len(w) > 2]
    topic = ' '.join(words[:4]).lower() if words else 'various topics'

    # Build description
    template = CATEGORY_DESCRIPTIONS.get(category, 'A book about {topic}.')
    desc = template.format(topic=topic)

    # Add author info
    if author and author.strip():
        desc += f' By {author.strip().title()}.'

    # Add language note if not English
    if language and language != 'English':
        desc += f' Written in {language}.'

    return desc


def enrich_books():
    with open(BOOKS_PATH, 'r', encoding='utf-8') as f:
        books = json.load(f)

    print(f"Processing {len(books)} books...")

    enriched_count = 0
    for book in books:
        # Add thumbnail URL
        archive_id = book.get('archiveId', '')
        if archive_id:
            book['thumbnailUrl'] = f"https://archive.org/services/img/{archive_id}"
        else:
            book['thumbnailUrl'] = ''

        # Detect format
        book['format'] = detect_format(book)

        # Detect subcategory
        subcat = detect_subcategory(book)
        if subcat:
            book['subcategory'] = subcat
        elif 'subcategory' not in book:
            book['subcategory'] = ''

        # Clean title/author
        clean_title, clean_author = clean_title_author(book)
        if clean_title != book.get('title'):
            book['title'] = clean_title
        if clean_author and clean_author != book.get('author'):
            book['author'] = clean_author

        # Generate description if missing/weak
        if is_weak_description(book.get('description', '')):
            book['description'] = generate_description(book)
            enriched_count += 1

    print(f"Enriched {enriched_count} books with generated descriptions.")
    print(f"All {len(books)} books now have thumbnailUrl, format, and subcategory fields.")

    with open(BOOKS_PATH, 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False)

    print("Saved to books.json")


if __name__ == '__main__':
    enrich_books()
