'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Archive, Search, X } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  archiveUrl: string;
  subjects: string[];
  year: number;
  description: string;
  category: string;
  language: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Books', color: '#64748b' },
  { id: 'Science & Experiments', label: 'Science', color: '#0ea5e9' },
  { id: 'Stories & Literature', label: 'Stories', color: '#8b5cf6' },
  { id: 'Animals & Birds', label: 'Animals & Birds', color: '#22c55e' },
  { id: 'Nature & Environment', label: 'Nature', color: '#15803d' },
  { id: 'History & Biography', label: 'History', color: '#b45309' },
  { id: 'Education & Teaching', label: 'Education', color: '#6366f1' },
  { id: 'Mathematics & Puzzles', label: 'Maths & Puzzles', color: '#14b8a6' },
  { id: 'Toys & Crafts', label: 'Toys & Crafts', color: '#f97316' },
  { id: 'Art & Drawing', label: 'Art', color: '#ec4899' },
  { id: 'Space & Astronomy', label: 'Space', color: '#1e40af' },
  { id: 'Water & Energy', label: 'Energy', color: '#eab308' },
  { id: 'Philosophy & Society', label: 'Philosophy', color: '#78716c' },
  { id: 'Poetry & Songs', label: 'Poetry', color: '#a855f7' },
  { id: 'Health & Nutrition', label: 'Health', color: '#ef4444' },
  { id: 'Music & Performance', label: 'Music', color: '#06b6d4' },
  { id: 'Language & Literacy', label: 'Language', color: '#f59e0b' },
  { id: 'General', label: 'General', color: '#64748b' },
];

const LANGUAGES = [
  'All', 'English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu',
  'Kannada', 'Bengali', 'Punjabi', 'Malayalam', 'Russian', 'Odia', 'Urdu', 'Sindhi',
];

const ITEMS_PER_PAGE = 60;

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
    if (category !== 'all') {
      result = result.filter(b => b.category === category);
    }
    if (language !== 'All') {
      result = result.filter(b => (b.language || 'English') === language);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [books, category, language, search]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [category, language, search]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading 8,000+ books...</p>
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
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🧪</div>
            <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Arvind Gupta Toys</span>
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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            📚 Free Books & Resources
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '560px' }}>
            {books.length.toLocaleString()} books preserved on Internet Archive. Free to read, free to share.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by title, author..."
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

        {/* Language filter */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: '6px 14px', borderRadius: '100px', border: '1px solid',
                borderColor: language === lang ? 'var(--accent)' : 'var(--border)',
                background: language === lang ? 'rgba(200,83,26,0.1)' : 'var(--bg-card)',
                color: language === lang ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isActive = category === cat.id;
            const count = cat.id === 'all' ? books.length : books.filter(b => b.category === cat.id).length;
            if (count === 0 && cat.id !== 'all') return null;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', border: '1px solid',
                  borderColor: isActive ? cat.color : 'var(--border)',
                  background: isActive ? `${cat.color}15` : 'var(--bg-card)',
                  color: isActive ? cat.color : 'var(--text-muted)',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {cat.label}
                <span style={{
                  fontSize: '11px', padding: '1px 6px', borderRadius: '100px',
                  background: isActive ? `${cat.color}20` : 'var(--bg-elevated)',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length.toLocaleString()} books
        </p>

        {/* Books grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No books found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {visible.map((book) => {
              const catInfo = CATEGORIES.find(c => c.id === book.category) || CATEGORIES[0];
              return (
                <a
                  key={book.id}
                  href={book.archiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)',
                      padding: '20px', height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = catInfo.color; el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '100px',
                        fontSize: '11px', fontWeight: 600,
                        background: `${catInfo.color}12`, color: catInfo.color,
                      }}>
                        {book.category}
                      </span>
                      {book.language && book.language !== 'English' && (
                        <span style={{
                          padding: '3px 8px', borderRadius: '100px',
                          fontSize: '11px', fontWeight: 600,
                          background: 'var(--bg-elevated)', color: 'var(--text-muted)',
                        }}>
                          {book.language}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', lineHeight: 1.3 }}>
                      {book.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', flex: 1 }}>
                      by {book.author}
                    </p>

                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: '12px', borderTop: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Archive size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Internet Archive</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: catInfo.color, fontSize: '12px', fontWeight: 600 }}>
                        Read free <ExternalLink size={12} />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <button
              onClick={() => setVisibleCount(v => v + ITEMS_PER_PAGE)}
              style={{
                padding: '12px 32px', borderRadius: '10px',
                background: 'var(--accent)', color: 'white',
                border: 'none', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Load more ({Math.min(ITEMS_PER_PAGE, filtered.length - visibleCount)} more)
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🧪</div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Arvind Gupta Toys</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Inspired by <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>arvindguptatoys.com</a> · Preserved on Internet Archive
          </p>
        </div>
      </footer>
    </div>
  );
}
