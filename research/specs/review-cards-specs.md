# Review Cards - Design Specifications

> **Date:** 2026-01-17
> **Sources:** ToolTester, WebsiteBuilderExpert screenshots

---

## ToolTester Review Cards

**Design Philosophy:** Professional, author-transparent, category-labeled

### Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #00a6fb; /* Wix blue */
  --color-white: #ffffff;
  --color-gray-100: #f1f3f5;
  --color-gray-300: #dee2e6;
  --color-gray-600: #6c757d;
  --color-gray-700: #495057;
  --color-gray-800: #343a40;
  --color-gray-900: #212529;

  /* Typography */
  --font-family: 'Arial', 'Helvetica Neue', sans-serif;
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */

  /* Radius */
  --radius-lg: 0.75rem; /* 12px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Card Component
```css
.review-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 400px;
  transition: all 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Category Label */
.review-card-title {
  color: #00a6fb;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

/* Main Title */
.review-card-main-title {
  color: #212529;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}

/* Subtitle */
.review-card-subtitle {
  color: #495057;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
}

/* Author Section */
.review-card-authors {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background-color: #f1f3f5;
}
```

---

## WebsiteBuilderExpert Article Cards

**Design Philosophy:** Image-led, content-heavy, grid-based

### Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #4CAF50; /* Green button */
  --color-white: #ffffff;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-xl: 1.25rem; /* 20px */

  /* Spacing */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */

  /* Radius */
  --radius-lg: 0.5rem; /* 8px */

  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Article Card Component
```css
.article-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Image */
.article-card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* Content */
.article-card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  line-height: 1.2;
}

.article-card-excerpt {
  font-size: 16px;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

/* Meta */
.article-card-meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #9ca3af;
}
```

---

## CROSS-COMPETITOR COMPARISON

| Aspect | ToolTester | WBE | Best Choice |
|--------|-----------|-----|-------------|
| Card padding | 24px | 20px | ToolTester (more breathing room) |
| Border radius | 12px | 8px | ToolTester (modern) |
| Shadow depth | Medium | Medium | Tie |
| Image approach | No image | 180px height | WBE (visual) |
| Author display | Avatar + name | Text only | ToolTester (personal) |
| Category label | Yes | No | ToolTester (context) |

---

## OUR RECOMMENDED REVIEW CARD SPEC

```css
:root {
  /* Combined best practices */
  --review-card-padding: 24px; /* ToolTester */
  --review-card-radius: 12px; /* ToolTester */
  --review-card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --review-card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.review-card {
  background-color: #ffffff;
  border-radius: var(--review-card-radius);
  box-shadow: var(--review-card-shadow);
  padding: var(--review-card-padding);
  transition: all 0.3s ease;
}

.review-card:hover {
  box-shadow: var(--review-card-shadow-hover);
  transform: translateY(-2px);
}

/* Include image from WBE approach */
.review-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

/* Include category label from ToolTester */
.review-card-category {
  display: inline-block;
  color: #3B82F6;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

/* Include author section from ToolTester */
.review-card-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}
```

---

## GRID LAYOUT

```css
.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .review-grid {
    grid-template-columns: 1fr;
  }
}
```
