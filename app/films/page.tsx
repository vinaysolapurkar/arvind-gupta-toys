'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ChevronRight, SlidersHorizontal, ArrowUpDown, SearchX, Play, Film, Globe, Clock, Tag } from 'lucide-react';
import Header from '@/components/Header';

interface FilmData {
  youtubeId: string;
  title: string;
  duration: string;
  language: string;
  category: string;
}

const CATEGORY_CONFIG: Record<string, { color: string; label: string }> = {
  'paper-models': { color: '#ec4899', label: 'Paper Models' },
  'spinning-toys': { color: '#f97316', label: 'Spinning Toys' },
  'water-experiments': { color: '#0ea5e9', label: 'Water Experiments' },
  'electricity': { color: '#eab308', label: 'Electricity' },
  'air-experiments': { color: '#06b6d4', label: 'Air Experiments' },
  'magnetism': { color: '#8b5cf6', label: 'Magnetism' },
  'flying-toys': { color: '#14b8a6', label: 'Flying Toys' },
  'maths': { color: '#22c55e', label: 'Maths' },
  'chemistry': { color: '#ef4444', label: 'Chemistry' },
  'sound': { color: '#a855f7', label: 'Sound' },
  'light--optics': { color: '#f59e0b', label: 'Light & Optics' },
  'biology': { color: '#15803d', label: 'Biology' },
  'inspiring': { color: '#c8531a', label: 'Inspiring' },
  'mechanics': { color: '#64748b', label: 'Mechanics' },
  'structures': { color: '#78716c', label: 'Structures' },
  'miscellaneous': { color: '#94a3b8', label: 'Miscellaneous' },
};

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
        paddingTop: '56.25%', background: 'var(--bg-elevated)',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }} />
      <div style={{ padding: '16px' }}>
        <div style={{
          width: '50%', height: '12px', borderRadius: '4px',
          background: 'var(--bg-elevated)', marginBottom: '10px',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: '90%', height: '15px', borderRadius: '4px',
          background: 'var(--bg-elevated)', marginBottom: '6px',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
        <div style={{
          width: '60%', height: '12px', borderRadius: '4px',
          background: 'var(--bg-elevated)',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
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

function VideoModal({ film, onClose }: { film: FilmData; onClose: () => void }) {
  const config = CATEGORY_CONFIG[film.category] || { color: '#94a3b8', label: film.category };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', borderRadius: '20px',
          border: '1px solid var(--border)', maxWidth: '800px', width: '100%',
          overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          animation: 'modalIn 0.25s ease',
        }}
      >
        {/* Embedded player */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          <iframe
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={film.title}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              zIndex: 2,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Details */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '100px',
              fontSize: '12px', fontWeight: 600,
              background: `${config.color}15`, color: config.color,
            }}>
              {config.label}
            </span>
            <span style={{
              padding: '4px 10px', borderRadius: '100px',
              fontSize: '12px', fontWeight: 600,
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
            }}>
              {film.duration}
            </span>
            <span style={{
              padding: '4px 10px', borderRadius: '100px',
              fontSize: '12px', fontWeight: 600,
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
            }}>
              {film.language}
            </span>
          </div>
          <h2 style={{
            fontSize: '20px', fontWeight: 800, color: 'var(--text)',
            lineHeight: 1.3, marginBottom: '12px',
          }}>
            {film.title}
          </h2>
          <a
            href={`https://www.youtube.com/watch?v=${film.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: 'var(--accent)', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Watch on YouTube
            <Play size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function FilmsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [films, setFilms] = useState<FilmData[]>([]);
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
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'az');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const [modalFilm, setModalFilm] = useState<FilmData | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync URL with filters
  const updateURL = useCallback((params: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
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

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  // Load films data
  useEffect(() => {
    fetch('/films.json')
      .then(r => r.json())
      .then((data: FilmData[]) => { setFilms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount(v => v + ITEMS_PER_PAGE);
      },
      { rootMargin: '400px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, visibleCount]);

  // Computed counts
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of films) counts[f.category] = (counts[f.category] || 0) + 1;
    return counts;
  }, [films]);

  const langCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of films) counts[f.language] = (counts[f.language] || 0) + 1;
    return counts;
  }, [films]);

  const filtered = useMemo(() => {
    let result = films;

    if (selectedCategories.size > 0) {
      result = result.filter(f => selectedCategories.has(f.category));
    }
    if (selectedLanguages.size > 0) {
      result = result.filter(f => selectedLanguages.has(f.language));
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(f => f.title.toLowerCase().includes(q));
    }

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
        result.sort((a, b) => a.language.localeCompare(b.language) || a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [films, selectedCategories, selectedLanguages, debouncedSearch, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [selectedCategories, selectedLanguages, debouncedSearch, sortBy]);

  const activeFilterCount = selectedCategories.size + selectedLanguages.size;
  const hasActiveFilters = activeFilterCount > 0 || search.trim() !== '';

  const clearAllFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategories(new Set());
    setSelectedLanguages(new Set());
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

  const sortedCategories = useMemo(() =>
    Object.entries(catCounts).sort((a, b) => b[1] - a[1]),
    [catCounts]
  );

  const sortedLanguages = useMemo(() =>
    Object.entries(langCounts).sort((a, b) => b[1] - a[1]),
    [langCounts]
  );

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <Header />
        <div style={{ height: '64px' }} />
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ padding: '48px 0 32px', textAlign: 'center' }}>
            <div style={{
              width: '400px', height: '40px', borderRadius: '8px',
              background: 'var(--bg-elevated)', margin: '0 auto 16px',
              animation: 'shimmer 1.5s ease-in-out infinite', maxWidth: '100%',
            }} />
            <div style={{
              width: '500px', height: '20px', borderRadius: '6px',
              background: 'var(--bg-elevated)', margin: '0 auto 32px',
              animation: 'shimmer 1.5s ease-in-out infinite', maxWidth: '100%',
            }} />
            <div style={{
              width: '100%', maxWidth: '640px', height: '54px', borderRadius: '14px',
              background: 'var(--bg-elevated)', margin: '0 auto',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }} />
          </div>
          <div
            className="films-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
            .films-grid { margin-left: 0 !important; }
          }
        `}</style>
      </div>
    );
  }

  const FilterSidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Categories */}
      <CollapsibleSection title="Categories" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '360px', overflowY: 'auto' }}>
          {sortedCategories.map(([cat, count]) => {
            const config = CATEGORY_CONFIG[cat] || { color: '#94a3b8', label: cat };
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
                  {config.label}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '280px', overflowY: 'auto' }}>
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
      <div style={{ height: '64px' }} />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Hero */}
        <div style={{ padding: '48px 0 32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
            color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '12px',
            lineHeight: 1.1,
          }}>
            {films.length.toLocaleString()} Educational Films -- Free on YouTube
          </h1>
          <p style={{
            fontSize: '17px', color: 'var(--text-muted)', maxWidth: '600px',
            margin: '0 auto 24px', lineHeight: 1.6,
          }}>
            Science experiments, paper models, and DIY toys. Watch, learn, and make.
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: '32px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                {films.length.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Videos
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
              placeholder="Search by video title..."
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

        {/* Toolbar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
              const config = CATEGORY_CONFIG[cat] || { color: '#94a3b8', label: cat };
              return (
                <span key={cat} style={{
                  padding: '4px 10px', borderRadius: '100px',
                  background: `${config.color}12`, color: config.color,
                  fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  cursor: 'pointer',
                }} onClick={() => toggleCategory(cat)}>
                  {config.label}
                  <X size={12} />
                </span>
              );
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
              {filtered.length === films.length
                ? `${films.length.toLocaleString()} videos`
                : `${filtered.length.toLocaleString()} of ${films.length.toLocaleString()}`}
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

          {/* Films grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <SearchX size={56} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                  No videos found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>
                  {debouncedSearch.trim()
                    ? `No results for "${debouncedSearch}"`
                    : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '10px 24px', borderRadius: '10px',
                    background: 'var(--accent)', color: 'white',
                    border: 'none', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className="films-card-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                {visible.map((film) => {
                  const config = CATEGORY_CONFIG[film.category] || { color: '#94a3b8', label: film.category };
                  return (
                    <div
                      key={film.youtubeId}
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: '14px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                        willChange: 'transform',
                      }}
                      onClick={() => setModalFilm(film)}
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
                      {/* Thumbnail */}
                      <div style={{
                        position: 'relative', paddingTop: '56.25%',
                        background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                        overflow: 'hidden',
                      }}>
                        <img
                          src={`https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg`}
                          alt={film.title}
                          loading="lazy"
                          style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%', objectFit: 'cover',
                          }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        {/* Play overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.2)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}
                        className="play-overlay"
                        >
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'rgba(200,83,26,0.95)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                          }}>
                            <Play size={22} style={{ color: 'white', marginLeft: '2px' }} fill="white" />
                          </div>
                        </div>
                        {/* Duration badge */}
                        <div style={{
                          position: 'absolute', bottom: '8px', right: '8px',
                          padding: '2px 8px', borderRadius: '4px',
                          background: 'rgba(0,0,0,0.8)', color: 'white',
                          fontSize: '11px', fontWeight: 600,
                        }}>
                          {film.duration}
                        </div>
                        {/* Language badge */}
                        {film.language !== 'English' && (
                          <span style={{
                            position: 'absolute', top: '8px', right: '8px',
                            padding: '2px 8px', borderRadius: '100px',
                            fontSize: '10px', fontWeight: 700,
                            background: 'rgba(0,0,0,0.6)', color: 'white',
                            backdropFilter: 'blur(4px)',
                          }}>
                            {film.language}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px', borderRadius: '100px',
                          fontSize: '11px', fontWeight: 600,
                          background: `${config.color}15`, color: config.color,
                          marginBottom: '8px',
                        }}>
                          {config.label}
                        </span>
                        <h3 style={{
                          fontSize: '14px', fontWeight: 700, color: 'var(--text)',
                          lineHeight: 1.35, margin: 0,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                        }}>
                          {film.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load more sentinel */}
            {visibleCount < filtered.length && (
              <div ref={loadMoreRef} style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', margin: '0 auto',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>
                  Loading more videos...
                </p>
              </div>
            )}

            {visibleCount >= filtered.length && filtered.length > 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                Showing all {filtered.length.toLocaleString()} videos
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Video modal */}
      {modalFilm && <VideoModal film={modalFilm} onClose={() => setModalFilm(null)} />}

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {films.length.toLocaleString()} free educational films by Arvind Gupta
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Inspired by{' '}
            <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              arvindguptatoys.com
            </a>
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
        @keyframes modalIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .filter-sidebar {
          display: block;
        }
        .filter-toggle-btn {
          display: none !important;
        }
        .filter-mobile-overlay {
          display: none;
        }
        @media (max-width: 900px) {
          .filter-sidebar {
            display: none !important;
          }
          .filter-toggle-btn {
            display: flex !important;
          }
          .filter-mobile-overlay {
            display: block !important;
          }
          .films-card-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .films-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
        /* Play overlay on hover */
        div:hover > .play-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default function FilmsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <Header />
        <div style={{ height: '64px' }} />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <div style={{
            width: '32px', height: '32px', margin: '0 auto',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <FilmsPageInner />
    </Suspense>
  );
}
