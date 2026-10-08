# DoofPlus Landing Page

Landing Page of **DoofPlus**, the pharmaceutical quality-management platform developed by IngesCompany (1ASI0729 · Desarrollo de Aplicaciones Open Source · UPC).

Built with HTML5, CSS3 and JavaScript, bilingual (English by default and Latin American Spanish) and responsive for desktop and mobile.

## Pages

| Page | Content |
|------|---------|
| `index.html` | Hero, segment access, services, features, About-the-Product video, benefits, about us, team, plans, testimonials, FAQ, contact and footer. |
| `demo.html` | Demo request form with validation and confirmation summary. |
| `terms.html` | Terms of Service. |
| `privacy.html` | Privacy Policy (Law N.° 29733). |

## Structure

```text
public/assets/
├── cursors/                    # Custom cursors (default, pointer and text)
├── i18n/                       # en.json and es.json (same keys in both files)
├── images/                     # Logo, hero image and team photos
├── scripts/
│   ├── main.js                 # Entry point (ES module) shared by every page
│   ├── config.js               # Web Application URL, video URL and segment routes
│   ├── i18n.js                 # I18nService: loads the JSON files and applies data-i18n
│   ├── components/             # Language switcher, navbar, segment access, accordions,
│   │                           # billing toggle, product video and demo request
│   ├── effects/                # Magnetic effect of the call-to-action buttons
│   └── utils/                  # Safe access to localStorage and sessionStorage
└── styles/
    ├── main.css                # Imports the modules below in cascade order
    ├── variables.css           # Design tokens
    ├── reset.css               # Base element styles
    ├── layout.css              # Container, navbar, sections and footer
    ├── grid.css                # 12-column fluid grid and the column span of each block
    ├── components.css          # Buttons, links, forms and skip link
    ├── sections.css            # Sections of index.html
    ├── pages.css               # demo.html, terms.html and privacy.html
    ├── cursor.css              # Custom cursors
    └── responsive.css          # Breakpoints (1080px, 900px and 600px)
```

Texts are referenced from the HTML with `data-i18n` attributes. To add a text, add the same key to `en.json` and `es.json`. English (`en-US`) is the default language and Latin American Spanish (`es-419`) is the alternative.

## Run locally

The scripts are ES modules and the texts are loaded with `fetch`, so the site must be served over HTTP (opening `index.html` directly from the file system does not load them). Use the built-in server of WebStorm (*Open in Browser*) or:

```bash
python -m http.server 8080
```

## Configuration

`public/assets/scripts/config.js` has the settings that depend on other DoofPlus products:

- `WEB_APP_URL`: base URL of the DoofPlus Web Application. The QA/QC and Production access buttons open `/login?segment=qa` and `/login?segment=production`; until it is set, they lead to the *Choose your workspace* section.
- `VIDEO_URL`: YouTube embed URL of the About-the-Product video.

## Layout grid

Following the Web Style Guide (section 4.1.2), every layout is a **12-column fluid grid** (`grid.css`) with gutters on the 8-point grid. The number of columns never changes; each block spans a number of them:

| Screen | Gutter | Example spans |
|--------|--------|---------------|
| Desktop (> 1080px) | 32px | Hero 6 + 6 · Services 3 + 3 + 3 + 3 · Features 5 + 7 · Team 4 + 4 + 4 · Footer 4 + 2 + 2 + 2 + 2 |
| Tablet (≤ 1080px) | 24px | Services 6 + 6 · Team 6 + 6 · Footer 12, then 3 + 3 + 3 + 3 |
| Mobile (≤ 900px) | 16px | Every block spans 12 columns (one column) |

### Mobile layout

On mobile (≤ 900px) the site follows the Figma phone design:

- Header with logo, language switch and a menu button that opens a full-screen menu (links, Sign in, Get Started, Request a demo and language).
- The Features preview panel is hidden and only the accordion remains.
- About the Product shows the video between the intro and the chapters; Contact shows the email and location after the form.
- Footer link groups in two columns, followed by the language switch, the QA/QC and Production access buttons and the copyright.
- The demo request page drops its dark panel, shows a short "← Back" link and lists the request summary as label/value rows.

## Accessibility and SEO

- Skip link to the main content, ARIA attributes on menus, accordions, toggles and form errors, and alternative text on every image.
- `description`, `keywords` and `author` meta tags on every page.
- The magnetic effect only reacts to a mouse and is disabled when the visitor prefers reduced motion.

## Deployment

The site is static and is published with GitHub Pages from the `main` branch (*Settings > Pages > Deploy from a branch > main / root*).
