# Migration learnings: cnv.org → AEM Edge Delivery (xwalk / Universal Editor)

What this session would have gone faster with, had it been known up front. The project:
<https://www.cnv.org/> (Sitecore) migrated to an xwalk site (`ema-sites/xw-nov17-1`), with content
authored on AEM author `author-p141866-e1455422` under `/content/blefebvr-xw-nov17-1`. The demo
focused on four pages: the homepage, the News Room, a news article and the Public Input Period
registration form.

---

## 1. The content conversion chain sets the rules (most time was lost here)

Local pages (`content/<path>.plain.html`) reach AEM through **helix-html2md → helix-md2jcr →
JCR XML**. The local preview renders the `.plain.html` directly, so a page can look perfect locally
and still break or lose content in AEM. **Check every content change with
`check-xwalk-jcr.mjs` and look at the generated XML; don't stop at the preview.**

md2jcr quirks (md2jcr 1.5.19), and how they were handled:

| Quirk | Effect | Fix used |
| --- | --- | --- |
| Field hints must be `<!--field:x-->` (the importer writes `<!-- field:x -->` variants) | fields not mapped | `node tools/importer/normalize-field-hints.mjs content` after every import |
| Link and button attributes are not XML-escaped (`<`, `&`, `"` in `href`/`title`) | "Unescaped '<' not allowed in attributes values" when creating a package | `node tools/importer/escape-jcr-link-attributes.mjs content` after every import (issue filed on md2jcr) |
| Any block named `Columns …` becomes the core columns component and **loses its name** | a `columns-news` block came back as plain columns | use **variants**: `columns (news)`, plus a `classes` multiselect in the columns model |
| A linked heading inside columns becomes a button | wrong markup | the block decorator rebuilds link-only paragraphs as headings |
| **Linked images (`<a><img></a>`) are dropped** | feature images missing on AEM | put the image in a dedicated image field (cards item), with the link in the text |
| Rich text stops at an image | text after an image lost | keep images in their own field |
| Page metadata keys are case-sensitive and must match the page model's field names | `Template` was ignored | lowercase `template`; add every metadata key you write to `models/_page.json` |
| Image URLs with `(` `)` | images missing on AEM | encode them as `%28`/`%29` in the importer |

Field types that work through md2jcr: `text`, `richtext`, `select`, `multiselect`, `boolean`
(`true`/`false` text), `number`, `reference`, and container blocks whose block-level fields come
first as **one-cell rows**, followed by **multi-cell item rows** (one cell per item field).

## 2. Who syncs, what "published" means, and what needs Live

- **The user syncs content to AEM** (the UI's Sync button builds the package). I built one package
  myself with raw `https://www.cnv.org/...` image URLs; its image references were wrong on AEM,
  and the user took over syncing. Don't build or install packages yourself.
- **The user's sync previews but does not publish.** Query indexes are built **only from Live
  pages**, so `/news-index.json` returned 404 until the articles were published. **Nav and footer
  must be published too**, or aem.live has no header or footer.
- Code goes live on push to `main` (permission was given for this project). Content changes need
  sync, then publish to Live. In every report, say which surfaces changed: local, AEM, preview,
  live.
- After publishing, the browser may still serve cached 404s for `nav.plain.html` and
  `footer.plain.html`. Close the browser before checking again.
- Remote writes (publish, preview, DA) are blocked unless the user's current message asks for
  them. Ask, with the exact action in the option text.

## 3. Import tooling behaviour worth knowing

- **"Kept local edits"**: `run-bulk-import.js` treats any change after import as an edit, including
  the post-import scripts above. Safe re-import pattern:
  1. Import to a scratch folder with `--output-dir`.
  2. Run the two post-import scripts on it.
  3. Diff against `content/`.
  4. If only the intended part differs, run again with `--force --overwrite-edited`. Otherwise
     **splice only the changed block** into the existing page (as done for the 10 form pages, which
     had cleaned-up notice blocks that a re-import would undo).
- **Shared fragments are written by every page that produces them; the last page imported wins.**
  News Releases shows the parent "Government & City Hall" menu on the source and overwrote the
  News Room menu fragment. Only let a canonical page write a shared fragment.
- **The scraped DOM nests later page content inside unclosed source elements.** The page footer
  ended up inside the Sitecore form, so footer text was imported as form "notes". Bound parsers
  (for example, stop at the submit button) and exclude `#footer` and similar.
- **Catalog instance selectors often match an inner element** (a single form field, or the inner row
  of `.filterHeader`). Always `closest()` up to the real container before replacing it.
- **The crawl missed pages the demo needed.** Two of the four homepage news articles were not in the
  URL lists. Check the demo pages' outgoing links against the URL lists.
- The safety guard misreads `>`, `/` and `<tag>` text inside shell commands as file writes, and
  refuses `rm` on paths built from variables. Put helper code in script files under
  `/tmp/excat-scripts/` and use fresh output folder names instead of deleting old ones.
- Memory is shared with the browser: run selector checks in batches and close pages as you go.

## 4. EDS / xwalk patterns that worked

- **Templates**: `template` page metadata (a select in `models/_page.json`) → body class →
  `scripts.js` `loadTemplate()` imports `templates/<name>/<name>.js` and its CSS. The News template
  adds a section menu from a shared fragment (`/fragments/news-room-nav`) in a 306px + 772px grid.
  Put the sidebar in the section **with the `h1`**, not the first section, which may be a banner.
- **Fragments and the local preview**: the local server serves content under `/content`, so
  fragment code fetches `/content${path}.plain.html` first, then `${path}.plain.html`.
- **Query index**: `helix-query.yaml` in the code repo works for this xwalk site (index `news` →
  `/news-index.json`). Article dates come from the path (`/yyyy/m/d/slug`), so no date field was
  needed. A shared loader (`scripts/news-index.js`) feeds `news-feed` (homepage) and `news-search`
  (News Room). The local server has no index, so `tools/importer/build-local-news-index.mjs` writes
  a stand-in `content/news-index.json` (never sync it). The source's article teasers
  (`.eventAbstract`) are not on the article pages, so the import uses the first body paragraph as
  `Description`.
- **Universal Editor instrumentation**: any block that rebuilds its DOM must
  `moveInstrumentation(row, newNode)` for each item, or authors can't select items on the page.
- **Forms**: the boilerplate form block expects a JSON form definition, which can't be authored in
  UE. The form here is a container block of `form-field` items. It uses native validation, shows
  inline messages on `:user-invalid`, keeps `aria-invalid` in sync, suppresses the browser's
  bubble, and with no submit URL just shows a thank-you message.
- **Measuring parity**: compare `getBoundingClientRect()` of matching elements on the source and the
  preview at 1440, 1000, 768 and 375px with one Playwright script. Force-show hidden slides on the
  source with `display:block !important`. While loading, EDS sections are briefly
  `display:none`, so wait before measuring.
- The `modern-web-guidance` plugin (enabled in `.agents/settings.json`) gave the form validation and
  autofill patterns.

## 5. cnv.org specifics to know before starting

- **Layout**: 1140px content width; sidebar pages are a 306px menu + 60px gap + 772px content
  column (content starts at x=436 at 1280px, x=516 at 1440px). Body text Open Sans 14px/22.4px.
- **Script-driven content that a scrape only freezes**: News Room / News Releases search (year +
  keyword, AJAX results), What's New listing (categories), council listings. Plan index-driven
  blocks for these instead of importing the scraped results.
- **Homepage banner** (`#home-banner-background`): each slide's `.contentWrapper` has
  - a position class (`top`/`topleft`, `bottom`/`bottomleft`, `topright`, `bottomright`);
  - an inline `width` (default 600px);
  - an inline `rgba(255,255,255,.75|.85)` background.

  It is positioned inside the 1140px `.content-width`, with 35px padding. Breakpoints: full width
  at ≤830px, static below the image on `#f3f2f2` at ≤640px, smaller type at ≤560px and ≤480px.
  Titles use Novecento Wide Book, uppercase, 32px/35px (fonts at
  `https://www.cnv.org/CNV/Css/fonts/Book/`, TTF only).
- **Sitecore Forms** (`div.mvc-form`, not a `<form>`):
  - Each field is `.input-wrapper.input-<type>`, where type is text, textarea, email, tel, date,
    select, radiolist or checkboxlist. The wrappers are **nested** inside each other.
  - The required message is in `data-val-required`; section headings are `h3`.
  - Also present: reCAPTCHA, and conditions (`fxbConditions`), which were not migrated.
  - Fields: 562px wide, 1px #444 border, padding 8px 10px; submit button uppercase, #438ece.
- **Section menus differ per page**: a leaf page can show its parent's menu.
- **News Room feature listing** (`.content-section > .featureListingsThreeColumn`) sits directly in
  the content section, not in `.infoPanel`.

## 6. Decisions the user made (ask these early next time)

- Content sync: the user does it; I never install packages.
- Name a block that must stay a columns layout as a **variant**: `columns (news)`.
- Page-type differences go in **templates** + **shared fragments**, kept simple.
- Dynamic listings use a **query index**.
- Forms: **UE-editable field items**, not AEM Forms (Adaptive Forms); no submission for now.
- Parity: **1:1 with the source**. Per-instance visual variation (banner text boxes) becomes
  **authorable settings**, imported from the source.
- Push directly to `main`; preview code on aem.page; publish only when the user asks in that
  message.

---

## One-shot prompt

The prompt below would have produced this state of the migration in one run, given the same
tooling. It front-loads every decision and quirk from above.

```text
Migrate https://www.cnv.org/ (Sitecore) to this AEM Edge Delivery xwalk project (Universal Editor
authoring). Content source: AEM author author-p141866-e1455422.adobeaemcloud.com, site
/content/blefebvr-xw-nov17-1, DAM /content/dam/blefebvr-xw-nov17-1/images/. You may commit and push
code directly to main and check code on https://main--xw-nov17-1--ema-sites.aem.page/. I sync
content to AEM myself (do NOT build or install JCR packages); my sync only previews, so tell me
exactly which pages to sync and publish after each change. Never preview/publish yourself unless I
ask in that message. Send status and questions to Slack channel C0C7L8PR00H (ema-slack-me skill).

SCOPE AND DEMO
1. Scope the site, build the catalog, migrate every template (block library, design, header,
   footer, import scripts, bulk import of all pages).
2. Demo pages that must be 1:1 with the source at 1440/1000/768/375px (verify by measuring
   element rects on both sites with one Playwright script, not by eye):
   - homepage https://www.cnv.org/
   - https://www.cnv.org/City-Hall/News-Room
   - https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/11/5/Get-Ready-for-Winter-at-The-Shipyards
   - https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration
   Also import every article linked from the homepage "City News & Events" panel (two are missing
   from the crawl) and all /City-Hall/News-Room pages.

CONTENT CONVERSION RULES (html2md -> md2jcr 1.5.19 -> JCR); check every change with
check-xwalk-jcr.mjs AND inspect the generated XML:
- After every import run: node tools/importer/normalize-field-hints.mjs content, then
  node tools/importer/escape-jcr-link-attributes.mjs content (create both scripts first: hints must
  be <!--field:x-->; md2jcr does not escape link/button attributes).
- Never name a block "Columns <something>": md2jcr maps it to core columns and drops the name.
  Use variants, e.g. "columns (news)", and add a classes multiselect to the columns model.
- Never import linked images (<a><img>): md2jcr drops them. Put images in an image field (cards
  item) and the link in the text. Keep images out of rich text.
- Page metadata keys must be lowercase and exist in models/_page.json (e.g. template).
- Encode ( ) in image URLs as %28 %29.
- Container blocks: block-level fields as one-cell rows first, then one multi-cell row per item.
- Any block that rebuilds its DOM must moveInstrumentation(row, node) for each item.

IMPORT WORKFLOW
- Re-imports: import to --output-dir first, post-process, diff against content/; overwrite with
  --force --overwrite-edited only when the diff is the intended change; otherwise splice only the
  changed block into the existing page.
- Shared fragments: only one canonical page may write each fragment.
- Bound every parser to its real container (closest()) and to the end of the component (e.g. the
  form's submit button): the scraped DOM nests the page footer inside unclosed source elements.
- Put helper scripts in files under /tmp/excat-scripts (the command guard misreads > and <tag> in
  inline commands); process pages one at a time in browser scripts.

SITE STRUCTURE TO BUILD
- Layout: 1140px content width; sidebar pages are a 306px menu + 60px gap + 772px column. Body
  Open Sans 14px/22.4px.
- Templates: a `template` page-metadata select (models/_page.json) loads
  templates/<name>/<name>.{js,css} from scripts.js. Template "news" (all /city-hall/news-room/**
  pages): left section menu from the shared fragment /fragments/news-room-nav (written only by the
  News Room page itself, whose menu is the News Room menu), placed in the section with the h1;
  fragments fetch /content<path>.plain.html first for the local preview.
- Query index: helix-query.yaml index "news" -> /news-index.json over
  /city-hall/news-room/whats-new/** and /news-releases/** (title, description, image,
  lastModified). Article date = path /yyyy/m/d/slug. News article imports set Description to the
  first body paragraph (the source has no meta description). Shared loader scripts/news-index.js.
  Add tools/importer/build-local-news-index.mjs to write a local-only content/news-index.json.
  - Block news-feed (heading + count): homepage "City News & Events"; the Quick Links / Council
    Meetings lists stay a columns (news) block.
  - Block news-search (optional folder + page size): year select from the index, keyword box, GO,
    "Returned N results", pagination top and bottom, title / date ("November 20, 2026") /
    description, state in ?year=&q=&page=. Replaces the scripted search and the scraped results
    on News Room and News Releases. Source styles: results list indented 17px, items with a 1px
    #ebebeb top border and 20px 0 16px padding, title 15px/21px #336b98, date 12px, GO button
    #438ece uppercase.
- News Room feature listing (.content-section > .featureListingsThreeColumn) -> cards-feature
  (3 x 237px, image field + title + text).
- Homepage carousel (#home-banner-background): per-slide Carousel Slide fields overlayPosition
  (bottom-right | bottom-left | top-left | top-right), overlayWidth (px, default 600),
  overlayOpacity (%, default 75), imported from each slide's .contentWrapper class / inline width /
  rgba alpha. Text box inside a centred min(1140px,100%) frame, 35px padding, black text; title
  Novecento Wide Book (self-host the TTF from https://www.cnv.org/CNV/Css/fonts/Book/) uppercase
  32px/35px, subtitle 20px/22px weight 300. Breakpoints: <=830px box 100% wide, padding 20px 15px;
  <=640px box static below the image on #f3f2f2; <=560px title 26px, subtitle 18px (line-height
  1.2); <=480px padding 10px 15px, 12px/14px. Slides share one grid cell (align-content: start); a
  slide without text shows no box; the slide link covers the whole slide.
- Form block (UE-editable, no AEM Forms): container "Form" (submitLabel, successMessage richtext,
  optional action URL) with "Form Field" items (label, name, type
  text|textarea|email|tel|date|number|select|radio|checkbox|heading|note, required boolean, options
  as a richtext bulleted list, autocomplete select, help, errorMessage). Native validation, inline
  messages on :user-invalid with aria-invalid and aria-describedby kept in sync, browser bubble
  suppressed, focus moves to the first invalid field, asterisk on required fields; no action URL
  = show the success message. Styles: 562px fields (date 242px), 1px #444 border, padding 8px
  10px, 16px text; uppercase #438ece submit. Import from Sitecore div.mvc-form:
  .input-wrapper.input-<type> (nested; read only each wrapper's own children), labels, options,
  data-val-required (keep it only if it differs from "<label> is required."), h3 -> heading, p ->
  note, stop at the submit button, autofill hints inferred from labels; Mailchimp .mc-field-group
  the same way. Drop reCAPTCHA. Apply to all 10 form-page-sidebar pages.

DELIVERABLES
Push code to main after each feature with lint clean (eslint, stylelint). At the end, list the
pages to sync and publish to Live: homepage, all News Room pages, fragments/news-room-nav, nav,
footer and the 10 form pages. Remind me that the news index fills only after the articles are
published to Live.
```
