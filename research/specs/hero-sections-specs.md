# Hero Sections - Design Specifications

> **Date:** 2026-01-17
> **Source:** Screenshots from competitor homepages
> **Components:** Hero sections from Codelessly.dev, ToolTester, WBE

---

## Codelessly.dev Hero

**Design Philosophy:** Modern, dramatic, minimal

### Design Tokens
```css
:root {
  /* Colors */
  --color-background: #000000; /* Dark mountain background */
  --color-overlay: rgba(0, 0, 0, 0.4);
  --color-white: #FFFFFF;
  --color-gray-300: #D1D5DB;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --text-6xl: 3.75rem; /* 60px - Hero heading */
  --text-xl: 1.25rem; /* 20px - Subheading */
  --text-base: 1rem; /* 16px - Input/buttons */
  --text-sm: 0.875rem; /* 14px - Small text */
  --font-weight-bold: 700;
  --font-weight-medium: 500;

  /* Spacing */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */

  /* Radius */
  --radius-md: 0.5rem; /* 8px */
  --radius-lg: 0.75rem; /* 12px */

  /* Shadows */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Key Layout
```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 24px;
  position: relative;
}

.hero-heading {
  font-size: 60px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
  line-height: 1.2;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 16px 24px;
  border-radius: 12px;
  background: #FFFFFF;
  font-size: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

**What to Copy:**
- Full-screen dramatic hero with dark overlay on image
- Centered prompt input with generous padding
- Clean, minimal navigation
- Large hero heading (60px)
- Modern button styles

---

## WebsiteToolTester Hero

**Design Philosophy:** Professional, trust-focused, content-driven

### Design Tokens
```css
:root {
  /* Colors */
  --color-background: #f8f5f0; /* Light cream/ivory */
  --color-header: #1a1a1a;
  --color-text-primary: #2d2d2d;
  --color-text-secondary: #666666;
  --color-text-light: #ffffff;
  --color-accent: #007bff;
  --color-accent-hover: #0056b3;

  /* Typography */
  --font-primary: 'Arial', sans-serif;
  --font-logo: 'Montserrat', sans-serif;
  --font-size-5xl: 3rem; /* 48px */
  --font-size-xl: 1.25rem; /* 20px */
  --font-size-base: 1rem; /* 16px */

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: calc(var(--spacing-unit) * 3.5); /* 28px */
  --spacing-10: calc(var(--spacing-unit) * 5); /* 40px */

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Key Layout
```css
.header {
  background-color: #f8f5f0;
  padding: 28px 40px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: #2d2d2d;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}
```

**What to Copy:**
- Light cream background (#f8f5f0) - unique, warm
- Clear navigation with hover effects
- Language selector
- Search icon
- Professional, approachable feel

---

## WebsiteBuilderExpert Hero

**Design Philosophy:** Corporate, comprehensive, article-focused

### Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #4a46e6; /* Logo blue */
  --color-secondary: #ec4899; /* Logo pink */
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-background: #ffffff;
  --color-background-alt: #f9fafb;
  --color-border: #e5e7eb;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-h1: 2.25rem; /* 36px */
  --font-size-h4: 1.125rem; /* 18px */
  --font-size-body: 1rem; /* 16px */

  /* Spacing */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */

  /* Radius */
  --radius-md: 0.25rem; /* 4px */
  --radius-lg: 0.5rem; /* 8px */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Key Layout
```css
.header {
  background-color: #ffffff;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  color: #1f2937;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #4a46e6 0%, #ec4899 100%);
  border-radius: 8px;
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #1f2937;
}
```

**What to Copy:**
- Gradient logo icon (blue to pink)
- Clean white background
- Subtle border on header
- Dropdown indicators on nav
- Subscribe button style

---

## CROSS-COMPETITOR ANALYSIS

### Spacing Comparison
| Component | Codelessly | ToolTester | WBE | Best Choice |
|-----------|-----------|------------|-----|-------------|
| Hero padding | 0 24px | 28px 40px | 24px 32px | WBE (balanced) |
| Nav gap | 24px | 32px | 24px | ToolTester (breathing room) |
| Button padding | 8px 16px | 8px 16px | 8px 16px | All same |

### Typography Comparison
| Element | Codelessly | ToolTester | WBE | Best Choice |
|---------|-----------|------------|-----|-------------|
| Hero size | 60px | 48px | 36px | Codelessly (dramatic) |
| Body size | 16px | 16px | 16px | All same |
| Nav size | 16px | 16px | 16px | All same |

### Color Comparison
| Usage | Codelessly | ToolTester | WBE | Best Choice |
|-------|-----------|------------|-----|-------------|
| Background | Dark (#000) | Cream (#f8f5f0) | White (#fff) | ToolTester (unique) |
| Primary | Blue (#3B82F6) | Blue (#007bff) | Blue (#4a46e6) | Codelessly (modern) |
| Text | White (#FFF) | Dark (#2d2d2d) | Gray-dark (#1f2937) | WBE (readable) |

---

## OUR RECOMMENDED HERO SPEC

### Combined Best Practices
```css
:root {
  /* Colors - Best of each */
  --color-bg: #f8f5f0; /* ToolTester's warm cream */
  --color-primary: #3B82F6; /* Codelessly's modern blue */
  --color-text: #1f2937; /* WBE's readable dark */
  --color-text-secondary: #6b7280;
  --color-white: #ffffff;
  --color-border: #e5e7eb;

  /* Typography - Codelessly scale */
  --font-family: 'Inter', -apple-system, sans-serif;
  --text-hero: 3.75rem; /* 60px - Codelessly dramatic */
  --text-h1: 2.5rem; /* 40px */
  --text-h2: 2rem; /* 32px */
  --text-xl: 1.25rem; /* 20px */
  --text-base: 1rem; /* 16px */
  --text-sm: 0.875rem; /* 14px */

  /* Spacing - WBE's 4px base unit */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */

  /* Radius - WBE's subtle radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows - Combined */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition: all 0.2s ease;
}
```

### Hero Component Structure
```css
.hero {
  min-height: 80vh; /* Not full - WBE approach */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background: linear-gradient(135deg, #f8f5f0 0%, #ffffff 100%);
}

.hero-heading {
  font-size: var(--text-hero);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  line-height: 1.1;
  max-width: 900px;
}

.hero-subheading {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
  max-width: 600px;
  line-height: 1.6;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
}

.hero-cta:hover {
  background: #2563EB;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

---

## NEXT STEPS

1. ✅ Hero sections analyzed
2. [ ] Review cards specs extraction
3. [ ] Comparison tables specs extraction
4. [ ] Scoring components specs extraction
5. [ ] Navigation specs extraction
6. [ ] Footer specs extraction
7. [ ] Cross-component analysis
8. [ ] Final design system compilation
