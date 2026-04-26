'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Archive } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  archiveUrl: string;
  subjects: string[];
  year: number;
  description: string;
}

const subjectColors: Record<string, string> = {
  'Science toys': '#c8531a',
  'DIY': '#22c55e',
  'Education': '#8b5cf6',
  'Science': '#0ea5e9',
  'Children': '#f97316',
  'Experiments': '#14b8a6',
  'Physics': '#eab308',
  'Chemistry': '#8b5cf6',
  'Biology': '#22c55e',
  'Electronics': '#06b6d4',
  'Engineering': '#ef4444',
  'Making': '#f59e0b',
  'Craft': '#ec4899',
  'Magic': '#a855f7',
  'Encyclopedia': '#6366f1',
  'Default': '#64748b',
};

function getSubjectColor(subject: string): string {
  return subjectColors[subject] || subjectColors['Default'];
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/books.json')
      .then(r => r.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      )
    : books;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading books...</p>
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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            📚 Free Books
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '560px' }}>
            Public domain science books from Internet Archive and Project Gutenberg. Free to read, free to share.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: '12px',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              color: 'var(--text)', fontSize: '15px', outline: 'none',
            }}
          />
        </div>

        {/* Stats banner */}
        <div style={{
          display: 'flex', gap: '24px', marginBottom: '40px',
          padding: '20px 24px', background: 'var(--bg-card)', borderRadius: '14px',
          border: '1px solid var(--border)',
        }}>
          {[
            { label: 'Books', value: books.length },
            { label: 'Showing', value: filtered.length },
            { label: 'Archive.org', value: 0 },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>{stat.value || books.length}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <a
            href="https://archive.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '10px',
              background: 'var(--accent)', color: 'white',
              textDecoration: 'none', fontSize: '14px', fontWeight: 600,
            }}
          >
            Browse Archive.org <ExternalLink size={14} />
          </a>
        </div>

        {/* Books grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Books coming soon</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Check back soon for free public domain science books</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filtered.slice(0, 200).map((book, i) => {
              const primaryColor = getSubjectColor(book.subjects[0] || 'Default');
              return (
                <a
                  key={book.id}
                  href={book.archiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="card-hover animate-fade-up"
                    style={{
                      background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
                      padding: '24px', height: '100%', display: 'flex', flexDirection: 'column',
                      opacity: 0, animationDelay: `${i * 60}ms`, animationFillMode: 'forwards',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = primaryColor; el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.06)`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.boxShadow = 'none'; }}
                  >
                    {/* Book icon + year */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <BookOpen size={24} style={{ color: primaryColor }} />
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: '100px',
                        fontSize: '11px', fontWeight: 600,
                        background: 'var(--bg-elevated)', color: 'var(--text-muted)',
                      }}>
                        {book.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.3 }}>
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      by {book.author}
                    </p>

                    {/* Description */}
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                      {book.description}
                    </p>

                    {/* Subjects */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {book.subjects.map(subj => (
                        <span
                          key={subj}
                          style={{
                            padding: '3px 10px', borderRadius: '100px',
                            fontSize: '11px', fontWeight: 600,
                            background: `${getSubjectColor(subj)}15`, color: getSubjectColor(subj),
                          }}
                        >
                          {subj}
                        </span>
                      ))}
                    </div>

                    {/* Read link */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: '14px', borderTop: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Archive size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Internet Archive</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: primaryColor, fontSize: '13px', fontWeight: 600 }}>
                        Read free <ExternalLink size={13} />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
        {filtered.length > 200 && (
          <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
            Showing 200 of {filtered.length} books. Use the search bar to find specific books.
          </p>
        )}

        {/* CTA */}
        <div style={{
          marginTop: '48px', padding: '40px', borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-glow) 100%)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
            Want more free books?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
            Internet Archive has millions of free public domain books. Browse by subject.
          </p>
          <a
            href="https://archive.org/search?query=science+experiments+children"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '10px',
              background: 'white', color: 'var(--accent)', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700,
            }}
          >
            Search Archive.org <ExternalLink size={14} />
          </a>
        </div>
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