'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Droplets, Star, Leaf, Zap, Plane, FlaskConical, Sun, Gauge, Wand, Calculator, Cog, Apple, FileText, Volume2, RotateCw, GitBranch, Building, Triangle, User, Trash, TreePine, Puzzle, Play, Wind, Scale, Flame, Magnet, CircleDot, Newspaper, Paperclip, Volume1, Trash2, BookOpen, ArrowRight, ChevronRight, Hash } from 'lucide-react';
import { toys, films, categories } from '@/lib/data';

const toyCatColors: Record<string, string> = {
  'gleam-eye': '#f97316', 'air-water': '#0ea5e9', astronomy: '#8b5cf6',
  biology: '#22c55e', electricity: '#eab308', flying: '#06b6d4',
  'force-fun': '#ef4444', light: '#f59e0b', pressure: '#6366f1',
  miscellany: '#ec4899', 'math-magic': '#14b8a6', 'motor-generator': '#64748b',
  newton: '#84cc16', 'paper-fun': '#f43f5e', pumps: '#0ea5e9',
  sounds: '#a855f7', spinning: '#f97316', 'string-games': '#22c55e',
  structures: '#78716c', tipping: '#eab308', potdar: '#06b6d4',
  'toys-trash': '#22c55e', 'tree-tales': '#15803d', puzzles: '#8b5cf6',
};

const filmCatColors: Record<string, string> = {
  inspiring: '#c8531a', air: '#0ea5e9', biology: '#22c55e', balancing: '#f97316',
  chemistry: '#8b5cf6', electricity: '#eab308', friction: '#ef4444', heat: '#f59e0b',
  light: '#f97316', magnetism: '#ec4899', 'maths-magic': '#14b8a6', mechanics: '#64748b',
  miscellaneous: '#a855f7', 'newspaper-caps': '#6366f1', 'paper-models': '#f43f5e',
  'paper-dynamic': '#06b6d4', pumps: '#0ea5e9', spinning: '#f97316', sound: '#a855f7',
  structures: '#78716c', 'trash-art': '#22c55e', water: '#0ea5e9',
};

const toyIcons: Record<string, React.ComponentType<{size?: number; color?: string}>> = {
  Sparkles, Droplets, Star, Leaf, Zap, Plane, FlaskConical, Sun, Gauge,
  Wand, Calculator, Cog, Apple, FileText, Volume2, RotateCw, GitBranch,
  Building, Triangle, User, Trash, TreePine, Puzzle,
};

const filmIconMap: Record<string, React.ComponentType<{size?: number; color?: string}>> = {
  inspiring: Play, air: Wind, biology: Leaf, balancing: Scale,
  chemistry: FlaskConical, electricity: Zap, friction: CircleDot,
  heat: Flame, light: Sun, magnetism: Magnet, 'maths-magic': Calculator,
  mechanics: Cog, miscellaneous: Wand, 'newspaper-caps': Newspaper,
  'paper-models': FileText, 'paper-dynamic': Paperclip, pumps: Droplets,
  spinning: RotateCw, sound: Volume2, structures: Building,
  'trash-art': Trash2, water: Droplets,
};

// Count toys per category
function countToysByCategory(catId: string): number {
  return toys.filter(t => t.category === catId).length;
}

// Count films per category
function countFilmsByCategory(catId: string): number {
  return films.filter(f => f.category === catId).length;
}

function CategoryCard({ href, icon: Icon, label, count, color, big = false }: {
  href: string; icon: React.ComponentType<{size?: number; color?: string}>; label: string;
  count: number; color: string; big?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#fff' : 'var(--bg-card)',
          border: `1.5px solid ${hovered ? color : 'var(--border)'}`,
          borderRadius: big ? '16px' : '12px',
          padding: big ? '20px 18px' : '14px 12px',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered ? `0 6px 20px ${color}25` : '0 1px 3px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {hovered && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: color, borderRadius: '12px 12px 0 0',
          }} />
        )}
        <div style={{
          width: big ? '44px' : '36px', height: big ? '44px' : '36px',
          borderRadius: '10px',
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={big ? 22 : 17} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: big ? '14px' : '13px', fontWeight: 700,
            color: hovered ? color : 'var(--text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {label}
          </div>
          {big && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {count.toLocaleString()} items
            </div>
          )}
        </div>
        {big && (
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color, fontFamily: 'monospace' }}>
              {count > 99 ? '99+' : count}
            </span>
          </div>
        )}
        {!big && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Hash size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {count}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

const toyEmojis: Record<string, string> = {
  'gleam-eye': '✨', 'air-water': '💧', astronomy: '🌌', biology: '🌿',
  electricity: '⚡', flying: '✈️', 'force-fun': '🎯', light: '💡',
  pressure: '⬇️', miscellany: '🎩', 'math-magic': '🔢', 'motor-generator': '⚙️',
  newton: '🍎', 'paper-fun': '📄', pumps: '💨', sounds: '🔊',
  spinning: '🌀', 'string-games': '🧵', structures: '🏗️', tipping: '⚖️',
  potdar: '🎭', 'toys-trash': '♻️', 'tree-tales': '🌳', puzzles: '🧩',
};
const filmEmojis: Record<string, string> = {
  inspiring: '🌟', air: '💨', biology: '🌿', balancing: '⚖️',
  chemistry: '🧪', electricity: '⚡', friction: '🔄', heat: '🔥',
  light: '💡', magnetism: '🧲', 'maths-magic': '🔢', mechanics: '⚙️',
  miscellaneous: '🎲', 'newspaper-caps': '📰', 'paper-models': '📄',
  'paper-dynamic': '🎯', pumps: '💨', spinning: '🌀', sound: '🔊',
  structures: '🏗️', 'trash-art': '♻️', water: '💧',
};
function getCategoryEmoji(id: string): string {
  return toyEmojis[id] || filmEmojis[id] || '📦';
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toySearch, setToySearch] = useState('');
  const [filmSearch, setFilmSearch] = useState('');
  const [toyExpanded, setToyExpanded] = useState<string | null>(null);
  const [filmExpanded, setFilmExpanded] = useState<string | null>(null);

  const toyCats = categories.toys;
  const filmCats = categories.films;

  // Filter toys when searching
  const filteredToyCats = useMemo(() => {
    if (!toySearch) return toyCats;
    return toyCats.filter(c => c.label.toLowerCase().includes(toySearch.toLowerCase()));
  }, [toySearch, toyCats]);

  const filteredFilmCats = useMemo(() => {
    if (!filmSearch) return filmCats;
    return filmCats.filter(c => c.label.toLowerCase().includes(filmSearch.toLowerCase()));
  }, [filmSearch, filmCats]);

  // Get toys for expanded category
  const expandedToys = useMemo(() => {
    if (!toyExpanded) return [];
    return toys.filter(t => t.category === toyExpanded);
  }, [toyExpanded]);

  const expandedFilms = useMemo(() => {
    if (!filmExpanded) return [];
    return films.filter(f => f.category === filmExpanded);
  }, [filmExpanded]);

  // Featured toys (sample from different categories)
  const featuredToys = useMemo(() => {
    const seen = new Set<string>();
    const result = [];
    for (const toy of toys) {
      if (!seen.has(toy.category) && result.length < 6) {
        seen.add(toy.category);
        result.push(toy);
      }
    }
    return result;
  }, []);

  function getToyEmoji(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('cartesian') || t.includes('diver')) return '💧';
    if (t.includes('electric') || t.includes('motor')) return '⚡';
    if (t.includes('bubble') || t.includes('balloon')) return '🫧';
    if (t.includes('solar') || t.includes('sun')) return '☀️';
    if (t.includes('paper')) return '📄';
    if (t.includes('match') || t.includes('rocket')) return '🚀';
    if (t.includes('water') || t.includes('hydra')) return '💦';
    if (t.includes('air') || t.includes('wind')) return '💨';
    return '🔬';
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ─── HEADER ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,250,248,0.97)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: '60px',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #c8531a, #e8763f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🧪</div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Arvind Gupta Toys
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[
              { href: '/toys', label: 'Toys' },
              { href: '/films', label: 'Films' },
              { href: '/books', label: 'Books' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '14px', fontWeight: 600,
                color: link.href === '/toys' ? '#c8531a' : 'var(--text-muted)',
                background: link.href === '/toys' ? 'rgba(200,83,26,0.08)' : 'transparent',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── HERO + SEARCH ─── */}
      <section style={{
        background: 'linear-gradient(180deg, #ffffff 60%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '52px 24px 36px',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: 'var(--text)',
            letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '10px',
          }}>
            Science from Trash
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.5 }}>
            {toys.length.toLocaleString()} toys · {films.length.toLocaleString()} films · Free forever
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
            <Search size={20} style={{
              position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search toys, films..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/toys?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              style={{
                width: '100%', padding: '15px 18px 15px 52px',
                borderRadius: '14px', border: '1.5px solid var(--border)',
                background: '#fff', fontSize: '16px', color: 'var(--text)',
                outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#c8531a';
                e.target.style.boxShadow = '0 0 0 3px rgba(200,83,26,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            />
            {searchQuery && (
              <Link href={`/toys?q=${encodeURIComponent(searchQuery)}`} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                padding: '7px 14px', borderRadius: '8px',
                background: '#c8531a', color: 'white',
                fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              }}>
                Search
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── MAIN 3-COLUMN EXPLORER ─── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── TOYS COLUMN ── */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px',
                background: 'linear-gradient(135deg, #c8531a, #e8763f)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '18px' }}>🧪</span>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  Science Toys
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {toys.length.toLocaleString()} toys across {toyCats.length} categories
                </p>
              </div>
            </div>
            <Link href="/toys" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#c8531a', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Search within toys */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={14} style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Filter categories..."
              value={toySearch}
              onChange={e => setToySearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                borderRadius: '10px', border: '1px solid var(--border)',
                background: 'var(--bg-card)', fontSize: '14px', color: 'var(--text)',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#c8531a'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Category grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '10px',
          }}>
            {filteredToyCats.map(cat => {
              const Icon = toyIcons[cat.icon] || Puzzle;
              const color = toyCatColors[cat.id] || '#c8531a';
              const count = countToysByCategory(cat.id);
              return (
                <div key={cat.id} style={{ position: 'relative' }}>
                  <CategoryCard
                    href={`/toys?category=${cat.id}`}
                    icon={Icon}
                    label={cat.label}
                    count={count}
                    color={color}
                    big
                  />
                  <button
                    onClick={e => {
                      e.preventDefault();
                      setToyExpanded(toyExpanded === cat.id ? null : cat.id);
                    }}
                    style={{
                      position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '4px', borderRadius: '4px',
                      color: toyExpanded === cat.id ? '#c8531a' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <ChevronRight size={14}
                      style={{
                        transform: toyExpanded === cat.id ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: toyExpanded === cat.id ? '#c8531a' : 'var(--text-muted)',
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Expanded toys list */}
          {toyExpanded && (
            <div style={{
              marginTop: '16px', background: 'var(--bg-card)',
              borderRadius: '16px', border: '1.5px solid var(--border)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--bg-elevated)',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                  {toyCats.find(c => c.id === toyExpanded)?.label} — {expandedToys.length} toys
                </span>
                <button
                  onClick={() => setToyExpanded(null)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600,
                  }}
                >
                  ✕ Close
                </button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {expandedToys.slice(0, 30).map(toy => (
                  <a
                    key={toy.id}
                    href={toy.sourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 20px', borderBottom: '1px solid var(--border)',
                      textDecoration: 'none', transition: 'background 0.1s',
                      color: 'var(--text)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '20px' }}>{getToyEmoji(toy.title)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{toy.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{toy.difficulty}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </a>
                ))}
                {expandedToys.length > 30 && (
                  <Link href={`/toys?category=${toyExpanded}`} style={{
                    display: 'block', padding: '14px 20px', textAlign: 'center',
                    color: '#c8531a', fontSize: '13px', fontWeight: 700,
                    textDecoration: 'none',
                  }}>
                    + View all {expandedToys.length} toys →
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── FILMS COLUMN ── */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px',
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '18px' }}>🎬</span>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  Experiment Films
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {films.length.toLocaleString()} films across {filmCats.length} topics
                </p>
              </div>
            </div>
            <Link href="/films" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#8b5cf6', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Search within films */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={14} style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Filter film topics..."
              value={filmSearch}
              onChange={e => setFilmSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                borderRadius: '10px', border: '1px solid var(--border)',
                background: 'var(--bg-card)', fontSize: '14px', color: 'var(--text)',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#8b5cf6'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Category grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '10px',
          }}>
            {filteredFilmCats.map(cat => {
              const Icon = filmIconMap[cat.id] || Play;
              const color = filmCatColors[cat.id] || '#8b5cf6';
              const count = countFilmsByCategory(cat.id);
              return (
                <div key={cat.id} style={{ position: 'relative' }}>
                  <CategoryCard
                    href={`/films?category=${cat.id}`}
                    icon={Icon}
                    label={cat.label}
                    count={count}
                    color={color}
                    big
                  />
                  <button
                    onClick={e => {
                      e.preventDefault();
                      setFilmExpanded(filmExpanded === cat.id ? null : cat.id);
                    }}
                    style={{
                      position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '4px', borderRadius: '4px',
                      color: filmExpanded === cat.id ? '#8b5cf6' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <ChevronRight size={14}
                      style={{
                        transform: filmExpanded === cat.id ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: filmExpanded === cat.id ? '#8b5cf6' : 'var(--text-muted)',
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Expanded films list */}
          {filmExpanded && (
            <div style={{
              marginTop: '16px', background: 'var(--bg-card)',
              borderRadius: '16px', border: '1.5px solid var(--border)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--bg-elevated)',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                  {filmCats.find(c => c.id === filmExpanded)?.label} — {expandedFilms.length} films
                </span>
                <button
                  onClick={() => setFilmExpanded(null)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600,
                  }}
                >
                  ✕ Close
                </button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {expandedFilms.slice(0, 20).map(film => (
                  <a
                    key={film.id}
                    href={`https://www.youtube.com/watch?v=${film.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 20px', borderBottom: '1px solid var(--border)',
                      textDecoration: 'none', transition: 'background 0.1s',
                      color: 'var(--text)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{
                      width: '44px', height: '33px', borderRadius: '6px',
                      background: '#000', flexShrink: 0, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img
                        src={`https://img.youtube.com/vi/${film.youtubeId}/default.jpg`}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: 600, color: 'var(--text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {film.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {film.duration}
                      </div>
                    </div>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'rgba(139,92,246,0.15)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '10px' }}>▶</span>
                    </div>
                  </a>
                ))}
                {expandedFilms.length > 20 && (
                  <Link href={`/films?category=${filmExpanded}`} style={{
                    display: 'block', padding: '14px 20px', textAlign: 'center',
                    color: '#8b5cf6', fontSize: '13px', fontWeight: 700,
                    textDecoration: 'none',
                  }}>
                    + View all {expandedFilms.length} films →
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── BOOKS ── */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px',
                background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '18px' }}>📚</span>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  Free Books
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Public domain science books from Internet Archive
                </p>
              </div>
            </div>
            <Link href="/books" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#22c55e', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
            }}>
              Browse all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {[
              { title: 'The Art of Science Toys', author: 'Arvind Gupta', color: '#c8531a', url: 'https://archive.org/details/ArvindGuptaScienceToys', subjects: ['Science toys', 'DIY'] },
              { title: 'Little Wonder Book of Science', author: 'E. Joseph B. Adloff', color: '#8b5cf6', url: 'https://archive.org/details/littlewonderbook00adlo', subjects: ['Science', 'Children'] },
              { title: 'The First Book of Science Experiments', author: 'E. Joseph B. Adloff', color: '#0ea5e9', url: 'https://archive.org/details/firstbookofscie00adlo', subjects: ['Experiments', 'Science'] },
              { title: 'Physics for Kids — Fun Experiments', author: 'William H. K. Lee', color: '#eab308', url: 'https://archive.org/details/physicsforkidsfun00lee', subjects: ['Physics', 'Kids'] },
              { title: 'Science Magic', author: 'Walter R. H. Brown', color: '#f97316', url: 'https://archive.org/details/scienceformagic00brow', subjects: ['Science', 'Magic'] },
              { title: 'The Home Laboratory', author: 'Clarence J. W. G. Boehm', color: '#14b8a6', url: 'https://archive.org/details/homelaboratory00boehrich', subjects: ['Chemistry', 'Biology'] },
            ].map((book, i) => (
              <a key={book.url} href={book.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: 'var(--bg-card)', borderRadius: '12px',
                    border: '1px solid var(--border)',
                    padding: '18px',
                    transition: 'all 0.18s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = book.color;
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = `0 4px 16px ${book.color}20`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--border)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: `${book.color}18`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BookOpen size={20} color={book.color} />
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', lineHeight: 1.3 }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    by {book.author}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {book.subjects.map(s => (
                      <span key={s} style={{
                        padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600,
                        background: `${book.color}15`, color: book.color,
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <div style={{
          marginTop: '64px', padding: '48px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #c8531a 0%, #e8763f 100%)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Start making today
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '28px' }}>
            Every item in your trash can is a potential science toy.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/toys" style={{
              padding: '13px 26px', borderRadius: '10px',
              background: 'white', color: '#c8531a', textDecoration: 'none',
              fontSize: '15px', fontWeight: 700,
            }}>
              Explore Toys →
            </Link>
            <Link href="/films" style={{
              padding: '13px 26px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
              fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)',
            }}>
              Watch Films
            </Link>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #c8531a, #e8763f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🧪</div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Arvind Gupta Toys</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Inspired by <a href="https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c8531a', textDecoration: 'none', fontWeight: 600 }}>
              arvindguptatoys.com
            </a> · Free forever
          </p>
        </div>
      </footer>
    </div>
  );
}
