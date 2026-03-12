# CSS3 Complete Syntax Guide

A comprehensive reference for every CSS concept with examples.

---

## 1. Selectors

```css
/* Element Selector */
p { color: blue; }

/* Class Selector */
.card { background: white; }

/* ID Selector */
#header { height: 60px; }

/* Universal Selector */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Attribute Selector */
input[type="text"] { border: 1px solid #ccc; }
a[href^="https"] { color: green; }       /* starts with */
a[href$=".pdf"] { color: red; }          /* ends with */
a[href*="example"] { color: orange; }    /* contains */

/* Pseudo-class Selectors */
a:hover { color: red; }
a:active { color: darkred; }
a:visited { color: purple; }
input:focus { outline: 2px solid blue; }
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(2) { color: green; }        /* 2nd child */
li:nth-child(odd) { background: #f9f9f9; }
li:nth-child(even) { background: #fff; }
p:not(.intro) { font-size: 14px; }       /* negation */

/* Pseudo-element Selectors */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; }
.card::before { content: "★ "; }
.card::after { content: " →"; }
input::placeholder { color: #aaa; }
::selection { background: yellow; color: black; }

/* Combinator Selectors */
div p { }          /* Descendant (any level deep) */
div > p { }        /* Direct child only */
h2 + p { }         /* Adjacent sibling (immediately after) */
h2 ~ p { }         /* General sibling (all after) */

/* Grouping Selectors */
h1, h2, h3 { font-family: 'Arial', sans-serif; }
```

---

## 2. Box Model

```css
.box {
    /* Content dimensions */
    width: 300px;
    height: 200px;
    min-width: 100px;
    max-width: 500px;
    min-height: 50px;
    max-height: 400px;

    /* Padding (inside border) */
    padding: 20px;                    /* all sides */
    padding: 10px 20px;              /* vertical horizontal */
    padding: 10px 20px 30px 40px;    /* top right bottom left */
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 30px;
    padding-left: 40px;

    /* Border */
    border: 2px solid #333;
    border-radius: 8px;              /* rounded corners */
    border-top: 1px dashed red;
    border-bottom: none;

    /* Margin (outside border) */
    margin: 20px auto;               /* auto centers horizontally */
    margin-top: 10px;
    margin-bottom: 10px;

    /* Box sizing - IMPORTANT */
    box-sizing: border-box;   /* width includes padding + border */
    /* box-sizing: content-box;  default - width = content only */
}
```

**Example:**
```css
/* Universal reset */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

---

## 3. Display & Positioning

```css
/* Display */
.block { display: block; }           /* Takes full width */
.inline { display: inline; }         /* Takes content width, no width/height */
.inline-block { display: inline-block; } /* Inline + can set width/height */
.none { display: none; }             /* Completely hidden */

/* Position */
.static { position: static; }        /* Default flow */
.relative { position: relative; top: 10px; left: 20px; } /* Shifted from normal */
.absolute { position: absolute; top: 0; right: 0; }      /* Relative to nearest positioned ancestor */
.fixed { position: fixed; bottom: 0; right: 0; }         /* Relative to viewport, stays on scroll */
.sticky { position: sticky; top: 0; }                     /* Sticks when scrolled to */

/* Z-index (stacking order, only works on positioned elements) */
.front { z-index: 10; }
.back { z-index: 1; }

/* Overflow */
.container {
    overflow: hidden;     /* Clips content */
    overflow: scroll;     /* Always shows scrollbar */
    overflow: auto;       /* Shows scrollbar only when needed */
    overflow-x: hidden;   /* Horizontal overflow */
    overflow-y: auto;     /* Vertical overflow */
}

/* Float (legacy layout) */
.left { float: left; }
.right { float: right; }
.clear { clear: both; }
```

**Example: Sticky Navbar:**
```css
.navbar {
    position: sticky;
    top: 0;
    background: white;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

---

## 4. CSS Variables (Custom Properties)

```css
:root {
    --primary: #3498db;
    --secondary: #2ecc71;
    --danger: #e74c3c;
    --bg-dark: #1a1a2e;
    --text-light: #f5f5f5;
    --font-main: 'Inter', sans-serif;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --radius: 8px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 32px;
}

.btn {
    background: var(--primary);
    color: var(--text-light);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    font-family: var(--font-main);
}

.btn-danger {
    background: var(--danger);
}

/* Override variable locally */
.dark-mode {
    --primary: #5dade2;
    --bg-dark: #0d0d1a;
}
```

---

## 5. Flexbox (Complete)

```css
/* Container */
.flex-container {
    display: flex;

    /* Direction */
    flex-direction: row;              /* Default: left to right */
    flex-direction: row-reverse;      /* Right to left */
    flex-direction: column;           /* Top to bottom */
    flex-direction: column-reverse;   /* Bottom to top */

    /* Wrapping */
    flex-wrap: nowrap;     /* Default: all items on one line */
    flex-wrap: wrap;       /* Wrap to next line */
    flex-wrap: wrap-reverse;

    /* Main axis alignment */
    justify-content: flex-start;      /* Default */
    justify-content: flex-end;
    justify-content: center;
    justify-content: space-between;   /* Equal space BETWEEN items */
    justify-content: space-around;    /* Equal space AROUND items */
    justify-content: space-evenly;    /* Truly equal spacing */

    /* Cross axis alignment */
    align-items: stretch;    /* Default: stretch to fill */
    align-items: flex-start;
    align-items: flex-end;
    align-items: center;
    align-items: baseline;   /* Align by text baseline */

    /* Multi-line cross axis */
    align-content: flex-start;
    align-content: center;
    align-content: space-between;

    /* Gap between items */
    gap: 16px;
    row-gap: 10px;
    column-gap: 20px;
}

/* Items */
.flex-item {
    flex-grow: 1;      /* How much item grows to fill space (0 = don't grow) */
    flex-shrink: 0;    /* How much item shrinks (0 = don't shrink) */
    flex-basis: 200px; /* Initial size before grow/shrink */

    /* Shorthand */
    flex: 1;                /* grow:1, shrink:1, basis:0% */
    flex: 0 0 200px;        /* Fixed 200px, no grow/shrink */

    /* Override alignment for single item */
    align-self: center;

    /* Change order */
    order: 2;   /* Default is 0, higher = later */
}
```

**Example: Centering anything:**
```css
.center-everything {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

**Example: Navbar with logo left, links right:**
```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}
```

---

## 6. CSS Grid (Complete)

```css
/* Container */
.grid-container {
    display: grid;

    /* Define columns */
    grid-template-columns: 200px 200px 200px;       /* 3 fixed columns */
    grid-template-columns: 1fr 1fr 1fr;              /* 3 equal columns */
    grid-template-columns: repeat(3, 1fr);            /* Same as above */
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive! */
    grid-template-columns: 200px 1fr 2fr;             /* Mixed sizes */

    /* Define rows */
    grid-template-rows: 100px auto 50px;             /* Header, content, footer */

    /* Gap */
    gap: 20px;
    row-gap: 10px;
    column-gap: 20px;

    /* Named areas */
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";

    /* Alignment */
    justify-items: center;     /* Horizontal alignment of items */
    align-items: center;       /* Vertical alignment of items */
    place-items: center;       /* Shorthand for both */
}

/* Items */
.grid-item {
    grid-column: 1 / 3;        /* Spans from line 1 to line 3 (2 columns) */
    grid-column: span 2;       /* Spans 2 columns from current position */
    grid-row: 1 / 3;           /* Spans 2 rows */

    /* Named area placement */
    grid-area: header;
}
```

**Example: Full Page Layout:**
```css
.page {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: 60px 1fr 40px;
    min-height: 100vh;
}
.page-header { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main { grid-area: main; }
.page-footer { grid-area: footer; }
```

**Example: Responsive Card Grid:**
```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}
```

---

## 7. Typography & Fonts

```css
body {
    font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
    font-size: 16px;          /* Base size */
    font-weight: 400;         /* 100-900, normal=400, bold=700 */
    font-style: italic;
    line-height: 1.6;         /* Line spacing */
    letter-spacing: 0.5px;
    word-spacing: 2px;
    text-align: center;       /* left, right, center, justify */
    text-transform: uppercase; /* lowercase, capitalize, none */
    text-decoration: underline; /* none, overline, line-through */
    text-indent: 2em;         /* First line indent */
    white-space: nowrap;      /* Prevents wrapping */
    text-overflow: ellipsis;  /* Shows ... when text overflows */
    overflow: hidden;         /* Required for text-overflow */
}

/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
```

---

## 8. Colors & Backgrounds

```css
.element {
    /* Color formats */
    color: red;                       /* Named */
    color: #ff5733;                   /* Hex */
    color: rgb(255, 87, 51);          /* RGB */
    color: rgba(255, 87, 51, 0.5);    /* RGBA (with transparency) */
    color: hsl(14, 100%, 60%);        /* HSL */
    color: hsla(14, 100%, 60%, 0.5);  /* HSLA */

    /* Backgrounds */
    background-color: #f4f4f4;
    background-image: url('bg.jpg');
    background-size: cover;            /* cover, contain, 100% */
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;      /* Parallax effect */

    /* Shorthand */
    background: #333 url('bg.jpg') center/cover no-repeat fixed;

    /* Gradient */
    background: linear-gradient(to right, #667eea, #764ba2);
    background: linear-gradient(135deg, #f093fb, #f5576c);
    background: radial-gradient(circle, #fff, #000);
}

/* Opacity */
.transparent { opacity: 0.5; }   /* 0 = invisible, 1 = fully visible */
```

---

## 9. Shadows & Borders

```css
.card {
    /* Box shadow: offset-x, offset-y, blur, spread, color */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

    /* Multiple shadows */
    box-shadow:
        0 2px 4px rgba(0,0,0,0.1),
        0 8px 16px rgba(0,0,0,0.1);

    /* Inset shadow (inner shadow) */
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);

    /* Text shadow */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);

    /* Border radius */
    border-radius: 8px;          /* All corners */
    border-radius: 50%;          /* Circle (on square element) */
    border-radius: 20px 0 20px 0; /* Top-left, top-right, bottom-right, bottom-left */

    /* Outline (doesn't affect box model) */
    outline: 2px solid blue;
    outline-offset: 4px;         /* Space between border and outline */
}
```

---

## 10. Transitions & Animations

```css
/* Transitions (smooth change on state change) */
.btn {
    background: #3498db;
    color: white;
    padding: 10px 20px;
    transition: all 0.3s ease;
    /* transition: property duration timing-function delay */
    /* timing: ease, linear, ease-in, ease-out, ease-in-out, cubic-bezier() */
}
.btn:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Keyframe Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.animated-element {
    animation: fadeIn 0.5s ease-out;
    /* animation: name duration timing-function delay iteration-count direction fill-mode */
    animation: pulse 2s ease-in-out infinite;
    animation: spin 1s linear infinite;
}
```

---

## 11. Transforms

```css
.element {
    transform: translateX(50px);       /* Move horizontally */
    transform: translateY(-20px);      /* Move vertically */
    transform: translate(50px, -20px); /* Both */
    transform: scale(1.2);            /* Scale up 120% */
    transform: scale(0.8);            /* Scale down 80% */
    transform: rotate(45deg);         /* Rotate clockwise */
    transform: rotate(-45deg);        /* Rotate counter-clockwise */
    transform: skew(10deg, 5deg);     /* Skew */

    /* Multiple transforms */
    transform: translateY(-5px) scale(1.02);

    /* Transform origin (pivot point) */
    transform-origin: center;          /* Default */
    transform-origin: top left;
}
```

---

## 12. Responsive Design

```css
/* Mobile-first approach */
/* Base styles for mobile */
.container { padding: 1rem; }
.grid { display: grid; grid-template-columns: 1fr; }

/* Tablet */
@media (min-width: 768px) {
    .container { padding: 2rem; }
    .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
    .container { max-width: 1200px; margin: 0 auto; }
    .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop */
@media (min-width: 1440px) {
    .container { max-width: 1400px; }
}

/* Print styles */
@media print {
    .no-print { display: none; }
    body { font-size: 12pt; }
}

/* Responsive units */
.element {
    width: 50%;            /* Percentage of parent */
    width: 50vw;           /* 50% of viewport width */
    height: 100vh;         /* Full viewport height */
    font-size: 1rem;       /* Relative to root font-size (16px default) */
    font-size: 1.5em;      /* Relative to parent font-size */
    font-size: clamp(1rem, 2.5vw, 2rem); /* Min, preferred, max */
}
```

---

## 13. Modern CSS Reset

```css
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    min-height: 100vh;
}

img, video {
    max-width: 100%;
    display: block;
}

a {
    text-decoration: none;
    color: inherit;
}

ul, ol {
    list-style: none;
}

button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
}

input, textarea, select {
    font: inherit;
}
```
