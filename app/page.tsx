'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Film, Wrench, ArrowRight, ExternalLink, Globe, Heart, Library, Clapperboard, Lightbulb, Shuffle, Sparkles, X, Clock, Trash2 } from 'lucide-react';
import { toys, films } from '@/lib/data';
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
  description?: string;
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

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Stories & Literature': BookOpen,
  'History & Biography': Library,
  'Science & Experiments': Lightbulb,
  'Toys & Crafts': Wrench,
  'Animals & Birds': Globe,
  'Education & Teaching': BookOpen,
  'Nature & Environment': Globe,
  'Philosophy & Society': BookOpen,
};

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || target === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function SkeletonStatCard() {
  return (
    <div style={{
      padding: '12px 24px', borderRadius: '12px',
      border: '1px solid var(--border)', background: 'var(--bg-card)',
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      <div style={{ width: 48, height: 24, borderRadius: 6, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      <div style={{ width: 36, height: 16, borderRadius: 4, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
    </div>
  );
}

function SkeletonCategoryCard() {
  return (
    <div style={{
      padding: '24px', borderRadius: '16px',
      border: '1px solid var(--border)', background: 'var(--bg-card)',
      display: 'flex', alignItems: 'center', gap: '14px',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '70%', height: 16, borderRadius: 4, background: 'var(--bg-elevated)', marginBottom: 8, animation: 'shimmer 1.5s ease-in-out infinite' }} />
        <div style={{ width: '40%', height: 12, borderRadius: 4, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function SkeletonBookCard() {
  return (
    <div style={{
      borderRadius: '14px', border: '1px solid var(--border)',
      background: 'var(--bg-card)', overflow: 'hidden',
    }}>
      <div style={{ height: 140, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      <div style={{ padding: 14 }}>
        <div style={{ width: '50%', height: 12, borderRadius: 4, background: 'var(--bg-elevated)', marginBottom: 10, animation: 'shimmer 1.5s ease-in-out infinite' }} />
        <div style={{ width: '90%', height: 14, borderRadius: 4, background: 'var(--bg-elevated)', marginBottom: 6, animation: 'shimmer 1.5s ease-in-out infinite' }} />
        <div style={{ width: '60%', height: 12, borderRadius: 4, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [bookCategories, setBookCategories] = useState<{ name: string; count: number }[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalLanguages, setTotalLanguages] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [dailyBook, setDailyBook] = useState<Book | null>(null);
  const [dailyToy, setDailyToy] = useState<typeof toys[0] | null>(null);
  const [dailyFilm, setDailyFilm] = useState<typeof films[0] | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Book[]>([]);
  const [surpriseBook, setSurpriseBook] = useState<Book | null>(null);
  const [surpriseAnim, setSurpriseAnim] = useState(false);
  const recentSectionRef = useRef<HTMLDivElement>(null);
  const [recentVisible, setRecentVisible] = useState(false);

  // Lazy load recently added section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRecentVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (recentSectionRef.current) observer.observe(recentSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('/books.json')
      .then(r => r.json())
      .then((data: Book[]) => {
        setTotalBooks(data.length);
        setAllBooks(data);
        const langs = new Set(data.map(b => b.language || 'English'));
        setTotalLanguages(langs.size);
        const catCounts: Record<string, number> = {};
        for (const b of data) catCounts[b.category] = (catCounts[b.category] || 0) + 1;
        const sorted = Object.entries(catCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }));
        setBookCategories(sorted);
        setRecentBooks(data.slice(-6).reverse());

        // Daily Pick
        const dayIndex = Math.floor(Date.now() / 86400000);
        if (data.length > 0) setDailyBook(data[dayIndex % data.length]);
        if (toys.length > 0) setDailyToy(toys[dayIndex % toys.length]);
        if (films.length > 0) setDailyFilm(films[dayIndex % films.length]);

        // Recently Viewed
        try {
          const viewedIds: string[] = JSON.parse(localStorage.getItem('agt-recently-viewed') || '[]');
          if (viewedIds.length > 0) {
            const bookMap = new Map(data.map(b => [b.id, b]));
            const viewedBooks = viewedIds.map(id => bookMap.get(id)).filter(Boolean) as Book[];
            setRecentlyViewed(viewedBooks);
          }
        } catch {}

        setDataLoaded(true);
      })
      .catch(() => { setDataLoaded(true); });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/books?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSurpriseMe = useCallback(() => {
    if (allBooks.length === 0) return;
    setSurpriseAnim(true);
    setTimeout(() => setSurpriseAnim(false), 600);
    const randomIndex = Math.floor(Math.random() * allBooks.length);
    setSurpriseBook(allBooks[randomIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [allBooks]);

  const clearRecentlyViewed = () => {
    localStorage.removeItem('agt-recently-viewed');
    setRecentlyViewed([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Header />

      {/* Spacer for fixed header */}
      <div style={{ height: '64px' }} />

      {/* Hero with background image */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 64px',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
        }}>
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920"
            alt=""
            loading="eager"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center 30%',
            }}
          />
          {/* Dark overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)',
          }} />
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Logo size={56} />
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900,
            color: '#ffffff', letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: '16px',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>
            Science from Trash
          </h1>
          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
            marginBottom: '32px', maxWidth: '520px', margin: '0 auto 32px',
          }}>
            Arvind Gupta&apos;s collection of science toys, films, and books -- free forever, preserved on Internet Archive.
          </p>

          {/* Search with glass morphism */}
          <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto 40px' }}>
            <Search size={20} style={{
              position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.6)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search books, toys, films..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              style={{
                width: '100%', padding: '16px 120px 16px 52px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                fontSize: '16px', color: '#ffffff',
                outline: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), 0 0 0 3px rgba(200,83,26,0.3)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
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

          {/* Stats with animated counters */}
          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {dataLoaded ? (
              <>
                {[
                  { label: 'Books', count: totalBooks || 8197, href: '/books', icon: BookOpen },
                  { label: 'Toys', count: toys.length, href: '/toys', icon: Wrench },
                  { label: 'Films', count: films.length, href: '/films', icon: Film },
                ].map(stat => (
                  <Link key={stat.label} href={stat.href} style={{
                    textDecoration: 'none',
                    padding: '12px 24px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  >
                    <stat.icon size={18} style={{ color: '#e8763f' }} />
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                      <AnimatedCounter target={stat.count} />
                    </span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                      {stat.label}
                    </span>
                  </Link>
                ))}
                <div style={{
                  padding: '12px 24px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <Globe size={18} style={{ color: '#e8763f' }} />
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                    <AnimatedCounter target={totalLanguages || 15} />
                  </span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    Languages
                  </span>
                </div>
              </>
            ) : (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            )}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Today's Pick */}
        {dataLoaded && (dailyBook || dailyToy || dailyFilm) && (
          <section style={{ marginBottom: '64px', paddingTop: '64px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={22} style={{ color: '#c8531a' }} />
                <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Today&apos;s Pick
                </h2>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                New picks every day -- curated just for you
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
            }} className="daily-pick-grid">
              {/* Daily Book */}
              {dailyBook && (() => {
                const dbConfig = BOOK_CATEGORY_CONFIG[dailyBook.category] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: dailyBook.category };
                const dbThumb = dailyBook.thumbnailUrl || (dailyBook.archiveId ? `https://archive.org/services/img/${dailyBook.archiveId}` : '');
                return (
                  <a href={dailyBook.archiveUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        borderRadius: '16px', border: '1px solid var(--border)',
                        background: 'var(--bg-card)', overflow: 'hidden',
                        transition: 'all 0.3s', height: '100%',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = dbConfig.color;
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        height: '180px', overflow: 'hidden', position: 'relative',
                        background: `linear-gradient(135deg, ${dbConfig.color}15, ${dbConfig.color}05)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {dbThumb ? (
                          <img src={dbThumb} alt={dailyBook.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div style={{ fontSize: '48px' }}>{dbConfig.emoji}</div>
                        )}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px', fontWeight: 700 }}>
                          <BookOpen size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />Book of the Day
                        </div>
                      </div>
                      <div style={{ padding: '18px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: `${dbConfig.color}12`, color: dbConfig.color }}>
                          {dbConfig.emoji} {dbConfig.label}
                        </span>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginTop: '10px', marginBottom: '4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                          {dailyBook.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>{dailyBook.author}</p>
                        {dailyBook.description && (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', marginBottom: '10px' }}>
                            {dailyBook.description}
                          </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: dbConfig.color, fontSize: '13px', fontWeight: 700 }}>
                          Read free <ExternalLink size={12} />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })()}

              {/* Daily Toy */}
              {dailyToy && (
                <a href={dailyToy.sourceUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      borderRadius: '16px', border: '1px solid var(--border)',
                      background: 'var(--bg-card)', overflow: 'hidden',
                      transition: 'all 0.3s', height: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#22c55e';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      height: '180px', overflow: 'hidden', position: 'relative',
                      background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {dailyToy.image ? (
                        <img src={dailyToy.image} alt={dailyToy.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div style={{ fontSize: '48px' }}>{dailyToy.icon || '\uD83E\uDDE9'}</div>
                      )}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px', fontWeight: 700 }}>
                        <Wrench size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />Toy of the Day
                      </div>
                    </div>
                    <div style={{ padding: '18px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                        {dailyToy.category}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginTop: '10px', marginBottom: '4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {dailyToy.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', marginBottom: '10px' }}>
                        {dailyToy.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '13px', fontWeight: 700 }}>
                        View toy <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {/* Daily Film */}
              {dailyFilm && (
                <a href={`https://www.youtube.com/watch?v=${dailyFilm.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      borderRadius: '16px', border: '1px solid var(--border)',
                      background: 'var(--bg-card)', overflow: 'hidden',
                      transition: 'all 0.3s', height: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      height: '180px', overflow: 'hidden', position: 'relative',
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={`https://img.youtube.com/vi/${dailyFilm.youtubeId}/mqdefault.jpg`} alt={dailyFilm.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px', fontWeight: 700 }}>
                        <Clapperboard size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />Film of the Day
                      </div>
                    </div>
                    <div style={{ padding: '18px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                        {dailyFilm.category}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginTop: '10px', marginBottom: '4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {dailyFilm.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', marginBottom: '10px' }}>
                        {dailyFilm.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6', fontSize: '13px', fontWeight: 700 }}>
                          Watch free <ExternalLink size={12} />
                        </div>
                        {dailyFilm.duration && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dailyFilm.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Featured Categories */}
        <section style={{ marginBottom: '64px', paddingTop: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Browse by Category
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                Discover books across {dataLoaded ? bookCategories.length : '...'} categories
              </p>
            </div>
            <Link href="/books" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--accent)', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700,
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="category-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {dataLoaded ? bookCategories.map(({ name, count }) => {
              const config = BOOK_CATEGORY_CONFIG[name] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: name };
              return (
                <Link
                  key={name}
                  href={`/books?category=${encodeURIComponent(name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '28px 24px', borderRadius: '16px',
                      background: `linear-gradient(135deg, ${config.color}12, ${config.color}06)`,
                      border: `1px solid ${config.color}20`,
                      display: 'flex', flexDirection: 'column', gap: '14px',
                      transition: 'all 0.25s', cursor: 'pointer',
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = `0 12px 32px ${config.color}20`;
                      e.currentTarget.style.borderColor = `${config.color}40`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = `${config.color}20`;
                    }}
                  >
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '14px',
                      background: `${config.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px', flexShrink: 0,
                    }}>
                      {config.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                        {config.label}
                      </div>
                      <div style={{
                        fontSize: '28px', fontWeight: 800, color: config.color,
                        lineHeight: 1,
                      }}>
                        {count.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        books
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCategoryCard key={i} />)
            )}
          </div>
        </section>

        {/* Explore Our Collection - Featured Content */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Explore Our Collection
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Three decades of learning resources, free for everyone
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
          }} className="feature-grid">
            {[
              {
                title: 'Books',
                desc: `${(totalBooks || 8197).toLocaleString()} free books preserved on Internet Archive`,
                img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
                href: '/books',
                color: '#c8531a',
                icon: BookOpen,
              },
              {
                title: 'Toys',
                desc: `${toys.length.toLocaleString()} science toys from everyday materials`,
                img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800',
                href: '/toys',
                color: '#22c55e',
                icon: Wrench,
              },
              {
                title: 'Films',
                desc: `${films.length.toLocaleString()} educational films on YouTube`,
                img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
                href: '/films',
                color: '#8b5cf6',
                icon: Clapperboard,
              },
            ].map(item => (
              <Link key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    borderRadius: '20px', overflow: 'hidden',
                    border: '1px solid var(--border)', background: 'var(--bg-card)',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.12)';
                    e.currentTarget.style.borderColor = item.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{
                    height: '200px', position: 'relative', overflow: 'hidden',
                  }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: '16px', left: '16px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <item.icon size={18} style={{ color: 'white' }} />
                      </div>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                      {item.desc}
                    </p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: item.color, fontSize: '14px', fontWeight: 700,
                    }}>
                      Explore {item.title.toLowerCase()} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={22} style={{ color: 'var(--text-muted)' }} />
                <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Recently Viewed
                </h2>
              </div>
              <button
                onClick={clearRecentlyViewed}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Trash2 size={13} /> Clear
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}>
              {recentlyViewed.slice(0, 6).map(book => {
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
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = config.color;
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
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
                        overflow: 'hidden', position: 'relative',
                      }}>
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={book.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px 13px 0 0' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div style={{ fontSize: '36px' }}>{config.emoji}</div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)' }} />
                      </div>
                      <div style={{ padding: '14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, background: `${config.color}12`, color: config.color }}>
                          {config.emoji} {config.label}
                        </span>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginTop: '8px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                          {book.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{book.author}</p>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', color: config.color, fontSize: '12px', fontWeight: 700 }}>
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

        {/* Recently Added */}
        <div ref={recentSectionRef} />
        {recentVisible && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Recently Added
              </h2>
              <Link href="/books" style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                color: 'var(--accent)', textDecoration: 'none',
                fontSize: '14px', fontWeight: 700,
              }}>
                View all books <ArrowRight size={14} />
              </Link>
            </div>

            {recentBooks.length > 0 ? (
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
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = config.color;
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
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
                          overflow: 'hidden', position: 'relative',
                        }}>
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={book.title}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px 13px 0 0' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div style={{ fontSize: '36px' }}>{config.emoji}</div>
                          )}
                          {/* Gradient overlay on thumbnail bottom */}
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
                          }} />
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
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '16px',
              }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonBookCard key={i} />)}
              </div>
            )}
          </section>
        )}

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
            Every item in your trash can is a potential science toy. Dive into {(totalBooks || 8197).toLocaleString()} free books and {toys.length.toLocaleString()} toys.
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

      {/* Surprise Me FAB */}
      {dataLoaded && allBooks.length > 0 && (
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
      )}

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
              const sConfig = BOOK_CATEGORY_CONFIG[surpriseBook.category] || { emoji: '\uD83D\uDCDA', color: '#64748b', label: surpriseBook.category };
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
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        padding: '48px 24px', marginTop: '40px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            flexWrap: 'wrap', gap: '32px', marginBottom: '32px',
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Logo size={32} />
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>Arvind Gupta Toys</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.6 }}>
                Inspired by{' '}
                <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c8531a', textDecoration: 'none', fontWeight: 600 }}>
                  arvindguptatoys.com
                </a>
                {' '} -- Preserved on Internet Archive
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Explore
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { href: '/books', label: 'Books', icon: BookOpen },
                    { href: '/toys', label: 'Toys', icon: Wrench },
                    { href: '/films', label: 'Films', icon: Film },
                  ].map(link => (
                    <Link key={link.href} href={link.href} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      textDecoration: 'none', color: 'var(--text-muted)',
                      fontSize: '14px', fontWeight: 500,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#c8531a'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      <link.icon size={14} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid var(--border)', paddingTop: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Free forever
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Made with <Heart size={12} style={{ color: '#ef4444' }} /> for curious minds
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        @media (max-width: 900px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .feature-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .daily-pick-grid {
          /* default handled inline */
        }
        @media (max-width: 900px) {
          .daily-pick-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
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
