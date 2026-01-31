# AI Website Builders - Design System

> **Version:** 1.0
> **Date:** 2026-01-17
> **Status:** READY FOR IMPLEMENTATION
>
> Based on visual analysis of 3 competitors (21 screenshots analyzed)

---

## QUICK REFERENCE

| Category | Value | Source |
|----------|-------|--------|
| Background | `#f8f5f0` | ToolTester |
| Primary Blue | `#3B82F6` | Codelessly |
| Text Primary | `#1f2937` | WBE |
| Font Family | `Inter` | WBE/Codelessly |
| Base Spacing | `4px` unit | All |
| Card Radius | `12px` | ToolTester |
| Shadow Hover | `0 10px 15px rgba(0,0,0,0.1)` | All |

---

## 1. DESIGN TOKENS

### Colors
```css
:root {
  /* === BACKGROUNDS === */
  --color-bg: #f8f5f0;              /* Warm cream - unique */
  --color-bg-alt: #ffffff;          /* White for cards */
  --color-bg-dark: #1e1b4b;         /* Footer indigo */

  /* === PRIMARY === */
  --color-primary: #3B82F6;         /* Modern blue */
  --color-primary-dark: #2563EB;    /* Blue hover */
  --color-secondary: #ec4899;       /* Accent pink */
  --color-accent: #10B981;          /* Success green */

  /* === TEXT === */
  --color-text: #1f2937;            /* Primary text */
  --color-text-muted: #6b7280;      /* Secondary */
  --color-text-light: #9ca3af;      /* Tertiary */
  --color-text-inverse: #ffffff;     /* On dark */

  /* === BORDERS === */
  --color-border: #e5e7eb;
  --color-divider: #f3f4f6;

  /* === SEMANTIC === */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### Typography
```css
:root {
  /* === FONT FAMILY === */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* === SIZES === */
  --text-hero: 3.75rem;      /* 60px */
  --text-h1: 2.5rem;         /* 40px */
  --text-h2: 2rem;           /* 32px */
  --text-h3: 1.5rem;         /* 24px */
  --text-xl: 1.25rem;        /* 20px */
  --text-lg: 1.125rem;       /* 18px */
  --text-base: 1rem;         /* 16px */
  --text-sm: 0.875rem;       /* 14px */
  --text-xs: 0.75rem;        /* 12px */

  /* === WEIGHTS === */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* === LINE HEIGHTS === */
  --leading-tight: 1.1;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
}
```

### Spacing (4px base unit)
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### Border Radius
```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### Shadows
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

### Transitions
```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

---

## 2. COMPONENT LIBRARY

### Button
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg);
  border-color: var(--color-text-muted);
}

.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}
```

### Card
```css
.card {
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  transition: all var(--transition-slow);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-h3);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

.card-excerpt {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: var(--leading-normal);
  margin-bottom: var(--space-4);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.card-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--color-primary);
  color: #ffffff;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-3);
}
```

### Table
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.table thead {
  background: var(--color-bg);
}

.table th {
  padding: var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-border);
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.table tr:hover td {
  background: var(--color-bg);
}

.table-check { color: var(--color-success); font-size: 18px; }
.table-cross { color: var(--color-error); font-size: 18px; }
```

### Score Display
```css
.score {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.score-number.excellent { color: var(--color-success); }
.score-number.good { color: var(--color-primary); }
.score-number.average { color: var(--color-warning); }
.score-number.poor { color: var(--color-error); }

.score-stars {
  display: flex;
  gap: var(--space-1);
}

.star {
  color: #D1D5DB;
  font-size: 20px;
}

.star.filled {
  color: var(--color-warning);
}

.score-meter {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin: var(--space-3) 0;
}

.score-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width var(--transition-slow);
}
```

---

## 3. LAYOUT PATTERNS

### Container
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.container-narrow {
  max-width: 800px;
}

.container-wide {
  max-width: 1400px;
}
```

### Section
```css
.section {
  padding: var(--space-16) 0;
}

.section-bg {
  background: var(--color-bg);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}
```

### Grid
```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

---

## 4. IMPLEMENTATION CHECKLIST

### Before Building
- [ ] Install Inter font
- [ ] Set up Tailwind config with custom colors
- [ ] Create design-tokens.css file
- [ ] Test color contrast ratios (4.5:1 minimum)

### During Building
- [ ] Use design tokens for ALL values
- [ ] No arbitrary pixel values
- [ ] Maintain 4px spacing unit
- [ ] Test on mobile breakpoints

### Before Shipping
- [ ] Visual match with reference screenshots
- [ ] All hover states work
- [ ] Mobile responsive
- [ ] Accessibility check (keyboard nav, ARIA)

---

## 5. ASTRO + TAILWIND SETUP

### tailwind.config.js
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#f8f5f0',
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        text: {
          DEFAULT: '#1f2937',
          muted: '#6b7280',
          light: '#9ca3af',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
    },
  },
}
```

### Base CSS (src/styles/global.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* All design tokens here */
}

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  color: #1f2937;
  background: #f8f5f0;
}
```

---

## 6. QUALITY STANDARDS

### Visual Matching Targets
- Spacing: Within 2px of reference
- Colors: Exact hex match
- Typography: Exact font size/weight
- Borders: Exact radius values

### Performance Targets
- First paint: < 1s
- Interactive: < 2s
- Lighthouse: > 90

### Accessibility Targets
- Color contrast: AA (4.5:1)
- Keyboard nav: Full support
- ARIA labels: All interactive elements
- Screen reader: Compatible

---

## DOCUMENTATION INDEX

| Document | Location | Purpose |
|----------|----------|---------|
| Phase 1 | `/analysis/phase-1-site-structure-analysis.md` | Site structures |
| Phase 2 | `/screenshots/references/` | 21 screenshots |
| Phase 3 | `/specs/` | Component specs |
| Phase 4 | `/analysis/phase-4-cross-competitor-analysis.md` | Synthesis |
| This | `/final-specs/design-system.md` | Master spec |

---

**Status: ✅ READY FOR BUILD PHASE**

All 5 research phases complete. Ready to initialize Astro project and begin implementation.
