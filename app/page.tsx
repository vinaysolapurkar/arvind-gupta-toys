'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Film, Wrench, ArrowRight, ExternalLink } from 'lucide-react';
import { toys, films, categories } from '@/lib/data';
import Header from '@/components/Header';
import Logo from '@/components/Logo';

interface Book {
  id: string;
  title: string;
  author: string;
  archiveUrl: string;
  archiveId: string;
  category: string;
  language: string;
  thumbnailUrl?: string;
}

const BOOK_CATEGORY_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  'Stories & Literature': { emoji: '\uD83D\uDCD6', color: '#8b5cf6', label: 'Stories & Literature' },
  'History & Biography': { emoji: '\uD83C\uDFDB\uFE0F', color: '#b45309', label: 'History & Biography' },
  'Science & Experiments': { emoji: '\uD83D\uDD2C', color: '#0ea5e9', label: 'Science & Experiments' },
  'Toys & Crafts': { emoji: '\uD83C\uDFA8', color: '#f97316', label: 'Toys & Crafts' },
  'Animals & Birds': { emoji: '\uD83E\uDD81', color: '#22c55e', label: 'Animals & Birds' },
  'Education & Teaching': { emoji: '\uD83C\uDF93', color: '#6366f1', label: 'Education & Teaching' },
  'Nature & Environment': { emoji: '\uD83C\uDF3F', color: '#15803d', label: 'Nature & Environment' },
  'Philosophy & Society': { emoji: '\uD83D\uDCAD', color: '#78716c', label: 'Philosophy & Society' },
  'Space & Astronomy': { emoji: '\uD83D\uDE80', color: '#1e40af', label: 'Space & Astronomy' },
  'Health & Nutrition': { emoji: '\uD83E\uDE7A', color: '#ef4444', label: 'Health & Nutrition' },
  'Mathematics & Puzzles': { emoji: '\uD83E\uDDEE', color: '#14b8a6', label: 'Mathematics & Puzzles' },
  'Art & Drawing': { emoji: '\uD83C\uDFAD', color: '#ec4899', label: 'Art & Drawing' },
  'Water & Energy': { emoji: '\u26A1', color: '#eab308', label: 'Water & Energy' },
  'Language & Literacy': { emoji: '\uD83D\uDCDD', color: '#f59e0b', label: 'Language & Literacy' },
  'Poetry & Songs': { emoji: '\uD83C\uDFB5', color: '#a855f7', label: 'Poetry & Songs' },
  'Music & Performance': { emoji: '\uD83C\uDFB6', color: '#06b6d4', label: 'Music & Performance' },
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [bookCategories, setBookCategories] = useState<{ name: string; count: number }[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalLanguages, setTotalLanguages] = useState(0);

  useEffect(() => {
    fetch('/books.json')
      .then(r => r.json())
      .then((data: Book[]) => {
        setTotalBooks(data.length);
        // Count languages
        const langs = new Set(data.map(b => b.language || 'English'));
        setTotalLanguages(langs.size);
        // Get category counts
        const catCounts: Record<string, number> = {};
        for (const b of data) catCounts[b.category] = (catCounts[b.category] || 0) + 1;
        const sorted = Object.entries(catCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }));
        setBookCategories(sorted);
        // Recent books (last 6)
        setRecentBooks(data.slice(-6).reverse());
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/books?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Header />

      {/* Spacer for fixed header */}
      <div style={{ height: '64px' }} />

      {/* Hero */}
      <section style={{
        padding: '64px 24px 48px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(200,83,26,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Logo size={56} />
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900,
            color: 'var(--text)', letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: '16px',
          }}>
            Science from Trash
          </h1>
          <p style={{
            fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6,
            marginBottom: '32px', maxWidth: '520px', margin: '0 auto 32px',
          }}>
            Arvind Gupta&apos;s collection of science toys, films, and books -- free forever, preserved on Internet Archive.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto 40px' }}>
            <Search size={20} style={{
              position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search books, toys, films..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              style={{
                width: '100%', padding: '16px 120px 16px 52px',
                borderRadius: '16px', border: '2px solid var(--border)',
                background: 'var(--bg-card)', fontSize: '16px', color: 'var(--text)',
                outline: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#c8531a';
                e.target.style.boxShadow = '0 0 0 3px rgba(200,83,26,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
              }}
            />
            {searchQuery && (
              <button
                onClick={handleSearch}
                style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  padding: '10px 20px', borderRadius: '10px',
                  background: '#c8531a', color: 'white',
                  fontSize: '14px', fontWeight: 700, border: 'none',
                  cursor: 'pointer',
                }}
              >
                Search
              </button>
            )}
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {[
              { label: 'Books', count: totalBooks || 8197, href: '/books', icon: BookOpen },
              { label: 'Toys', count: toys.length, href: '/toys', icon: Wrench },
              { label: 'Films', count: films.length, href: '/films', icon: Film },
            ].map(stat => (
              <Link key={stat.label} href={stat.href} style={{
                textDecoration: 'none',
                padding: '12px 24px', borderRadius: '12px',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#c8531a';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <stat.icon size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>
                  {stat.count.toLocaleString()}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {stat.label}
                </span>
              </Link>
            ))}
            <div style={{
              padding: '12px 24px', borderRadius: '12px',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '18px' }}>{'\uD83C\uDF0D'}</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>
                {totalLanguages || 15}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Languages
              </span>
            </div>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Featured Categories */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Browse by Category
            </h2>
            <Link href="/books" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--accent)', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700,
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '12px',
          }}>
            {bookCategories.map(({ name, count }) => {
              const config = BOOK_CATEGORY_CONFIG[name] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: name };
              return (
                <Link
                  key={name}
                  href={`/books?category=${encodeURIComponent(name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '20px', borderRadius: '14px',
                      border: '1px solid var(--border)', background: 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', gap: '14px',
                      transition: 'all 0.2s', cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = config.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${config.color}15`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: `${config.color}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', flexShrink: 0,
                    }}>
                      {config.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                        {config.label}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {count.toLocaleString()} books
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recently Added */}
        {recentBooks.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Recently Added
              </h2>
              <Link href="/books" style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                color: 'var(--accent)', textDecoration: 'none',
                fontSize: '14px', fontWeight: 700,
              }}>
                Browse all <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}>
              {recentBooks.map(book => {
                const config = BOOK_CATEGORY_CONFIG[book.category] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: book.category };
                const thumbUrl = book.thumbnailUrl || (book.archiveId ? `https://archive.org/services/img/${book.archiveId}` : '');
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
                        borderRadius: '14px', border: '1px solid var(--border)',
                        background: 'var(--bg-card)', overflow: 'hidden',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = config.color;
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        height: '140px',
                        background: `linear-gradient(135deg, ${config.color}15, ${config.color}05)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={book.title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ fontSize: '36px' }}>{config.emoji}</div>
                        )}
                      </div>
                      <div style={{ padding: '14px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '100px',
                          fontSize: '10px', fontWeight: 600,
                          background: `${config.color}12`, color: config.color,
                        }}>
                          {config.emoji} {config.label}
                        </span>
                        <h3 style={{
                          fontSize: '14px', fontWeight: 700, color: 'var(--text)',
                          marginTop: '8px', lineHeight: 1.3,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                        }}>
                          {book.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {book.author}
                        </p>
                        <div style={{
                          marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px',
                          color: config.color, fontSize: '12px', fontWeight: 700,
                        }}>
                          Read free <ExternalLink size={12} />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick access sections */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px',
          }}>
            {/* Toys card */}
            <Link href="/toys" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '32px', borderRadius: '16px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#c8531a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,83,26,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(200,83,26,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <Wrench size={24} style={{ color: '#c8531a' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                  Science Toys
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {toys.length.toLocaleString()} DIY science toys made from everyday materials. Learn physics, chemistry, and biology through play.
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  color: '#c8531a', fontSize: '14px', fontWeight: 700,
                }}>
                  Explore toys <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Films card */}
            <Link href="/films" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '32px', borderRadius: '16px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(139,92,246,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <Film size={24} style={{ color: '#8b5cf6' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                  Experiment Films
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {films.length.toLocaleString()} video tutorials showing how to make science toys and run experiments at home.
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  color: '#8b5cf6', fontSize: '14px', fontWeight: 700,
                }}>
                  Watch films <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div style={{
          padding: '48px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #c8531a 0%, #e8763f 100%)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Start exploring today
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
            Every item in your trash can is a potential science toy. Dive into {totalBooks.toLocaleString()} free books and {toys.length.toLocaleString()} toys.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/books" style={{
              padding: '14px 28px', borderRadius: '12px',
              background: 'white', color: '#c8531a', textDecoration: 'none',
              fontSize: '15px', fontWeight: 700,
            }}>
              Browse Books
            </Link>
            <Link href="/toys" style={{
              padding: '14px 28px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
              fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)',
            }}>
              Explore Toys
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '32px 24px', marginTop: '40px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={28} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Arvind Gupta Toys</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Inspired by <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c8531a', textDecoration: 'none', fontWeight: 600 }}>
              arvindguptatoys.com
            </a> &middot; Preserved on Internet Archive &middot; Free forever
          </p>
        </div>
      </footer>
    </div>
  );
}
