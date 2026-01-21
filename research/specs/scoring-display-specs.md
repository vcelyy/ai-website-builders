# Scoring/Rating Display - Design Specifications

> **Date:** 2026-01-17
> **Source:** ToolTester screenshot analysis

---

## Scoring System Components

**Design Philosophy:** Clear, visual, color-coded

### Design Tokens
```css
:root {
  /* Score Colors */
  --score-excellent: #10B981; /* Green */
  --score-good: #3B82F6; /* Blue */
  --score-average: #F59E0B; /* Yellow */
  --score-poor: #EF4444; /* Red */

  /* Typography */
  --score-number-size: 2.5rem; /* 40px */
  --score-label-size: 0.75rem; /* 12px */
  --score-font-weight: 700;

  /* Spacing */
  --score-spacing: 12px;
}
```

---

## SCORE BADGE COMPONENT

```css
.score-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
}

/* Score Levels */
.score-badge.excellent {
  background: #10B981;
  color: #ffffff;
}

.score-badge.good {
  background: #3B82F6;
  color: #ffffff;
}

.score-badge.average {
  background: #F59E0B;
  color: #ffffff;
}

.score-badge.poor {
  background: #EF4444;
  color: #ffffff;
}
```

---

## STAR RATING SYSTEM

```css
.rating-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
}

.star {
  color: #D1D5DB; /* Gray (empty) */
  font-size: 20px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #F59E0B; /* Gold (filled) */
}

.star:hover {
  color: #F59E0B;
  transform: scale(1.1);
}

/* Star size variations */
.rating-stars.sm .star {
  font-size: 16px;
}

.rating-stars.lg .star {
  font-size: 24px;
}
```

---

## NUMERICAL SCORE DISPLAY

```css
.score-numeric {
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  margin-right: 12px;
}

/* Color by score */
.score-numeric.excellent { color: #10B981; }
.score-numeric.good { color: #3B82F6; }
.score-numeric.average { color: #F59E0B; }
.score-numeric.poor { color: #EF4444; }
```

---

## PROGRESS BAR METERS

```css
.progress-meter {
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Progress by score */
.progress-fill.excellent {
  background: #10B981;
}

.progress-fill.good {
  background: #3B82F6;
}

.progress-fill.average {
  background: #F59E0B;
}

.progress-fill.poor {
  background: #EF4444;
}
```

---

## SCORE BREAKDOWN TABLE

```css
.score-breakdown {
  width: 100%;
  border-collapse: collapse;
}

.score-breakdown th,
.score-breakdown td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.score-breakdown th {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6B7280;
}

.score-breakdown .metric-name {
  font-weight: 500;
  color: #111827;
}

.score-breakdown .metric-score {
  font-weight: 700;
  font-size: 18px;
}
```

---

## COMPLETE SCORE COMPONENT EXAMPLE

```css
.score-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.score-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.score-card .overall-score {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.score-card .overall-score .number {
  font-size: 48px;
  font-weight: 700;
  color: #3B82F6;
}

.score-card .overall-score .out-of {
  font-size: 16px;
  color: #6B7280;
}

.score-card .rating-stars {
  margin: 0;
}

/* Score Categories */
.score-categories {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-category {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-category .label {
  font-weight: 500;
  color: #374151;
}

.score-category .meter {
  flex: 1;
  margin: 0 16px;
}

.score-category .value {
  font-weight: 600;
  font-size: 18px;
  min-width: 40px;
  text-align: right;
}
```

### Example HTML
```html
<div class="score-card">
  <div class="score-card-header">
    <div class="overall-score">
      <span class="number">8.7</span>
      <span class="out-of">/ 10</span>
    </div>
    <div class="rating-stars">
      <span class="star filled">★</span>
      <span class="star filled">★</span>
      <span class="star filled">★</span>
      <span class="star filled">★</span>
      <span class="star">★</span>
    </div>
  </div>

  <div class="score-categories">
    <div class="score-category">
      <span class="label">Ease of Use</span>
      <div class="meter">
        <div class="progress-meter">
          <div class="progress-fill excellent" style="width: 90%"></div>
        </div>
      </div>
      <span class="value" style="color: #10B981">9.0</span>
    </div>

    <div class="score-category">
      <span class="label">Design Quality</span>
      <div class="meter">
        <div class="progress-meter">
          <div class="progress-fill good" style="width: 85%"></div>
        </div>
      </div>
      <span class="value" style="color: #3B82F6">8.5</span>
    </div>

    <div class="score-category">
      <span class="label">AI Intelligence</span>
      <div class="meter">
        <div class="progress-meter">
          <div class="progress-fill average" style="width: 75%"></div>
        </div>
      </div>
      <span class="value" style="color: #F59E0B">7.5</span>
    </div>
  </div>
</div>
```

---

## SCORING GUIDELINES

### Score Ranges
```yaml
excellent: 9.0 - 10.0  # Green
good: 7.0 - 8.9        # Blue
average: 5.0 - 6.9     # Yellow
poor: 0.0 - 4.9        # Red
```

### Metrics to Score
1. **Ease of Use** - How intuitive is the tool?
2. **Design Quality** - How good are the AI outputs?
3. **AI Intelligence** - How smart is the AI?
4. **Customization** - How much can you edit?
5. **Features** - What functionality is included?
6. **Value for Money** - Is it worth the cost?

### Display Best Practices
- Always show the numerical score (not just stars)
- Use color coding for quick scanning
- Include score breakdown by category
- Show progress bars for visual comparison
- Keep labels short and clear
