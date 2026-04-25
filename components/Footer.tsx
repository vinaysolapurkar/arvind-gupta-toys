import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        padding: '48px 24px 32px',
        marginTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              🧪
            </div>
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--cream)',
              }}
            >
              Arvind Gupta Toys
            </span>
          </div>
          <p
            style={{
              color: 'var(--cream-muted)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '280px',
            }}
          >
            Science is not locked in textbooks — it&apos;s in your hands, made from
            trash. Free learning for every child.
          </p>
        </div>

        <div>
          <h4
            style={{
              color: 'var(--cream)',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Explore
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { href: '/toys', label: 'Science Toys' },
              { href: '/films', label: 'Experiment Films' },
              { href: '/books', label: 'Free Books' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: 'var(--cream-muted)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4
            style={{
              color: 'var(--cream)',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Resources
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { href: 'https://web.archive.org/web/2024/https://www.arvindguptatoys.com', label: 'Arvind Gupta Toys (Archived)' },
              { href: 'https://archive.org', label: 'Internet Archive' },
              { href: 'https://www.gutenberg.org', label: 'Project Gutenberg' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--cream-muted)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream-muted)')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <p
          style={{
            color: 'var(--cream-muted)',
            fontSize: '13px',
          }}
        >
          Made with ♥ for curious minds everywhere
        </p>
        <p
          style={{
            color: 'var(--cream-muted)',
            fontSize: '13px',
          }}
        >
          Inspired by Arvind Gupta
        </p>
      </div>
    </footer>
  );
}
