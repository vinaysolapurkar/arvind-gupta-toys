'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookOpen, ExternalLink, Archive, Search, X, ChevronDown, ChevronRight, SlidersHorizontal, ArrowUpDown, Filter, SearchX, Shuffle, Bookmark, Heart } from 'lucide-react';
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

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '14px',
      border: '1px solid var(--border)', overflow: 'hidden',
    }}>
      <div style={{
        height: '180px', background: 'var(--bg-elevated)',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }} />
      <div style={{ padding: '16px' }}>
        <div style={{
          width: '60%', height: '12px', borderRadius: '4px',
          background: 'var(--bg-elevated)', marginBottom: '12px',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: '90%', height: '15px', borderRadius: '4px',
          background: 'var(--bg-elevated)', marginBottom: '8px',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: '70%', height: '15px', borderRadius: '4px',
          background: 'var(--bg-elevated)', marginBottom: '12px',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: '50%', height: '12px', borderRadius: '4px',
          background: 'var(--bg-elevated)', marginBottom: '16px',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: '12px',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div style={{
            width: '40%', height: '11px', borderRadius: '4px',
            background: 'var(--bg-elevated)',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }} />
          <div style={{
            width: '25%', height: '11px', borderRadius: '4px',
            background: 'var(--bg-elevated)',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </div>
  );
}

function BookCard({ book, isBookmarked, onToggleBookmark }: { book: Book; isBookmarked?: boolean; onToggleBookmark?: (id: string) => void }) {
  const [imgError, setImgError] = useState(false);
  const config = CATEGORY_CONFIG[book.category] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: book.category };
  const thumbUrl = book.thumbnailUrl || (book.archiveId ? `https://archive.org/services/img/${book.archiveId}` : '');

  const handleCardClick = () => {
    // Track recently viewed
    try {
      const stored = localStorage.getItem('agt-recently-viewed');
      const viewed: string[] = stored ? JSON.parse(stored) : [];
      const updated = [book.id, ...viewed.filter(id => id !== book.id)].slice(0, 20);
      localStorage.setItem('agt-recently-viewed', JSON.stringify(updated));
    } catch {}
  };

  return (
    <a
      href={book.archiveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="book-card"
      style={{ textDecoration: 'none', display: 'block' }}
      onClick={handleCardClick}
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
          transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
          willChange: 'transform',
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
          borderRadius: '13px 13px 0 0',
        }}>
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={book.title}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px 13px 0 0' }}
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
          {/* Gradient overlay on thumbnail bottom */}
          {thumbUrl && !imgError && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
              borderRadius: '0 0 0 0',
            }} />
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
          {/* Bookmark button */}
          {onToggleBookmark && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(book.id); }}
              style={{
                position: 'absolute', bottom: '10px', right: '10px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: isBookmarked ? '#c8531a' : 'rgba(0,0,0,0.5)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                transition: 'transform 0.2s, background 0.2s',
                zIndex: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              title={isBookmarked ? 'Remove from reading list' : 'Add to reading list'}
            >
              <Bookmark size={15} style={{ color: 'white' }} fill={isBookmarked ? 'white' : 'none'} />
            </button>
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

function CollapsibleSection({ title, defaultOpen, children }: { title: string; defaultOpen: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
          padding: '0', border: 'none', background: 'none', cursor: 'pointer',
          marginBottom: open ? '12px' : '0',
        }}
      >
        <ChevronRight size={14} style={{
          color: 'var(--text-muted)',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(90deg)' : 'rotate(0)',
        }} />
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h3>
      </button>
      {open && children}
    </div>
  );
}

function BooksPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
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
  const [readingList, setReadingList] = useState<string[]>([]);
  const [showReadingList, setShowReadingList] = useState(false);
  const [surpriseBook, setSurpriseBook] = useState<Book | null>(null);
  const [surpriseAnim, setSurpriseAnim] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load reading list from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agt-reading-list');
      if (saved) setReadingList(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleBookmark = useCallback((bookId: string) => {
    setReadingList(prev => {
      const next = prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId];
      localStorage.setItem('agt-reading-list', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleSurpriseMe = useCallback(() => {
    if (books.length === 0) return;
    setSurpriseAnim(true);
    setTimeout(() => setSurpriseAnim(false), 600);
    const randomIndex = Math.floor(Math.random() * books.length);
    setSurpriseBook(books[randomIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [books]);

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
        q: debouncedSearch,
        category: Array.from(selectedCategories).join(','),
        language: Array.from(selectedLanguages).join(','),
        sort: sortBy !== 'az' ? sortBy : '',
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [debouncedSearch, selectedCategories, selectedLanguages, sortBy, updateURL]);

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

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(v => v + ITEMS_PER_PAGE);
        }
      },
      { rootMargin: '400px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, visibleCount]);

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

    if (showReadingList) {
      result = result.filter(b => readingList.includes(b.id));
    }
    if (selectedCategories.size > 0) {
      result = result.filter(b => selectedCategories.has(b.category));
    }
    if (selectedLanguages.size > 0) {
      result = result.filter(b => selectedLanguages.has(b.language || 'English'));
    }
    if (selectedFormats.size > 0) {
      result = result.filter(b => selectedFormats.has(b.format || 'PDF'));
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
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
  }, [books, selectedCategories, selectedLanguages, selectedFormats, debouncedSearch, sortBy, showReadingList, readingList]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [selectedCategories, selectedLanguages, selectedFormats, debouncedSearch, sortBy, showReadingList]);

  const activeFilterCount = selectedCategories.size + selectedLanguages.size + selectedFormats.size + (showReadingList ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0 || search.trim() !== '';

  const clearAllFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategories(new Set());
    setSelectedLanguages(new Set());
    setSelectedFormats(new Set());
    setSortBy('az');
    setShowReadingList(false);
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

  // Skeleton loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <Header />
        <div style={{ height: '64px' }} />
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ padding: '48px 0 32px', textAlign: 'center' }}>
            <div style={{
              width: '280px', height: '40px', borderRadius: '8px',
              background: 'var(--bg-elevated)', margin: '0 auto 16px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }} />
            <div style={{
              width: '400px', height: '20px', borderRadius: '6px',
              background: 'var(--bg-elevated)', margin: '0 auto 32px',
              animation: 'shimmer 1.5s ease-in-out infinite',
              maxWidth: '100%',
            }} />
            <div style={{
              width: '100%', maxWidth: '640px', height: '54px', borderRadius: '14px',
              background: 'var(--bg-elevated)', margin: '0 auto',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }} />
          </div>
          <div
            className="books-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '16px',
              marginLeft: '272px',
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
        <style>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @media (max-width: 900px) {
            .books-grid { margin-left: 0 !important; }
          }
        `}</style>
      </div>
    );
  }

  const FilterSidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Reading List */}
      <button
        onClick={() => setShowReadingList(!showReadingList)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 12px', borderRadius: '10px', width: '100%',
          border: showReadingList ? '2px solid #c8531a' : '1px solid var(--border)',
          background: showReadingList ? 'rgba(200,83,26,0.08)' : 'var(--bg-elevated)',
          color: showReadingList ? '#c8531a' : 'var(--text)',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <Bookmark size={15} fill={showReadingList ? '#c8531a' : 'none'} />
        <span style={{ flex: 1, textAlign: 'left' }}>My Reading List ({readingList.length})</span>
      </button>

      {/* Categories */}
      <CollapsibleSection title="Categories" defaultOpen={true}>
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
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? `${config.color}08` : 'transparent'; }}
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
      </CollapsibleSection>

      {/* Languages */}
      <CollapsibleSection title="Languages" defaultOpen={true}>
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
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? 'rgba(200,83,26,0.06)' : 'transparent'; }}
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
      </CollapsibleSection>

      {/* Format */}
      {Object.keys(formatCounts).length > 1 && (
        <CollapsibleSection title="Format" defaultOpen={false}>
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
        </CollapsibleSection>
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
              {activeFilterCount > 0 && (
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'var(--accent)', color: 'white',
                  fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activeFilterCount}
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
                <div style={{ marginBottom: '16px' }}>
                  <SearchX size={56} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                  No books found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '4px' }}>
                  {debouncedSearch.trim()
                    ? `No books found for "${debouncedSearch}". Try a different search.`
                    : 'No books match your current filters.'}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Try adjusting your filters or broadening your search
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
                  <BookCard key={book.id} book={book} isBookmarked={readingList.includes(book.id)} onToggleBookmark={toggleBookmark} />
                ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {visibleCount < filtered.length && (
              <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Showing {Math.min(visibleCount, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()} books
                </p>
                <div style={{
                  width: '32px', height: '32px', margin: '12px auto',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Surprise Me FAB */}
      <button
        onClick={handleSurpriseMe}
        className="surprise-fab"
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 100,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #c8531a, #e8763f)',
          border: 'none', cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(200,83,26,0.4)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          animation: surpriseAnim ? 'surpriseBounce 0.6s ease' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,83,26,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,83,26,0.4)';
        }}
        title="Surprise Me — Random Book"
      >
        <Shuffle size={24} />
      </button>

      {/* Surprise Me Modal */}
      {surpriseBook && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setSurpriseBook(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', borderRadius: '20px',
              border: '1px solid var(--border)', maxWidth: '480px', width: '100%',
              overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
              animation: 'surpriseModalIn 0.3s ease',
            }}
          >
            {(() => {
              const sConfig = CATEGORY_CONFIG[surpriseBook.category] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: surpriseBook.category };
              const sThumb = surpriseBook.thumbnailUrl || (surpriseBook.archiveId ? `https://archive.org/services/img/${surpriseBook.archiveId}` : '');
              return (
                <>
                  <div style={{
                    height: '220px', position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${sConfig.color}20, ${sConfig.color}08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {sThumb ? (
                      <img src={sThumb} alt={surpriseBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '64px' }}>{sConfig.emoji}</div>
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
                    }} />
                    <button
                      onClick={() => setSurpriseBook(null)}
                      style={{
                        position: 'absolute', top: '12px', right: '12px',
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '100px',
                      fontSize: '12px', fontWeight: 600,
                      background: `${sConfig.color}12`, color: sConfig.color,
                    }}>
                      {sConfig.emoji} {sConfig.label}
                    </span>
                    <h3 style={{
                      fontSize: '20px', fontWeight: 800, color: 'var(--text)',
                      marginTop: '12px', marginBottom: '6px', lineHeight: 1.3,
                    }}>
                      {surpriseBook.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      by {surpriseBook.author}
                    </p>
                    {surpriseBook.description && (
                      <p style={{
                        fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5,
                        marginBottom: '16px',
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                      }}>
                        {surpriseBook.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a
                        href={surpriseBook.archiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1, padding: '12px 20px', borderRadius: '12px',
                          background: '#c8531a', color: 'white', textDecoration: 'none',
                          fontSize: '14px', fontWeight: 700, textAlign: 'center',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                      >
                        Read on Archive.org <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={handleSurpriseMe}
                        style={{
                          padding: '12px 20px', borderRadius: '12px',
                          border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                          color: 'var(--text)', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                      >
                        <Shuffle size={14} /> Another
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

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
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
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
          .surprise-fab {
            bottom: 20px !important;
            right: 20px !important;
            width: 48px !important;
            height: 48px !important;
          }
        }
        @keyframes surpriseBounce {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(15deg); }
          50% { transform: scale(0.9) rotate(-10deg); }
          75% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes surpriseModalIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
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
