# ADURE landing page

A responsive, editable landing page using semantic HTML, CSS and vanilla JavaScript. It follows the supplied ADURE wireframe and uses Fira Sans 300, Source Sans Pro 300, the supplied bilingual logo, and ADURE blue and cyan.

## Open the HTML deliverable

Open `index.html` in a modern browser. Keep `styles.css`, `script.js`, `og.png` and the `assets` folder alongside it. All page photographs, the logo and both fonts are local. Browser storage and sharing features work best through an HTTP server. Enquiry preparation uses the visitor’s email app.

The root HTML, CSS and JavaScript are the primary editable deliverable. The `app` and `public` folders provide a small Sites hosting adapter; the landing-page interactions themselves use vanilla JavaScript.

## Preview and build

For the hosted adapter, use Node 22.13 or newer and pnpm. Run `pnpm install`, `node sync-site.mjs`, and `pnpm run dev`. Run `pnpm run build` for the production build. `sync-site.mjs` copies the standalone page into the hosting adapter; preserve the final metadata in `app/layout.tsx` when making changes. The final social preview uses the private preview URL.

## Working interactions

- Mobile navigation, internal section links and back-to-top navigation.
- Buy/Lease selection, location/type/bedroom/price filters, empty states and reset.
- Three lease demonstration listings from the supplied wireframe. There are no invented purchase listings; Buy shows a clear enquiry path.
- Saved properties persist in this browser when local storage is available. They are not shared across devices.
- Property details and native sharing or clipboard fallback. Shared links open the corresponding property preview.
- Accessible modal dialogs, Escape dismissal, native focus containment and management accordions.
- Categorized enquiry form prepares a `mailto:` message. The page never claims that an enquiry has been submitted.

## Content and image provenance

The supplied wireframe is the authority for homepage order and copy. The questionnaire supports ADURE’s buying, selling, leasing and management positioning. The company profile supports the proof figures and contact details. Volta SKAI is a visual reference only; its text, branding and images are not used.

The page combines eight official ADURE Abu Dhabi project images with ten generated architectural concepts. The generated set replaces the hero and weaker building imagery with distinct, coordinated visuals; it avoids Dubai landmarks and does not depict verified ADURE properties. Original source photos remain as working backups. Current sources are listed in assets/sources.json; only displayed images are included in the HTML package.

`assets/logo.svg` preserves the original supplied SVG. `assets/logo-display.svg` contains identical artwork with the empty export canvas reduced and clear space retained. No lettering, paths, colors or artwork proportions were changed. Deep blue `#004789` and cyan `#00B7F1` come from the SVG. Supporting neutral colors are design choices, not additional official brand colors. No separate comprehensive brand manual was supplied.

Font files were downloaded from Google Fonts for Fira Sans and Source Sans Pro at weight 300. `og.png` is an AI-generated abstract social preview; it does not depict an ADURE property or replace the official logo.

## Items for ADURE confirmation

- All three example listing names, prices, specifications, availability and assigned team labels come from the wireframe and require confirmation. They are labelled as preview data in the page.
- Portfolio imagery combines five illustrative concepts with the official Qaryat Al Hidd project image. Generated visuals are not photographs of verified properties.
- The profile and wireframe state establishment in 2002; the older website states 2008. This draft follows the supplied profile.
- The profile and wireframe use 02 6457869, 0566805125 and Inquiries@adu-re.com. The older website shows 02 666 4433 and other contacts. This draft follows the supplied profile and wireframe.
- 3,000+ units, 200+ professionals, 98% occupancy and 1–2 weeks average vacancy are supplied company figures, not independently verified current measurements.
- Client-sector information is retained. Individual client logos have not been added without a verified web-ready asset set.
- Media, careers, upcoming projects and Qaryat Al Hidd use relevant in-page information or enquiry actions. Dedicated pages remain outside this landing-page scope.
- Privacy and terms dialogs describe the prototype. Approved legal copy is required for public launch.

## Backend connections still required

Live property inventory, CMS, enquiry submission/CRM routing, server-side validation, spam protection, consent handling, approved privacy/terms, analytics and conversion tracking are not connected. No enquiry is stored or transmitted by the page itself. Email is sent only by the visitor from their email application. Arabic content, payments, bookings and portal integrations are outside this draft.

## Validation

The production build was checked. Browser review covers desktop, tablet and mobile layouts, navigation, filters, saved properties, details, enquiry dialogs, local assets and overflow. The handoff does not claim a full WCAG certification or live backend testing.
