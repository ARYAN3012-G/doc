# HTML5 Complete Syntax Guide

A comprehensive reference for every HTML concept you need.

---

## 1. Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page description for SEO">
    <meta name="author" content="Your Name">
    <link rel="stylesheet" href="style.css">
    <title>My Page Title</title>
</head>
<body>
    <!-- All visible content goes here -->
</body>
</html>
```

---

## 2. Text & Headings

```html
<h1>Main Heading (only one per page)</h1>
<h2>Sub Heading</h2>
<h3>Sub-sub Heading</h3>
<h4>Level 4</h4>
<h5>Level 5</h5>
<h6>Level 6</h6>

<p>This is a paragraph of text.</p>
<br>   <!-- Line break (self-closing) -->
<hr>   <!-- Horizontal rule -->

<strong>Bold text (semantic - important)</strong>
<b>Bold text (visual only)</b>
<em>Italic text (semantic - emphasis)</em>
<i>Italic text (visual only)</i>
<u>Underlined text</u>
<s>Strikethrough text</s>
<mark>Highlighted text</mark>
<small>Small text</small>
<sub>Subscript</sub>
<sup>Superscript</sup>
<code>Inline code</code>
<pre>Preformatted text (preserves whitespace)</pre>
<blockquote>This is a blockquote for cited text.</blockquote>
```

**Example:**
```html
<p>Water is <strong>essential</strong> for life. Its formula is H<sub>2</sub>O.</p>
<p>Einstein's equation: E = mc<sup>2</sup></p>
<blockquote cite="https://example.com">
    "The only way to do great work is to love what you do."
</blockquote>
```

---

## 3. Links & Navigation

```html
<!-- Basic link -->
<a href="https://google.com">Visit Google</a>

<!-- Open in new tab -->
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Open in New Tab</a>

<!-- Link to section on same page -->
<a href="#section-id">Jump to Section</a>
<div id="section-id">Target section</div>

<!-- Email and phone links -->
<a href="mailto:email@example.com">Send Email</a>
<a href="tel:+911234567890">Call Us</a>

<!-- Download link -->
<a href="file.pdf" download>Download PDF</a>
```

---

## 4. Lists

```html
<!-- Unordered List -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<!-- Ordered List -->
<ol type="1" start="1">
    <li>First</li>
    <li>Second</li>
    <li>Third</li>
</ol>
<!-- type can be: 1, A, a, I, i -->

<!-- Description List -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
</dl>

<!-- Nested List -->
<ul>
    <li>Frontend
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </li>
    <li>Backend
        <ul>
            <li>Node.js</li>
            <li>Express</li>
        </ul>
    </li>
</ul>
```

---

## 5. Tables

```html
<table border="1">
    <caption>Student Records</caption>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Grade</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Aryan</td>
            <td>A+</td>
        </tr>
        <tr>
            <td>2</td>
            <td>Rahul</td>
            <td>B</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3">End of Records</td>
        </tr>
    </tfoot>
</table>
```

**Merging cells:**
```html
<td colspan="2">Spans 2 columns</td>
<td rowspan="2">Spans 2 rows</td>
```

---

## 6. Forms (Complete)

```html
<form action="/submit" method="POST" enctype="multipart/form-data">
    <!-- Text input -->
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" placeholder="Enter name" required minlength="2" maxlength="50">

    <!-- Email -->
    <input type="email" name="email" placeholder="email@example.com" required>

    <!-- Password -->
    <input type="password" name="password" minlength="8" required>

    <!-- Number -->
    <input type="number" name="age" min="1" max="120" step="1">

    <!-- Date -->
    <input type="date" name="dob">

    <!-- File Upload -->
    <input type="file" name="avatar" accept="image/*">

    <!-- Radio Buttons -->
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">Male</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">Female</label>

    <!-- Checkboxes -->
    <input type="checkbox" id="agree" name="agree" value="yes" required>
    <label for="agree">I agree to terms</label>

    <!-- Dropdown Select -->
    <select name="country">
        <option value="" disabled selected>Choose Country</option>
        <option value="in">India</option>
        <option value="us">USA</option>
        <option value="uk">UK</option>
    </select>

    <!-- Textarea -->
    <textarea name="message" rows="5" cols="30" placeholder="Write your message..."></textarea>

    <!-- Hidden Input -->
    <input type="hidden" name="formType" value="contact">

    <!-- Range Slider -->
    <input type="range" name="rating" min="0" max="10" step="1">

    <!-- Color Picker -->
    <input type="color" name="favcolor" value="#ff0000">

    <!-- Submit & Reset -->
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
</form>
```

**All Input Types:**
| Type | Description |
|:---|:---|
| `text` | Single-line text |
| `email` | Email validation |
| `password` | Hidden characters |
| `number` | Numeric input |
| `tel` | Phone number |
| `url` | URL validation |
| `date` | Date picker |
| `time` | Time picker |
| `datetime-local` | Date and time |
| `month` | Month picker |
| `week` | Week picker |
| `color` | Color picker |
| `range` | Slider |
| `file` | File upload |
| `hidden` | Hidden data |
| `search` | Search field |

---

## 7. Semantic HTML5 Elements

```html
<header>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h2>Blog Post Title</h2>
        <p>Content of the article...</p>
        <figure>
            <img src="photo.jpg" alt="Description">
            <figcaption>Caption for the image</figcaption>
        </figure>
    </article>

    <section>
        <h2>Another Section</h2>
        <p>Content here...</p>
    </section>

    <aside>
        <h3>Related Links</h3>
        <p>Sidebar content...</p>
    </aside>
</main>

<footer>
    <p>&copy; 2026 My Website</p>
</footer>
```

---

## 8. Media Elements

```html
<!-- Image -->
<img src="image.jpg" alt="Description" width="300" height="200" loading="lazy">

<!-- Video -->
<video controls autoplay muted loop width="400">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Your browser does not support video.
</video>

<!-- Audio -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Your browser does not support audio.
</audio>

<!-- Embed YouTube -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" width="560" height="315" allowfullscreen></iframe>
```

---

## 9. Div & Span (Generic Containers)

```html
<!-- Block-level container -->
<div class="card">
    <h2>Card Title</h2>
    <p>Card content goes here.</p>
</div>

<!-- Inline container -->
<p>My favorite color is <span style="color: blue;">blue</span>.</p>
```

---

## 10. Global Attributes

| Attribute | Description | Example |
|:---|:---|:---|
| `id` | Unique identifier | `<div id="main">` |
| `class` | CSS class name(s) | `<p class="text bold">` |
| `style` | Inline CSS | `<p style="color:red;">` |
| `title` | Tooltip text | `<abbr title="HTML">` |
| `hidden` | Hides element | `<div hidden>` |
| `data-*` | Custom data attributes | `<div data-id="5">` |
| `contenteditable` | Makes content editable | `<p contenteditable>` |
| `draggable` | Makes element draggable | `<div draggable="true">` |

**Custom data attribute example:**
```html
<div data-user-id="42" data-role="admin">User Info</div>

<script>
    const div = document.querySelector('div');
    console.log(div.dataset.userId);  // "42"
    console.log(div.dataset.role);    // "admin"
</script>
```

---

## 11. Character Entities

| Entity | Symbol | Description |
|:---|:---|:---|
| `&lt;` | < | Less than |
| `&gt;` | > | Greater than |
| `&amp;` | & | Ampersand |
| `&quot;` | " | Double quote |
| `&apos;` | ' | Apostrophe |
| `&copy;` | © | Copyright |
| `&reg;` | ® | Registered |
| `&nbsp;` |   | Non-breaking space |
