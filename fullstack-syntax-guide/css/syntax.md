# CSS3 Syntax Guide

Modern CSS focusing on layout and variables.

## CSS Variables (Custom Properties)
```css
:root {
    --primary-color: #3498db;
    --font-heading: 'Inter', sans-serif;
    --spacing-main: 20px;
}

body {
    color: var(--primary-color);
    font-family: var(--font-heading);
    padding: var(--spacing-main);
}
```

## Flexbox
```css
.container {
    display: flex;
    justify-content: center; /* Horiz: center, space-between, space-around */
    align-items: center;    /* Vert: center, stretch, flex-start */
    flex-wrap: wrap;
    gap: 1rem;
}

.item {
    flex: 1; /* flex-grow, flex-shrink, flex-basis */
}
```

## CSS Grid
```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 20px;
}

.grid-item {
    grid-column: span 2; /* Occupies 2 columns */
}
```

## Responsive Design (Mobile First)
```css
/* Base styles for mobile */
.card { width: 100%; }

/* Desktop styles */
@media (min-width: 768px) {
    .card { width: 50%; }
}
```

## Animations
```css
@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}

.element {
    animation: slideIn 0.5s ease-out;
}
```
