# Comparison Tables - Design Specifications

> **Date:** 2026-01-17
> **Source:** ToolTester screenshot

---

## ToolTester Comparison Table

**Design Philosophy:** Clean, checkmark-based, scannable

### Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #3B82F6; /* Blue */
  --color-primary-light: #DBEAFE;
  --color-white: #ffffff;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* Status Colors */
  --color-success: #10B981; /* Green check */
  --color-error: #EF4444; /* Red X */

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */

  /* Spacing */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */

  /* Radius */
  --radius-lg: 0.5rem; /* 8px */
}
```

### Table Component
```css
/* Container */
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Table Base */
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* Header */
.table th {
  background-color: #F9FAFB;
  color: #111827;
  font-weight: 600;
  text-align: left;
  padding: 16px;
  border-bottom: 2px solid #E5E7EB;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Body Cells */
.table td {
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
  color: #4B5563;
  font-size: 16px;
}

/* Rows */
.table tr {
  transition: background-color 0.2s ease;
}

.table tr:hover {
  background-color: #F9FAFB;
}

/* Alternating rows */
.table tr:nth-child(even) {
  background-color: #F9FAFB;
}

/* Checkmark/Cross Icons */
.table .checkmark {
  color: #10B981;
  font-size: 18px;
}

.table .cross {
  color: #EF4444;
  font-size: 18px;
}
```

### Filter Buttons
```css
.filter-button {
  padding: 8px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background-color: #ffffff;
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;
  margin-bottom: 8px;
}

.filter-button.active {
  background-color: #3B82F6;
  color: #ffffff;
  border-color: #3B82F6;
}

.filter-button:hover {
  background-color: #F3F4F6;
  border-color: #9CA3AF;
}

.filter-button.active:hover {
  background-color: #2563EB;
}
```

---

## COMPARISON TABLE PATTERNS

### Feature Comparison Layout
```css
/* Three-column layout (Feature | Tool A | Tool B) */
.comparison-table {
  grid-template-columns: 200px 1fr 1fr;
}

/* First column (feature names) */
.comparison-table td:first-child {
  font-weight: 600;
  color: #111827;
  background-color: #F9FAFB;
}

### Highlighted Winner Column
.comparison-table td.winner {
  background-color: #DBEAFE;
  border-left: 2px solid #3B82F6;
  border-right: 2px solid #3B82F6;
}

### Call-to-Action Row
.comparison-table .cta-row {
  background-color: #F3F4F6;
}

.comparison-table .cta-row td {
  padding: 24px 16px;
  text-align: center;
}
```

---

## OUR RECOMMENDED COMPARISON TABLE SPEC

```css
:root {
  /* Comparison table specific */
  --comparison-bg: #ffffff;
  --comparison-header-bg: #F9FAFB;
  --comparison-border: #E5E7EB;
  --comparison-hover: #F3F4F6;
  --comparison-check: #10B981;
  --comparison-cross: #EF4444;
  --comparison-padding: 16px;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--comparison-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comparison-table th,
.comparison-table td {
  padding: var(--comparison-padding);
  text-align: left;
  border-bottom: 1px solid var(--comparison-border);
}

.comparison-table th {
  background: var(--comparison-header-bg);
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.comparison-table tr:hover td {
  background: var(--comparison-hover);
}

/* Icons */
.comparison-table .check {
  color: var(--comparison-check);
  font-size: 18px;
}

.comparison-table .cross {
  color: var(--comparison-cross);
  font-size: 18px;
}
```

### Example HTML Structure
```html
<table class="comparison-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Framer AI</th>
      <th>Durable</th>
      <th>10Web AI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>AI Generation</strong></td>
      <td><span class="check">✓</span></td>
      <td><span class="check">✓</span></td>
      <td><span class="check">✓</span></td>
    </tr>
    <tr>
      <td><strong>Free Plan</strong></td>
      <td><span class="check">✓</span></td>
      <td><span class="check">✓</span></td>
      <td><span class="cross">✗</span></td>
    </tr>
    <tr>
      <td><strong>Custom Domain</strong></td>
      <td><span class="cross">✗</span></td>
      <td><span class="check">✓</span></td>
      <td><span class="check">✓</span></td>
    </tr>
  </tbody>
</table>
```
