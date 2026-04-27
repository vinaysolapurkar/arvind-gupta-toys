'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Archive, Search, X, ChevronDown } from 'lucide-react';

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
}

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📚', color: '#64748b' },
  { id: 'Stories & Literature', label: 'Stories', emoji: '📖', color: '#8b5cf6' },
  { id: 'History & Biography', label: 'History', emoji: '🏛️', color: '#b45309' },
  { id: 'Science & Experiments', label: 'Science', emoji: '🔬', color: '#0ea5e9' },
  { id: 'Toys & Crafts', label: 'Toys & Crafts', emoji: '🎨', color: '#f97316' },
  { id: 'Animals & Birds', label: 'Animals', emoji: '🦁', color: '#22c55e' },
  { id: 'Education & Teaching', label: 'Education', emoji: '🎓', color: '#6366f1' },
  { id: 'Nature & Environment', label: 'Nature', emoji: '🌿', color: '#15803d' },
  { id: 'Philosophy & Society', label: 'Philosophy', emoji: '💭', color: '#78716c' },
  { id: 'Space & Astronomy', label: 'Space', emoji: '🚀', color: '#1e40af' },
  { id: 'Health & Nutrition', label: 'Health', emoji: '🩺', color: '#ef4444' },
  { id: 'Mathematics & Puzzles', label: 'Maths', emoji: '🧮', color: '#14b8a6' },
  { id: 'Art & Drawing', label: 'Art', emoji: '🎭', color: '#ec4899' },
  { id: 'Water & Energy', label: 'Energy', emoji: '⚡', color: '#eab308' },
  { id: 'Language & Literacy', label: 'Language', emoji: '📝', color: '#f59e0b' },
  { id: 'Poetry & Songs', label: 'Poetry', emoji: '🎵', color: '#a855f7' },
  { id: 'Music & Performance', label: 'Music', emoji: '🎶', color: '#06b6d4' },
];

const LANGUAGES = [
  'All', 'English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu',
  'Kannada', 'Bengali', 'Punjabi', 'Malayalam', 'Russian', 'Odia', 'Urdu', 'Sindhi',
];

const ITEMS_PER_PAGE = 48;

function BookCard({ book }: { book: Book }) {
  const [imgError, setImgError] = useState(false);
  const catInfo = CATEGORIES.find(c => c.id === book.category) || CATEGORIES[0];
  const thumbUrl = book.archiveId
    ? `https://archive.org/services/img/${book.archiveId}`
    : '';

  return (
    <a
      href={book.archiveUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
          overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.transform = 'translateY(-4px)';
          el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
          el.style.borderColor = catInfo.color;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
          el.style.borderColor = 'var(--border)';
        }}
      >
        {/* Cover image */}
        <div style={{
          height: '180px', background: `linear-gradient(135deg, ${catInfo.color}15, ${catInfo.color}08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={book.title}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{catInfo.emoji}</div>
              <div style={{
                fontSize: '12px', fontWeight: 700, color: catInfo.color,
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
        </div>

        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category tag */}
          <span style={{
            alignSelf: 'flex-start',
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '11px', fontWeight: 600,
            background: `${catInfo.color}12`, color: catInfo.color,
            marginBottom: '10px',
          }}>
            {catInfo.emoji} {book.category}
          </span>

          {/* Title */}
          <h3 style={{
            fontSize: '15px', fontWeight: 700, color: 'var(--text)',
            marginBottom: '4px', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {book.title}
          </h3>

          {/* Author */}
          <p style={{
            fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', flex: 1,
          }}>
            {book.author}
          </p>

          {/* Footer */}
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
              color: catInfo.color, fontSize: '12px', fontWeight: 700,
            }}>
              Read free <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    fetch('/books.json')
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = books;
    if (category !== 'all') result = result.filter(b => b.category === category);
    if (language !== 'All') result = result.filter(b => (b.language || 'English') === language);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }
    return result;
  }, [books, category, language, search]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [category, language, search]);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: books.length };
    for (const b of books) counts[b.category] = (counts[b.category] || 0) + 1;
    return counts;
  }, [books]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'pulse 2s infinite' }}>📚</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 600 }}>
            Loading 8,000+ books...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)', padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🧪</div>
            <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Arvind Gupta Toys
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { href: '/toys', label: 'Toys' },
              { href: '/films', label: 'Films' },
              { href: '/books', label: 'Books' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                color: link.href === '/books' ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '15px', fontWeight: 600,
                background: link.href === '/books' ? 'rgba(200,83,26,0.08)' : 'transparent',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Hero */}
        <div style={{
          marginBottom: '32px', padding: '40px 32px',
          background: 'linear-gradient(135deg, rgba(200,83,26,0.06) 0%, rgba(200,83,26,0.02) 100%)',
          borderRadius: '20px', border: '1px solid rgba(200,83,26,0.1)',
        }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '8px',
          }}>
            Free Book Library
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6 }}>
            {books.length.toLocaleString()} books across {CATEGORIES.length - 1} categories, preserved forever on Internet Archive. Free to read, share, and download.
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '15px', fontWeight: 700 }}>{books.length.toLocaleString()} Books</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>🌍</span>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>{LANGUAGES.length - 1} Languages</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Archive size={20} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '15px', fontWeight: 700 }}>100% on Archive.org</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={18} style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 20px 14px 44px', borderRadius: '12px',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              color: 'var(--text)', fontSize: '15px', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px',
            }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Language dropdown */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text)', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', outline: 'none',
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l} value={l}>{l === 'All' ? '🌍 All Languages' : l}</option>
            ))}
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isActive = category === cat.id;
            const count = catCounts[cat.id] || 0;
            if (count === 0 && cat.id !== 'all') return null;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '8px 14px', borderRadius: '10px', border: '1.5px solid',
                  borderColor: isActive ? cat.color : 'var(--border)',
                  background: isActive ? `${cat.color}12` : 'var(--bg-card)',
                  color: isActive ? cat.color : 'var(--text-muted)',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.15s',
                }}
              >
                <span>{cat.emoji}</span>
                {cat.label}
                <span style={{
                  fontSize: '11px', padding: '1px 7px', borderRadius: '100px',
                  background: isActive ? `${cat.color}18` : 'var(--bg-elevated)',
                  fontWeight: 700,
                }}>
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results info */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {filtered.length === books.length
              ? `${books.length.toLocaleString()} books`
              : `${filtered.length.toLocaleString()} of ${books.length.toLocaleString()} books`}
          </p>
        </div>

        {/* Books grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              No books found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>
              Try a different search term or category
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); setLanguage('All'); }}
              style={{
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                background: 'var(--accent)', color: 'white', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}>
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
              Load more books ({Math.min(ITEMS_PER_PAGE, filtered.length - visibleCount).toLocaleString()} more)
            </button>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Showing {visibleCount.toLocaleString()} of {filtered.length.toLocaleString()}
            </p>
          </div>
        )}
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
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🧪</div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Arvind Gupta Toys</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Inspired by{' '}
            <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              arvindguptatoys.com
            </a>{' '}
            · Preserved on Internet Archive · Free forever
          </p>
        </div>
      </footer>
    </div>
  );
}
