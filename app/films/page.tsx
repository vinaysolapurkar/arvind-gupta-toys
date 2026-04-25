'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Play, Wind, Leaf, Scale, FlaskConical, Zap, CircleDot, Flame, Sun, Magnet, Calculator, Cog, Wand, Newspaper, FileText, Paperclip, Droplets, RotateCw, Volume2, Building, Trash } from 'lucide-react';
import { films, categories } from '@/lib/data';

const filmCatColors: Record<string, string> = {
  inspiring: '#c8531a', air: '#0ea5e9', biology: '#22c55e', balancing: '#f97316',
  chemistry: '#8b5cf6', electricity: '#eab308', friction: '#ef4444', heat: '#f59e0b',
  light: '#f97316', magnetism: '#ec4899', 'maths-magic': '#14b8a6', mechanics: '#64748b',
  miscellaneous: '#a855f7', 'newspaper-caps': '#6366f1', 'paper-models': '#f43f5e',
  'paper-dynamic': '#06b6d4', pumps: '#0ea5e9', spinning: '#f97316', sound: '#a855f7',
  structures: '#78716c', 'trash-art': '#22c55e', water: '#0ea5e9',
};

const filmIconMap: Record<string, string> = {
  inspiring: 'Play', air: 'Wind', biology: 'Leaf', balancing: 'Scale',
  chemistry: 'FlaskConical', electricity: 'Zap', friction: 'CircleDot', heat: 'Flame',
  light: 'Sun', magnetism: 'Magnet', 'maths-magic': 'Calculator', mechanics: 'Cog',
  miscellaneous: 'Wand', 'newspaper-caps': 'Newspaper', 'paper-models': 'FileText',
  'paper-dynamic': 'Paperclip', pumps: 'Droplets', spinning: 'RotateCw', sound: 'Volume2',
  structures: 'Building', 'trash-art': 'Trash', water: 'Droplets',
};

const iconComponents: Record<string, React.ComponentType<{size?: number; className?: string}>> = {
  Play, Wind, Leaf, Scale, FlaskConical, Zap, CircleDot, Flame, Sun, Magnet,
  Calculator, Cog, Wand, Newspaper, FileText, Paperclip, Droplets, RotateCw,
  Volume2, Building, Trash,
};

export default function FilmsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const filmCategories = categories.films;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
    setVisible(true);
  }, []);

  const filteredFilms = useMemo(() => {
    return films.filter(film => {
      const matchesCategory = !selectedCategory || film.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Only show first few per category for performance (too many films)
  const displayFilms = useMemo(() => {
    if (filteredFilms.length <= 200) return filteredFilms;
    // Group by category and limit
    const grouped: Record<string, typeof films> = {};
    for (const f of filteredFilms) {
      if (!grouped[f.category]) grouped[f.category] = [];
      if (grouped[f.category].length < 8) grouped[f.category].push(f);
    }
    // If search, show all results up to 200
    if (searchQuery) return filteredFilms.slice(0, 200);
    return Object.values(grouped).flat();
  }, [filteredFilms, searchQuery]);

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
                color: link.href === '/films' ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '15px', fontWeight: 600,
                background: link.href === '/films' ? 'rgba(200,83,26,0.08)' : 'transparent',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            🎬 Experiment Films
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            {films.length.toLocaleString()} films across 22 categories · Watch, learn, make
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '28px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search films by title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 44px',
              borderRadius: '10px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', fontSize: '15px', color: 'var(--text)',
              outline: 'none', transition: 'border-color 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--bg-elevated)', border: 'none', borderRadius: '6px',
                padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}
            >
              <X size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '7px 14px', borderRadius: '100px', border: '1px solid',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
              borderColor: !selectedCategory ? 'var(--accent)' : 'var(--border)',
              backgroundColor: !selectedCategory ? 'var(--accent)' : 'transparent',
              color: !selectedCategory ? 'white' : 'var(--text-muted)',
            }}
          >
            All Films
          </button>
          {filmCategories.map(cat => {
            const color = filmCatColors[cat.id] || 'var(--accent)';
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                style={{
                  padding: '7px 14px', borderRadius: '100px', border: '1px solid',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
                  borderColor: isActive ? color : 'var(--border)',
                  backgroundColor: isActive ? color : 'transparent',
                  color: isActive ? 'white' : 'var(--text-muted)',
                }}
                onMouseEnter={e => {
                  if (!isActive) { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }
                }}
                onMouseLeave={e => {
                  if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{displayFilms.length.toLocaleString()}</strong> films
            {filteredFilms.length > displayFilms.length && <> (filtered from {filteredFilms.length.toLocaleString()})</>}
          </p>
          {(selectedCategory || searchQuery) && (
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
              style={{ fontSize: '13px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Films grid */}
        {displayFilms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No films found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {displayFilms.map((film, i) => {
              const color = filmCatColors[film.category] || 'var(--accent)';
              const IconComp = iconComponents[filmIconMap[film.category]] || Play;
              const isPlaying = playingId === film.id;

              return (
                <div
                  key={film.id}
                  className="card-hover animate-fade-up"
                  style={{
                    background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)',
                    overflow: 'hidden', opacity: visible ? 0 : 1,
                    animationDelay: `${Math.min(i * 15, 300)}ms`, animationFillMode: 'forwards',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.06)`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.boxShadow = 'none'; }}
                >
                  {/* Video thumbnail/player */}
                  <div
                    style={{
                      position: 'relative', paddingTop: '56.25%',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPlayingId(isPlaying ? null : film.id)}
                  >
                    {isPlaying ? (
                      <iframe
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                        src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={film.title}
                      />
                    ) : (
                      <>
                        {/* Thumbnail from YouTube */}
                        <img
                          src={`https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg`}
                          alt={film.title}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                        }}>
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: 'rgba(200,83,26,0.95)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px', color: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          }}>
                            ▶
                          </div>
                        </div>
                        {/* Duration badge */}
                        <div style={{
                          position: 'absolute', bottom: '10px', right: '10px',
                          padding: '3px 8px', borderRadius: '4px',
                          background: 'rgba(0,0,0,0.8)', color: 'white',
                          fontSize: '11px', fontWeight: 600,
                        }}>
                          {film.duration}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconComp size={14} />
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: '100px',
                        fontSize: '11px', fontWeight: 600,
                        background: `${color}15`, color: color, textTransform: 'capitalize',
                      }}>
                        {film.category.replace('-', ' ')}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: '8px' }}>
                      {film.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {film.duration}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredFilms.length > displayFilms.length && (
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Showing {displayFilms.length} of {filteredFilms.length.toLocaleString()} films
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px',
                    background: 'var(--accent)', color: 'white', border: 'none',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Browse all categories
                </button>
              )}
              <a
                href={`https://web.archive.org/web/2024/https://www.arvindguptatoys.com/films.html`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px', borderRadius: '8px',
                  background: 'var(--bg-elevated)', color: 'var(--text)',
                  textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                  border: '1px solid var(--border)',
                }}
              >
                View full list on Internet Archive →
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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