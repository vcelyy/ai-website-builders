# Footer - Design Specifications

> **Date:** 2026-01-17
> **Sources:** ToolTester, WBE footer screenshots

---

## ToolTester Footer

**Design Philosophy:** Dark background, multi-column, social icons

### Design Tokens
```css
:root {
  /* Colors */
  --footer-bg: #1a1a1a;
  --footer-text: #ffffff;
  --footer-link: #e0e0e0;
  --footer-link-hover: #ffffff;
  --footer-divider: #333333;

  /* Typography */
  --footer-font-family: 'Arial', sans-serif;
  --footer-text-size: 0.95rem;
  --footer-heading-size: 1rem;

  /* Spacing */
  --footer-padding: 4rem 2rem;
  --footer-gap: 2rem;
}
```

### Footer Component
```css
.footer {
  background: #1a1a1a;
  padding: 64px 32px;
  color: #ffffff;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 48px;
}

.footer-logo {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.footer-nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.footer-nav-link:hover {
  color: #ffffff;
}

.social-icons {
  display: flex;
  gap: 24px;
  justify-content: flex-end;
}

.social-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: color 0.2s ease;
}

.social-icon:hover {
  color: #00a8ff;
}
```

---

## WebsiteBuilderExpert Footer

**Design Philosophy:** Indigo background, simple two-column, copyright focus

### Design Tokens
```css
:root {
  /* Colors */
  --footer-bg: #1e1b4b; /* Deep indigo */
  --footer-text: #e2e8f0;
  --footer-link: #94a3b8;
  --footer-link-hover: #e2e8f0;
  --footer-divider: #334155;
  --footer-copyright: #64748b;

  /* Typography */
  --footer-font-family: 'Inter', sans-serif;
  --footer-nav-size: 0.875rem;
  --footer-copyright-size: 0.75rem;
}
```

### Footer Component
```css
.footer {
  background: #1e1b4b;
  color: #e2e8f0;
  padding: 48px 32px;
  font-family: 'Inter', sans-serif;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.footer-nav {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-nav a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-nav a:hover {
  color: #e2e8f0;
}

.footer-divider {
  height: 1px;
  background: #334155;
  margin: 32px 0;
}

.footer-copyright {
  font-size: 0.75rem;
  line-height: 1.5;
  color: #64748b;
}
```

---

## CROSS-COMPETITOR COMPARISON

| Aspect | ToolTester | WBE | Best Choice |
|--------|-----------|-----|-------------|
| Background | #1a1a1a (dark) | #1e1b4b (indigo) | WBE (unique) |
| Padding | 64px 32px | 48px 32px | ToolTester (spacious) |
| Columns | 3-column | 2-column | ToolTester (structured) |
| Social icons | Yes | No | ToolTester (engagement) |
| Copyright focus | Minimal | Prominent | WBE (legal) |

---

## OUR RECOMMENDED FOOTER SPEC

```css
:root {
  /* Footer tokens - combining best of both */
  --footer-bg: #1e1b4b; /* WBE's indigo - more unique */
  --footer-text: #e2e8f0;
  --footer-link: #94a3b8;
  --footer-link-hover: #ffffff;
  --footer-divider: #334155;
  --footer-copyright: #64748b;

  /* Layout */
  --footer-padding: 64px 32px 32px;
  --footer-gap: 48px;
  --footer-max-width: 1200px;
}

.footer {
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: var(--footer-padding);
}

.footer-container {
  max-width: var(--footer-max-width);
  margin: 0 auto;
}

/* Three column layout from ToolTester */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--footer-gap);
  margin-bottom: 48px;
}

/* Logo section */
.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-tagline {
  font-size: 0.875rem;
  color: var(--footer-link);
  line-height: 1.6;
}

/* Navigation columns */
.footer-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 48px;
}

.footer-nav-column h4 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  color: var(--footer-text);
}

.footer-nav-link {
  display: block;
  color: var(--footer-link);
  text-decoration: none;
  font-size: 0.875rem;
  padding: 6px 0;
  transition: color 0.2s ease;
}

.footer-nav-link:hover {
  color: var(--footer-link-hover);
}

/* Social icons from ToolTester */
.footer-social {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--footer-text);
  transition: all 0.2s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Divider from WBE */
.footer-divider {
  height: 1px;
  background: var(--footer-divider);
  margin: 48px 0 32px;
}

/* Copyright section from WBE */
.footer-copyright {
  font-size: 0.75rem;
  color: var(--footer-copyright);
  line-height: 1.6;
}

.footer-copyright p {
  margin: 4px 0;
}

.footer-legal-links {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.footer-legal-links a {
  color: var(--footer-link);
  text-decoration: none;
  font-size: 0.75rem;
}

.footer-legal-links a:hover {
  color: var(--footer-link-hover);
}
```

---

## RESPONSIVE FOOTER

```css
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-social {
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 48px 24px 24px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-nav {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .social-icons {
    justify-content: flex-start;
  }

  .footer-legal-links {
    flex-direction: column;
    gap: 12px;
  }
}
```

---

## FOOTER CONTENT SECTIONS

```html
<footer class="footer">
  <div class="footer-container">
    <div class="footer-grid">
      <!-- Column 1: Brand -->
      <div class="footer-brand">
        <div class="footer-logo">AI Website Builders</div>
        <p class="footer-tagline">
          Honest, hands-on reviews of AI-powered website builders.
          We test so you don't have to.
        </p>
      </div>

      <!-- Column 2: Navigation -->
      <nav class="footer-nav">
        <div class="footer-nav-column">
          <h4>Reviews</h4>
          <a href="/reviews/framer-ai" class="footer-nav-link">Framer AI</a>
          <a href="/reviews/durable" class="footer-nav-link">Durable</a>
          <a href="/reviews/10web" class="footer-nav-link">10Web AI</a>
          <a href="/reviews/relume" class="footer-nav-link">Relume AI</a>
        </div>
        <div class="footer-nav-column">
          <h4>Comparisons</h4>
          <a href="/compare/framer-vs-durable" class="footer-nav-link">Framer vs Durable</a>
          <a href="/compare/10web-vs-wordpress" class="footer-nav-link">10Web vs WordPress</a>
          <a href="/compare/best-ai-builders" class="footer-nav-link">Best AI Builders</a>
        </div>
        <div class="footer-nav-column">
          <h4>Company</h4>
          <a href="/about" class="footer-nav-link">About</a>
          <a href="/methodology" class="footer-nav-link">Methodology</a>
          <a href="/contact" class="footer-nav-link">Contact</a>
        </div>
        <div class="footer-nav-column">
          <h4>Legal</h4>
          <a href="/privacy" class="footer-nav-link">Privacy Policy</a>
          <a href="/terms" class="footer-nav-link">Terms of Service</a>
          <a href="/disclosure" class="footer-nav-link">Affiliate Disclosure</a>
        </div>
      </nav>

      <!-- Column 3: Social -->
      <div class="footer-social">
        <div class="social-icons">
          <a href="#" class="social-icon" aria-label="Twitter">
            <svg>...</svg>
          </a>
          <a href="#" class="social-icon" aria-label="LinkedIn">
            <svg>...</svg>
          </a>
          <a href="#" class="social-icon" aria-label="YouTube">
            <svg>...</svg>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-divider"></div>

    <div class="footer-copyright">
      <p>&copy; 2026 AI Website Builders. All rights reserved.</p>
      <p class="registration-info">
        Affiliate Disclosure: We may earn commission when you sign up through our links.
        This helps us continue providing honest, unbiased reviews.
      </p>
      <div class="footer-legal-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/disclosure">Disclosure</a>
      </div>
    </div>
  </div>
</footer>
```
