'use client';

import Link from 'next/link';
import { Award, BookOpen, Film, Globe, GraduationCap, Heart, Lightbulb, MapPin, Play, School, Star, Users, Wrench } from 'lucide-react';
import Header from '@/components/Header';

const TIMELINE = [
  { year: '1953', event: 'Born on December 4th in India', icon: Star },
  { year: '1975', event: 'Graduated from IIT Kanpur with a degree in Engineering', icon: GraduationCap },
  { year: '1975', event: 'Joined TELCO (now Tata Motors) as an engineer', icon: Wrench },
  { year: '1978', event: 'Took study leave to work with the Hoshangabad Science Teaching Programme in rural Madhya Pradesh — a turning point', icon: Lightbulb },
  { year: '1978+', event: 'Began creating science toys from everyday waste materials — matchsticks, paper, bottles, straws — to teach children in tribal villages', icon: Heart },
  { year: '1980s', event: 'Published "Matchstick Models and other Science Experiments" — translated into 12 languages, sold 500,000+ copies', icon: BookOpen },
  { year: '1990s-2000s', event: 'Visited 3,000+ schools across India, spreading hands-on science education', icon: School },
  { year: '2003', event: 'Launched arvindguptatoys.com — making all books, films, and toy designs freely available to the world', icon: Globe },
  { year: '2010', event: 'TED talk "Turning Trash into Toys for Learning" — ranked among the top 10 TED talks globally', icon: Play },
  { year: '2008', event: 'Indira Gandhi Award for Science Popularization by INSA', icon: Award },
  { year: '2009', event: 'One-India One-People Award', icon: Award },
  { year: '2016', event: 'Distinguished Math Teacher Award by AMTI', icon: Award },
  { year: '2018', event: 'Padma Shri — India\'s fourth-highest civilian award, for his contribution to science education', icon: Award },
  { year: '2024', event: 'Honorary D.Sc. degree from Uttarakhand Technical University', icon: GraduationCap },
];

const STATS = [
  { number: '3,000+', label: 'Schools Visited', icon: School },
  { number: '6,200+', label: 'Films Created', icon: Film },
  { number: '2,000+', label: 'Books Translated', icon: BookOpen },
  { number: '18', label: 'Languages', icon: Globe },
  { number: '500K+', label: 'Copies of First Book Sold', icon: Users },
  { number: '40+', label: 'Years of Service', icon: Heart },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Header />
      <div style={{ height: '64px' }} />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(135deg, #c8531a 0%, #d4772a 50%, #e89a3a 100%)',
          padding: '80px 24px 64px', textAlign: 'center',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'white', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '60px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>
              🧪
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900,
              color: 'white', letterSpacing: '-0.03em',
              lineHeight: 1.1, marginBottom: '16px',
            }}>
              Arvind Gupta
            </h1>
            <p style={{
              fontSize: '20px', color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 8px',
            }}>
              The man who turns trash into science toys
            </p>
            <p style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic',
            }}>
              Padma Shri Awardee · IIT Kanpur Alumni · Science Educator
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <p style={{
          fontSize: '20px', lineHeight: 1.8, color: 'var(--text)',
          textAlign: 'center', marginBottom: '32px',
        }}>
          Arvind Gupta is an Indian toy inventor and science educator who has spent over four decades
          teaching children the joy of science through toys made from everyday waste materials —
          matchsticks, paper, bottles, straws, and other items usually thrown away as trash.
        </p>
        <p style={{
          fontSize: '18px', lineHeight: 1.8, color: 'var(--text-muted)',
          textAlign: 'center', marginBottom: '32px',
        }}>
          An IIT Kanpur graduate, he gave up a comfortable engineering career to work in tribal villages
          of Madhya Pradesh, where he discovered that simple handmade toys could spark a child&apos;s
          curiosity more powerfully than any textbook. That discovery became his life&apos;s mission.
        </p>
        <blockquote style={{
          borderLeft: '4px solid #c8531a',
          paddingLeft: '24px', margin: '40px 0',
          fontSize: '22px', fontStyle: 'italic',
          color: 'var(--text)', lineHeight: 1.6,
        }}>
          &ldquo;Allow children the freedom to break things. That is how they are going to learn.&rdquo;
          <div style={{ fontSize: '14px', fontStyle: 'normal', color: 'var(--text-muted)', marginTop: '8px' }}>
            — Arvind Gupta
          </div>
        </blockquote>
      </section>

      {/* Impact Stats */}
      <section style={{
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', padding: '64px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px', fontWeight: 800, textAlign: 'center',
            color: 'var(--text)', marginBottom: '48px',
          }}>
            A Lifetime of Impact
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
          }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: '#c8531a15', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <stat.icon size={24} style={{ color: '#c8531a' }} />
                </div>
                <div style={{
                  fontSize: '28px', fontWeight: 900,
                  color: '#c8531a', marginBottom: '4px',
                }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* His Story */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{
          fontSize: '28px', fontWeight: 800, color: 'var(--text)',
          marginBottom: '24px',
        }}>
          The Story
        </h2>

        <div style={{ fontSize: '17px', lineHeight: 1.9, color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '20px' }}>
            In 1978, a young engineer from IIT Kanpur named Arvind Gupta took a year&apos;s leave from
            his job at TELCO (now Tata Motors) to volunteer in Hoshangabad, a tribal district in
            Madhya Pradesh. He joined a grassroots science teaching programme for children who had
            never seen a laboratory or held a science textbook.
          </p>
          <p style={{ marginBottom: '20px' }}>
            There, he made a discovery that would change his life. Using matchsticks, cycle valve tubes,
            old newspapers, and discarded bottles, he created simple toys that demonstrated scientific
            principles — air pressure, gravity, electricity, magnetism. The children were mesmerized.
            A matchstick model taught them more about geometry than a month of lectures.
          </p>
          <p style={{ marginBottom: '20px' }}>
            He never went back to his engineering career. Instead, he dedicated his life to
            making science accessible, joyful, and free for every child in India — and eventually,
            the world.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Over the next four decades, Gupta visited more than 3,000 schools, created 6,200 short
            films demonstrating toy-making in 18 languages, translated over 2,000 books into Hindi,
            and built arvindguptatoys.com — a website offering everything for free, from science
            experiment guides to children&apos;s literature from around the world.
          </p>
          <p style={{ marginBottom: '20px' }}>
            His first book, &ldquo;Matchstick Models and Other Science Experiments,&rdquo; was translated
            into 12 Indian languages and sold over 500,000 copies. His TED talk,
            &ldquo;Turning Trash into Toys for Learning,&rdquo; became one of the top 10 TED talks
            globally and was featured in Sir Ken Robinson&apos;s compilation of the best education talks.
          </p>
          <p>
            In 2018, the Government of India honored him with the Padma Shri, the country&apos;s
            fourth-highest civilian award, for his extraordinary contribution to science education.
          </p>
        </div>
      </section>

      {/* TED Talk */}
      <section style={{
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', padding: '64px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px', fontWeight: 800, color: 'var(--text)',
            marginBottom: '12px',
          }}>
            Watch His Famous TED Talk
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Ranked among the top 10 TED talks globally
          </p>
          <div style={{
            position: 'relative', paddingBottom: '56.25%',
            height: 0, overflow: 'hidden', borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            <iframe
              src="https://www.youtube.com/embed/JtcP-THdi9A"
              title="Arvind Gupta TED Talk"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', border: 'none',
              }}
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{
          fontSize: '28px', fontWeight: 800, color: 'var(--text)',
          marginBottom: '48px', textAlign: 'center',
        }}>
          Journey & Awards
        </h2>
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '20px', top: '8px', bottom: '8px',
            width: '2px', background: 'var(--border)',
          }} />

          {TIMELINE.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px', marginBottom: '32px',
              position: 'relative',
            }}>
              {/* Dot */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: i === TIMELINE.length - 1 ? '#c8531a' : 'var(--bg-card)',
                border: `2px solid ${i === TIMELINE.length - 1 ? '#c8531a' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
              }}>
                <item.icon size={16} style={{
                  color: i === TIMELINE.length - 1 ? 'white' : '#c8531a',
                }} />
              </div>
              {/* Content */}
              <div style={{ paddingTop: '8px' }}>
                <div style={{
                  fontSize: '14px', fontWeight: 700, color: '#c8531a',
                  marginBottom: '4px',
                }}>
                  {item.year}
                </div>
                <div style={{
                  fontSize: '16px', color: 'var(--text)', lineHeight: 1.5,
                }}>
                  {item.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Quote */}
      <section style={{
        background: 'linear-gradient(135deg, #c8531a 0%, #d4772a 100%)',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <blockquote style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: 'white', lineHeight: 1.6,
            fontStyle: 'italic', marginBottom: '16px',
          }}>
            &ldquo;I have seen the poorest of children with no shoes, no notebooks, light up with joy
            when they make a toy that works. That moment — that is education.&rdquo;
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
            — Arvind Gupta
          </p>
        </div>
      </section>

      {/* This Website */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '28px', fontWeight: 800, color: 'var(--text)',
          marginBottom: '16px',
        }}>
          About This Website
        </h2>
        <p style={{
          fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.8,
          marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px',
        }}>
          This website is an independent preservation effort. All 8,197 books, 1,311 toys, and
          2,860 films from arvindguptatoys.com have been preserved on the Internet Archive and
          organized into a searchable, browsable collection — ensuring Arvind Gupta&apos;s life&apos;s
          work remains freely accessible forever.
        </p>
        <p style={{
          fontSize: '15px', color: 'var(--text-muted)', marginBottom: '32px',
        }}>
          No login required. No fees. Free forever — just as he intended.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/books" style={{
            padding: '12px 24px', borderRadius: '12px',
            background: '#c8531a', color: 'white',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
          }}>
            Browse Books
          </Link>
          <Link href="/toys" style={{
            padding: '12px 24px', borderRadius: '12px',
            border: '2px solid var(--border)', color: 'var(--text)',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
          }}>
            Explore Toys
          </Link>
          <Link href="/films" style={{
            padding: '12px 24px', borderRadius: '12px',
            border: '2px solid var(--border)', color: 'var(--text)',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
          }}>
            Watch Films
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Inspired by{' '}
          <a href="https://web.archive.org/web/2024/https://www.arvindguptatoys.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c8531a', textDecoration: 'none', fontWeight: 600 }}>
            arvindguptatoys.com
          </a>
          {' '}· Preserved on Internet Archive · Free forever
        </p>
      </footer>
    </div>
  );
}
