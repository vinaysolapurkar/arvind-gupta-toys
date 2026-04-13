# Arvind Gupta Toys — SPEC.md

## 1. Concept & Vision

A world-class PWA celebrating Arvind Gupta's "Toys from Trash" mission — transforming waste into wonder through hands-on science. The platform feels like a premium museum exhibit meets a cozy science lab at night: dark, warm, inviting, and deeply educational. It serves as a digital archive and discovery platform for free science toys, films, and books that empower children to learn by making.

The soul of the site: **"Science is not locked in textbooks — it's in your hands, made from trash."**

---

## 2. Design Language

### Aesthetic Direction
Warm scientific dark — like a well-lit maker space at dusk. Deep charcoal backgrounds with ember-orange accents evoking the warmth of creation and discovery. Card-based content organized like exhibits in a science museum.

### Color Palette
```
--bg-deep:        #1a1612   (darkest charcoal-brown)
--bg-card:        #242019   (card surfaces)
--bg-elevated:    #2e2820   (hover states, elevated surfaces)
--accent:         #c8531a   (deep orange — Arvind's signature)
--accent-light:   #e8763f   (lighter orange for hover)
--accent-glow:    #ff6b2b   (glowing orange for CTAs)
--cream:          #f5f0e8   (primary text)
--cream-muted:    #b8b0a0   (secondary text)
--border:         #3a3228   (subtle borders)
--success:        #5a9e6f   (positive states)
```

### Typography
- **Display/Headings:** Playfair Display (serif, weight 700/900) — warm, authoritative, classic
- **Body/UI:** DM Sans (sans-serif, weight 400/500/600) — clean, readable, modern
- **Monospace accents:** JetBrains Mono — for any code/technical labels
- Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64px

### Spatial System
- Base unit: 4px
- Card padding: 24px
- Section gaps: 64px
- Border radius: 12px (cards), 8px (buttons), 4px (tags)

### Motion Philosophy
- **Entrance:** Staggered fade-up on scroll (opacity 0→1, translateY 20px→0, 500ms ease-out, 80ms stagger)
- **Hover:** Scale 1.02 + shadow lift on cards, 200ms ease
- **Page transitions:** Fade 300ms
- **Ambient:** Subtle glow pulse on accent elements
- Respect `prefers-reduced-motion`

### Visual Assets
- **Icons:** Lucide React (consistent stroke, 1.5px weight)
- **Images:** Category illustrations (SVG-based inline graphics), Unsplash for hero
- **Decorative:** Subtle dot-grid pattern overlay on hero, warm gradient meshes

---

## 3. Layout & Structure

### Page Architecture

```
/                    → Landing (Hero + 3 sections + Footer)
/toys               → All 24 categories with search/filter
/toys/[category]     → Category detail with toy cards
/films               → Films library by category
/films/[category]    → Category films with video player
/books               → Books library with archive.org links
```

### Global Layout
- **Header:** Fixed, 64px height, logo left + nav center + search right. Blur backdrop on scroll.
- **Navigation:** 3 main tabs (Books | Toys | Films) + category dropdowns
- **Footer:** Minimal — tagline, credits, external links
- **Mobile:** Hamburger menu, bottom nav bar for section switching

### Visual Pacing
- Hero: Full viewport, generous whitespace, single focal CTA
- Section index pages: Grid of cards (3 cols desktop, 2 tablet, 1 mobile)
- Detail pages: Split layout (content left, metadata right on desktop)

---

## 4. Features & Interactions

### Core Features

**Search**
- Global search bar (header) — filters toys/books/films by title/keyword
- Real-time results as user types (300ms debounce)
- Search modal overlay on mobile
- Keyboard shortcut: `/` or `Cmd+K`

**Category Navigation**
- 24 toy categories as filterable chips
- Multi-select filter support
- URL reflects active filters (`/toys?category=air-water,math-magic`)

**Toys Section**
- Card grid with: illustration/icon, title, short description, difficulty badge
- Hover: card lifts, reveals "Explore →" CTA
- Each toy links to source or has build instructions

**Films Section**
- YouTube embed player (responsive 16:9)
- Category sidebar/tabs
- Video metadata: title, duration, category tag
- Lazy-load iframes for performance

**Books Section**
- Cards linking to archive.org/public domain sources
- Author, subject tags, year
- External link icon, opens in new tab

**Offline Support (PWA)**
- Service worker caches: shell, static assets, recently viewed content
- Offline fallback page
- Install prompt for mobile

### Interaction Details
- Card click → navigate or expand
- Filter chips → instant filter (no page reload)
- Video play → load iframe on click (not on page load) for performance
- Search → dropdown results, click to navigate
- Error states: warm illustrated empty states, not cold 404s
- Loading: skeleton cards matching content shape

---

## 5. Component Inventory

### Header
- States: default, scrolled (backdrop blur + shadow), mobile-expanded
- Logo: text mark "Arvind Gupta Toys" in Playfair Display
- Nav: horizontal on desktop, drawer on mobile
- Search: expands on focus, collapses on blur with content

### ToyCard
- States: default, hover (lift + glow border), loading (skeleton)
- Visual: icon/illustration top, title, description snippet, difficulty badge
- Difficulty badges: Beginner (green), Intermediate (orange), Advanced (red)

### FilmCard
- States: default, hover, playing
- Visual: thumbnail with play overlay, title, duration, category tag
- Click → loads embedded player in card or navigates to detail

### BookCard
- States: default, hover
- Visual: book cover or illustrative icon, title, author, subject tags
- External link arrow indicator

### CategoryChip
- States: default, selected, hover
- Pill shape, icon + label
- Selected: filled accent color, unchecked: outline

### SearchModal
- Full-screen overlay on mobile, dropdown on desktop
- Recent searches, live results
- Keyboard navigation support

### VideoPlayer
- Responsive iframe wrapper
- Custom play button overlay
- Loading skeleton until iframe loads

### NavigationTabs
- 3 tabs: Books, Toys, Films
- Active: accent underline, bold text
- Hover: subtle background shift

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v4 + CSS variables for theming
- **Fonts:** next/font with Google Fonts (Playfair Display, DM Sans)
- **Icons:** lucide-react
- **Animations:** Framer Motion for entrance animations, CSS for micro-interactions
- **PWA:** next-pwa or manual service worker
- **Deployment:** Vercel (static export or ISR)

### Architecture
```
app/
  layout.tsx         → Root layout with fonts, header, footer
  page.tsx          → Landing page
  toys/
    page.tsx        → All toys
    [category]/
      page.tsx      → Category detail
  films/
    page.tsx        → Films library
    [category]/
      page.tsx      → Category films
  books/
    page.tsx        → Books library
components/
  Header.tsx
  Footer.tsx
  ToyCard.tsx
  FilmCard.tsx
  BookCard.tsx
  CategoryChip.tsx
  SearchModal.tsx
  VideoPlayer.tsx
  ui/               → Shared primitives (Button, Badge, Card)
lib/
  data.ts           → Static data for toys, films, books
  categories.ts     → Category definitions
public/
  manifest.json
  sw.js             → Service worker
  icons/            → PWA icons
```

### Data Strategy
- Static JSON data files (no database needed for MVP)
- Toys, films, books defined in `/lib/data.ts`
- Categories sourced from the Arvind Gupta Toys site context

### PWA Requirements
- `manifest.json` with name, icons, theme color (#c8531a), display: standalone
- Service worker for offline caching of shell + static assets
- `theme-color` meta tag matching brand orange

### Performance
- YouTube iframes: load on click (facade pattern)
- Images: next/image with lazy loading
- Fonts: preloaded, swap display
- Code splitting: per-route bundles
