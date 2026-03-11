# HTML5 Syntax Guide

Modern HTML focusing on semantic structure and accessibility.

## Basic Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern HTML5 Page</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
```

## Semantic Elements
| Element | Description |
| :--- | :--- |
| `<header>` | Introduction or navigation links |
| `<nav>` | Navigation links |
| `<main>` | Core content of the document |
| `<article>` | Self-contained composition (blog post, news story) |
| `<section>` | Generic standalone section |
| `<aside>` | Content indirectly related to main content (sidebar) |
| `<footer>` | Footer for its nearest sectioning content |

## Forms (Modern)
```html
<form action="/submit" method="POST">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" placeholder="Enter username" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <button type="submit">Submit</button>
</form>
```

## Media
```html
<img src="path/to/img.jpg" alt="Description" loading="lazy">
<video controls width="250">
    <source src="video.mp4" type="video/mp4">
</video>
```
