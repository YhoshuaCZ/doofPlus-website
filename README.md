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
├── images/                 # Logo, hero image and team photos
├── scripts/
│   ├── main.js             # Translations, navigation, accordions, plans and demo requests
│   └── translations/       # en.js and es.js (same keys in both files)
└── styles/style.css        # Design tokens, components and responsive rules
```

Texts are referenced from the HTML with `data-i18n` attributes. To add a text, add the same key to `en.js` and `es.js`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8080
```

## Configuration

`public/assets/scripts/main.js` has two constants to set when the related resources are published:

- `WEB_APP_URL`: base URL of the DoofPlus Web Application, used by the QA/QC and Production access buttons.
- `VIDEO_URL`: YouTube embed URL of the About-the-Product video.

## Deployment

The site is static and is published with GitHub Pages from the `main` branch (*Settings > Pages > Deploy from a branch > main / root*).
