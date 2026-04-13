'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const navLinks = [
  { href: '/toys', label: 'Toys' },
  { href: '/films', label: 'Films' },
  { href: '/books', label: 'Books' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/toys?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: scrolled ? 'rgba(26, 22, 18, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              🧪
            </div>
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
              }}
            >
              Arvind Gupta Toys
            </span>
          </div>
        </Link>

        <nav
          style={{
            display: 'flex',
            gap: '8px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--cream-muted)',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--cream)';
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--cream-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--cream-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--cream-muted)';
            }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--cream-muted)',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            zIndex: 99,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--cream)',
                fontSize: '16px',
                fontWeight: 500,
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div
          onClick={() => { setSearchOpen(false); setQuery(''); }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '120px',
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSearch}
            style={{
              width: '100%',
              maxWidth: '560px',
              margin: '0 16px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid var(--border)',
                gap: '12px',
              }}
            >
              <Search size={20} style={{ color: 'var(--cream-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search toys, films, books..."
                autoFocus
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--cream)',
                  fontSize: '16px',
                }}
              />
              <kbd
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--cream-muted)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                ESC
              </kbd>
            </div>
            <div style={{ padding: '16px' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--cream)',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
