'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookOpen, ExternalLink, Archive, Search, X, ChevronDown, SlidersHorizontal, ArrowUpDown, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Logo from '@/components/Logo';

interface Book {
  id: string;
  title: string;
  author: string;
  archiveUrl: string;
  archiveId: string;
  subjects: string[];
  year: number;
  description: string;
  category: string;
  language: string;
  format?: string;
  subcategory?: string;
  thumbnailUrl?: string;
}

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  'Stories & Literature': { emoji: '\uD83D\uDCD6', color: '#8b5cf6', label: 'Stories' },
  'History & Biography': { emoji: '\uD83C\uDFDB\uFE0F', color: '#b45309', label: 'History' },
  'Science & Experiments': { emoji: '\uD83D\uDD2C', color: '#0ea5e9', label: 'Science' },
  'Toys & Crafts': { emoji: '\uD83C\uDFA8', color: '#f97316', label: 'Crafts' },
  'Animals & Birds': { emoji: '\uD83E\uDD81', color: '#22c55e', label: 'Animals' },
  'Education & Teaching': { emoji: '\uD83C\uDF93', color: '#6366f1', label: 'Education' },
  'Nature & Environment': { emoji: '\uD83C\uDF3F', color: '#15803d', label: 'Nature' },
  'Philosophy & Society': { emoji: '\uD83D\uDCAD', color: '#78716c', label: 'Philosophy' },
  'Space & Astronomy': { emoji: '\uD83D\uDE80', color: '#1e40af', label: 'Space' },
  'Health & Nutrition': { emoji: '\uD83E\uDE7A', color: '#ef4444', label: 'Health' },
  'Mathematics & Puzzles': { emoji: '\uD83E\uDDEE', color: '#14b8a6', label: 'Maths' },
  'Art & Drawing': { emoji: '\uD83C\uDFAD', color: '#ec4899', label: 'Art' },
  'Water & Energy': { emoji: '\u26A1', color: '#eab308', label: 'Energy' },
  'Language & Literacy': { emoji: '\uD83D\uDCDD', color: '#f59e0b', label: 'Language' },
  'Poetry & Songs': { emoji: '\uD83C\uDFB5', color: '#a855f7', label: 'Poetry' },
  'Music & Performance': { emoji: '\uD83C\uDFB6', color: '#06b6d4', label: 'Music' },
};

const LANGUAGES = [
  'English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu',
  'Kannada', 'Bengali', 'Punjabi', 'Malayalam', 'Russian', 'Odia', 'Urdu', 'Sindhi', 'Assamese',
];

const SORT_OPTIONS = [
  { value: 'az', label: 'A \u2192 Z' },
  { value: 'za', label: 'Z \u2192 A' },
  { value: 'category', label: 'Category' },
  { value: 'language', label: 'Language' },
];

const ITEMS_PER_PAGE = 48;

function BookCard({ book }: { book: Book }) {
  const [imgError, setImgError] = useState(false);
  const config = CATEGORY_CONFIG[book.category] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: book.category };
  const thumbUrl = book.thumbnailUrl || (book.archiveId ? `https://archive.org/services/img/${book.archiveId}` : '');

  return (
    <a
      href={book.archiveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="book-card"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.transform = 'translateY(-4px)';
          el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
          el.style.borderColor = config.color;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
          el.style.borderColor = 'var(--border)';
        }}
      >
        {/* Cover */}
        <div style={{
          height: '180px',
          background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={book.title}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{config.emoji}</div>
              <div style={{
                fontSize: '12px', fontWeight: 700, color: config.color,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {book.category}
              </div>
            </div>
          )}
          {/* Language badge */}
          {book.language && book.language !== 'English' && (
            <span style={{
              position: 'absolute', top: '10px', right: '10px',
              padding: '3px 10px', borderRadius: '100px',
              fontSize: '11px', fontWeight: 700,
              background: 'rgba(0,0,0,0.6)', color: 'white',
              backdropFilter: 'blur(4px)',
            }}>
              {book.language}
            </span>
          )}
          {/* Format badge */}
          {book.format && book.format !== 'PDF' && (
            <span style={{
              position: 'absolute', top: '10px', left: '10px',
              padding: '3px 8px', borderRadius: '100px',
              fontSize: '10px', fontWeight: 700,
              background: 'rgba(0,0,0,0.6)', color: 'white',
              backdropFilter: 'blur(4px)',
            }}>
              {book.format}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            alignSelf: 'flex-start',
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '11px', fontWeight: 600,
            background: `${config.color}12`, color: config.color,
            marginBottom: '10px',
          }}>
            {config.emoji} {config.label}
          </span>

          <h3 style={{
            fontSize: '15px', fontWeight: 700, color: 'var(--text)',
            marginBottom: '4px', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {book.title}
          </h3>

          <p style={{
            fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', flex: 1,
          }}>
            {book.author}
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '12px', borderTop: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Archive size={12} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Internet Archive</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: config.color, fontSize: '12px', fontWeight: 700,
            }}>
              Read free <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function BooksPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
    const cat = searchParams.get('category');
    return cat ? new Set(cat.split(',')) : new Set<string>();
  });
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(() => {
    const lang = searchParams.get('language');
    return lang ? new Set(lang.split(',')) : new Set<string>();
  });
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'az');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL with filters
  const updateURL = useCallback((params: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL({
        q: search,
        category: Array.from(selectedCategories).join(','),
        language: Array.from(selectedLanguages).join(','),
        sort: sortBy !== 'az' ? sortBy : '',
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, selectedCategories, selectedLanguages, sortBy, updateURL]);

  // Load from URL on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetch('/books.json')
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Computed counts
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of books) counts[b.category] = (counts[b.category] || 0) + 1;
    return counts;
  }, [books]);

  const langCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of books) {
      const lang = b.language || 'English';
      counts[lang] = (counts[lang] || 0) + 1;
    }
    return counts;
  }, [books]);

  const formatCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of books) {
      const fmt = b.format || 'PDF';
      counts[fmt] = (counts[fmt] || 0) + 1;
    }
    return counts;
  }, [books]);

  const filtered = useMemo(() => {
    let result = books;

    if (selectedCategories.size > 0) {
      result = result.filter(b => selectedCategories.has(b.category));
    }
    if (selectedLanguages.size > 0) {
      result = result.filter(b => selectedLanguages.has(b.language || 'English'));
    }
    if (selectedFormats.size > 0) {
      result = result.filter(b => selectedFormats.has(b.format || 'PDF'));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result];
    switch (sortBy) {
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
        break;
      case 'language':
        result.sort((a, b) => (a.language || 'English').localeCompare(b.language || 'English') || a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [books, selectedCategories, selectedLanguages, selectedFormats, search, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [selectedCategories, selectedLanguages, selectedFormats, search, sortBy]);

  const hasActiveFilters = selectedCategories.size > 0 || selectedLanguages.size > 0 || selectedFormats.size > 0 || search.trim() !== '';

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories(new Set());
    setSelectedLanguages(new Set());
    setSelectedFormats(new Set());
    setSortBy('az');
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang); else next.add(lang);
      return next;
    });
  };

  const toggleFormat = (fmt: string) => {
    setSelectedFormats(prev => {
      const next = new Set(prev);
      if (next.has(fmt)) next.delete(fmt); else next.add(fmt);
      return next;
    });
  };

  // Unique categories and languages sorted by count
  const sortedCategories = useMemo(() =>
    Object.entries(catCounts).sort((a, b) => b[1] - a[1]),
    [catCounts]
  );

  const sortedLanguages = useMemo(() =>
    Object.entries(langCounts).sort((a, b) => b[1] - a[1]),
    [langCounts]
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <Logo size={64} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 600 }}>
            Loading 8,197 books...
          </p>
        </div>
      </div>
    );
  }

  const FilterSidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Categories */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Categories
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '320px', overflowY: 'auto' }}>
          {sortedCategories.map(([cat, count]) => {
            const config = CATEGORY_CONFIG[cat];
            if (!config) return null;
            const isActive = selectedCategories.has(cat);
            return (
              <label key={cat} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
                background: isActive ? `${config.color}08` : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleCategory(cat)}
                  style={{ accentColor: config.color, width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', color: isActive ? config.color : 'var(--text)', fontWeight: isActive ? 600 : 400, flex: 1 }}>
                  {config.emoji} {config.label}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {count.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Languages
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '240px', overflowY: 'auto' }}>
          {sortedLanguages.map(([lang, count]) => {
            const isActive = selectedLanguages.has(lang);
            return (
              <label key={lang} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
                background: isActive ? 'rgba(200,83,26,0.06)' : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleLanguage(lang)}
                  style={{ accentColor: '#c8531a', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', color: isActive ? 'var(--accent)' : 'var(--text)', fontWeight: isActive ? 600 : 400, flex: 1 }}>
                  {lang}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {count.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Format */}
      {Object.keys(formatCounts).length > 1 && (
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Format
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(formatCounts).sort((a, b) => b[1] - a[1]).map(([fmt, count]) => {
              const isActive = selectedFormats.has(fmt);
              return (
                <label key={fmt} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
                  background: isActive ? 'rgba(200,83,26,0.06)' : 'transparent',
                }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleFormat(fmt)}
                    style={{ accentColor: '#c8531a', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', color: isActive ? 'var(--accent)' : 'var(--text)', fontWeight: isActive ? 600 : 400, flex: 1 }}>
                    {fmt}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {count.toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          style={{
            padding: '10px', borderRadius: '10px',
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Header />

      {/* Spacer for fixed header */}
      <div style={{ height: '64px' }} />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Hero */}
        <div style={{
          padding: '48px 0 32px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
            color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '12px',
            lineHeight: 1.1,
          }}>
            Free Book Library
          </h1>
          <p style={{
            fontSize: '17px', color: 'var(--text-muted)', maxWidth: '600px',
            margin: '0 auto 24px', lineHeight: 1.6,
          }}>
            {books.length.toLocaleString()} books preserved on Internet Archive. Free to read, share, and download.
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: '32px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                {books.length.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Books
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                {Object.keys(catCounts).length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Categories
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                {Object.keys(langCounts).length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Languages
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
            <Search size={20} style={{
              position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, author, or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '16px 50px 16px 50px', borderRadius: '14px',
                border: '2px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text)', fontSize: '16px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#c8531a';
                e.target.style.boxShadow = '0 0 0 3px rgba(200,83,26,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: '6px', borderRadius: '6px',
                display: 'flex', alignItems: 'center',
              }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: sort + filter toggle */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
              style={{
                padding: '8px 16px', borderRadius: '10px',
                border: '1px solid var(--border)', background: showFilters ? 'rgba(200,83,26,0.06)' : 'var(--bg-card)',
                color: showFilters ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && (
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'var(--accent)', color: 'white',
                  fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedCategories.size + selectedLanguages.size + selectedFormats.size}
                </span>
              )}
            </button>

            {/* Active filter pills */}
            {Array.from(selectedCategories).map(cat => {
              const config = CATEGORY_CONFIG[cat];
              return config ? (
                <span key={cat} style={{
                  padding: '4px 10px', borderRadius: '100px',
                  background: `${config.color}12`, color: config.color,
                  fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  cursor: 'pointer',
                }} onClick={() => toggleCategory(cat)}>
                  {config.emoji} {config.label}
                  <X size={12} />
                </span>
              ) : null;
            })}
            {Array.from(selectedLanguages).map(lang => (
              <span key={lang} style={{
                padding: '4px 10px', borderRadius: '100px',
                background: 'rgba(200,83,26,0.08)', color: 'var(--accent)',
                fontSize: '12px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px',
                cursor: 'pointer',
              }} onClick={() => toggleLanguage(lang)}>
                {lang}
                <X size={12} />
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {filtered.length === books.length
                ? `${books.length.toLocaleString()} books`
                : `${filtered.length.toLocaleString()} of ${books.length.toLocaleString()}`}
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text)', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main content with sidebar */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

          {/* Sidebar - desktop */}
          <aside className="filter-sidebar" style={{
            width: '240px', flexShrink: 0,
            position: 'sticky', top: '88px',
            background: 'var(--bg-card)',
            borderRadius: '16px', border: '1px solid var(--border)',
            padding: '20px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}>
            <FilterSidebar />
          </aside>

          {/* Mobile filter sheet */}
          {showFilters && (
            <div className="filter-mobile-overlay" style={{
              position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(0,0,0,0.4)',
            }} onClick={() => setShowFilters(false)}>
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'fixed', bottom: 0, left: 0, right: 0,
                  background: 'var(--bg-card)',
                  borderRadius: '20px 20px 0 0',
                  padding: '24px',
                  maxHeight: '75vh',
                  overflowY: 'auto',
                  zIndex: 151,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Filters</h2>
                  <button onClick={() => setShowFilters(false)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px',
                  }}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Books grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  <Search size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                  No books found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>
                  Try a different search term or adjust your filters
                </p>
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '10px 20px', borderRadius: '10px', border: 'none',
                    background: 'var(--accent)', color: 'white', fontSize: '14px',
                    fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className="books-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                {visible.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <button
                  onClick={() => setVisibleCount(v => v + ITEMS_PER_PAGE)}
                  style={{
                    padding: '14px 40px', borderRadius: '12px',
                    background: 'var(--accent)', color: 'white',
                    border: 'none', fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <ChevronDown size={18} />
                  Load more ({Math.min(ITEMS_PER_PAGE, filtered.length - visibleCount).toLocaleString()} more)
                </button>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Showing {visibleCount.toLocaleString()} of {filtered.length.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '40px 24px',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={28} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Arvind Gupta Toys</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Inspired by{' '}
            <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              arvindguptatoys.com
            </a>{' '}
            &middot; Preserved on Internet Archive &middot; Free forever
          </p>
        </div>
      </footer>

      <style>{`
        .filter-sidebar {
          display: block;
        }
        .filter-mobile-overlay {
          display: none;
        }
        @media (max-width: 900px) {
          .filter-sidebar {
            display: none !important;
          }
          .filter-mobile-overlay {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          .books-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Logo size={64} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 600, marginTop: '16px' }}>
            Loading books...
          </p>
        </div>
      </div>
    }>
      <BooksPageInner />
    </Suspense>
  );
}
