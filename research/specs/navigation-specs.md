# Navigation Bar - Design Specifications

> **Date:** 2026-01-17
> **Sources:** ToolTester, WBE navigation screenshots

---

## ToolTester Navigation

**Design Philosophy:** Professional, multi-level dropdowns, language selector

### Design Tokens
```css
:root {
  /* Colors */
  --nav-bg: #ffffff;
  --nav-border: #e5e7eb;
  --nav-text: #111827;
  --nav-text-hover: #374151;
  --nav-hover-bg: #f9fafb;
  --nav-active-bg: #f3f4f6;

  /* Typography */
  --nav-font-family: 'Inter', -apple-system, sans-serif;
  --nav-font-size: 0.875rem; /* 14px */
  --nav-font-weight: 500;

  /* Spacing */
  --nav-height: 64px;
  --nav-padding-x: 1.5rem;
  --nav-gap: 2rem;
}
```

### Navigation Component
```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  text-decoration: none;
  border-radius: 0;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #374151;
  background: #f9fafb;
}
```

---

## WebsiteBuilderExpert Navigation

**Design Philosophy:** Gradient logo icon, dropdown arrows, subscribe button

### Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #1a1a1a;
  --color-background: #ffffff;
  --color-hover: #f5f5f5;
  --color-dropdown-bg: #ffffff;
  --color-dropdown-border: #e5e5e5;
  --color-text: #333333;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-nav: 14px;
  --font-weight-nav: 500;

  /* Spacing */
  --spacing-md: 16px;
  --spacing-xl: 32px;
}
```

### Navigation Component
```css
.navbar {
  height: 64px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.logo-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #1a1a1a;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## CROSS-COMPETITOR COMPARISON

| Aspect | ToolTester | WBE | Best Choice |
|--------|-----------|-----|-------------|
| Height | 64px | 64px | Tie |
| Padding | 24px | 24px | Tie |
| Link size | 14px | 14px | Tie |
| Link weight | 500 | 500 | Tie |
| Dropdown style | Hover reveal | Hover reveal | Tie |
| Logo | Text only | Gradient icon | WBE (visual) |
| Special feature | Language selector | Subscribe button | Both useful |

---

## OUR RECOMMENDED NAVIGATION SPEC

```css
:root {
  /* Navigation tokens */
  --nav-height: 64px;
  --nav-padding: 24px;
  --nav-bg: #ffffff;
  --nav-border: #e5e7eb;
  --nav-text: #1f2937;
  --nav-text-hover: #374151;
  --nav-hover-bg: #f9fafb;
  --nav-link-size: 14px;
  --nav-link-weight: 500;
  --nav-gap: 32px;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-height);
  padding: 0 var(--nav-padding);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

/* Logo - Gradient icon style from WBE */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--nav-text);
  text-decoration: none;
}

.nav-logo-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #4a46e6 0%, #ec4899 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--nav-gap);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  font-size: var(--nav-link-size);
  font-weight: var(--nav-link-weight);
  color: var(--nav-text);
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--nav-text);
  transition: width 0.2s ease;
}

.nav-link:hover {
  color: var(--nav-text-hover);
}

.nav-link:hover::after {
  width: 100%;
}

/* Dropdown indicator */
.dropdown-indicator {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.nav-link:hover .dropdown-indicator {
  transform: rotate(180deg);
}

/* Actions area */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Language selector - from ToolTester */
.nav-language {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--nav-text);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.nav-language:hover {
  background: var(--nav-hover-bg);
}

/* Search icon */
.nav-search {
  padding: 8px;
  color: var(--nav-text);
  cursor: pointer;
  border-radius: 50%;
}

.nav-search:hover {
  background: var(--nav-hover-bg);
}
```

---

## DROPDOWN MENU SPEC

```css
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-width: 200px;
  padding: 8px 0;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 200;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f9fafb;
  color: #111827;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}
```

---

## RESPONSIVE NAVIGATION

```css
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .nav-mobile-toggle {
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
  }

  .nav-mobile-toggle span {
    width: 24px;
    height: 2px;
    background: #1f2937;
    transition: all 0.3s ease;
  }

  .nav-mobile-menu.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: #ffffff;
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
  }
}
```
