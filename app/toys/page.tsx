'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles, Droplets, Star, Leaf, Zap, Plane, FlaskConical, Sun, Gauge, Wand, Calculator, Cog, Apple, FileText, Volume2, RotateCw, GitBranch, Building, Triangle, User, Trash, TreePine, Puzzle, ArrowRight } from 'lucide-react';
import { toys, categories } from '@/lib/data';

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

const iconMap: Record<string, React.ComponentType<{size?: number; className?: string}>> = {
  Sparkles, Droplets, Star, Leaf, Zap, Plane, FlaskConical, Sun, Gauge,
  Wand, Calculator, Cog, Apple, FileText, Volume2, RotateCw, GitBranch,
  Building, Triangle, User, Trash, TreePine, Puzzle,
};

// Emoji fallback map for toy titles
function getToyEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('cartesian') || t.includes('diver') || t.includes('submarine')) return '💧';
  if (t.includes('electric') || t.includes('motor') || t.includes('battery')) return '⚡';
  if (t.includes('bubble') || t.includes('balloon')) return '🫧';
  if (t.includes('solar') || t.includes('sun')) return '☀️';
  if (t.includes('bicycle') || t.includes('gyro') || t.includes('spinning')) return '🚲';
  if (t.includes('glow') || t.includes('light') || t.includes('led')) return '✨';
  if (t.includes('tin') || t.includes('can')) return '🥫';
  if (t.includes('paper')) return '📄';
  if (t.includes('match')) return '🔥';
  if (t.includes('water') || t.includes('hydro')) return '💦';
  if (t.includes('air') || t.includes('wind')) return '💨';
  if (t.includes('sound') || t.includes('music') || t.includes('whistle')) return '🔊';
  if (t.includes('balance') || t.includes('tipping') || t.includes('topple')) return '⚖️';
  if (t.includes('rocket') || t.includes('balloon')) return '🚀';
  return '🔬';
}

export default function ToysPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const toyCategories = categories.toys;

  // URL param handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const q = params.get('q');
    if (cat) setSelectedCategory(cat);
    if (q) setSearchQuery(q);
    setVisible(true);
  }, []);

  const filteredToys = useMemo(() => {
    return toys.filter((toy) => {
      const matchesCategory = !selectedCategory || toy.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        toy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        toy.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = !difficultyFilter || toy.difficulty === difficultyFilter;
      return matchesCategory && matchesSearch && matchesDifficulty;
    });
  }, [selectedCategory, searchQuery, difficultyFilter]);

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
                color: link.href === '/toys' ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '15px', fontWeight: 600,
                background: link.href === '/toys' ? 'rgba(200,83,26,0.08)' : 'transparent',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            🧪 Science Toys
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            {toys.length.toLocaleString()} toys across 24 categories · Make science from trash
          </p>
        </div>

        {/* Search + Filters */}
        <div style={{ marginBottom: '32px' }}>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '20px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search toys by name or description..."
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
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
              All
            </button>
            {toyCategories.map(cat => {
              const color = toyCatColors[cat.id] || 'var(--accent)';
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

          {/* Difficulty filter */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
              <button
                key={d || 'All'}
                onClick={() => setDifficultyFilter(d || null)}
                style={{
                  padding: '5px 12px', borderRadius: '100px', border: '1px solid',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
                  borderColor: difficultyFilter === (d || null) ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: difficultyFilter === (d || null) ? 'var(--accent)' : 'transparent',
                  color: difficultyFilter === (d || null) ? 'white' : 'var(--text-muted)',
                }}
              >
                {d || 'All Levels'}
              </button>
            ))}
          </div>
        </div>

        {/* Results info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filteredToys.length.toLocaleString()}</strong> toys
            {selectedCategory && <> in <strong style={{ color: 'var(--accent)' }}>{toyCategories.find(c => c.id === selectedCategory)?.label}</strong></>}
            {searchQuery && <> matching "<strong style={{ color: 'var(--text)' }}>{searchQuery}</strong>"</>}
          </p>
          {(selectedCategory || searchQuery || difficultyFilter) && (
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); setDifficultyFilter(null); }}
              style={{ fontSize: '13px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Toy grid */}
        {filteredToys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No toys found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredToys.map((toy, i) => {
              const cat = toyCategories.find(c => c.id === toy.category);
              const color = toyCatColors[toy.category] || 'var(--accent)';
              const emoji = getToyEmoji(toy.title);
              const IconComp = iconMap[toy.icon] || Puzzle;

              return (
                <div
                  key={toy.id}
                  className="card-hover animate-fade-up"
                  style={{
                    background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
                    padding: '20px', opacity: visible ? 0 : 1,
                    animationDelay: `${Math.min(i * 15, 300)}ms`,
                    animationFillMode: 'forwards',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = color;
                    el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.06)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--border)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', flexShrink: 0,
                    }}>
                      {emoji}
                    </div>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '100px',
                      fontSize: '11px', fontWeight: 600,
                      background: toy.difficulty === 'Beginner' ? '#22c55e15' : toy.difficulty === 'Intermediate' ? '#f9731615' : '#ef444415',
                      color: toy.difficulty === 'Beginner' ? '#22c55e' : toy.difficulty === 'Intermediate' ? '#f97316' : '#ef4444',
                    }}>
                      {toy.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.3 }}>
                    {toy.title}
                  </h3>

                  {/* Category + Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComp size={12} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{cat?.label || toy.category}</span>
                    </div>
                    <a
                      href={toy.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        color: color, fontSize: '13px', fontWeight: 600,
                        textDecoration: 'none', cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
                    >
                      View <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
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