# TLDR-Case-Study
Create a TLDR version of your product case study and create a toggle on your webpage to filter between the two versions.

## How it works (Webflow)

Each case study page gets:

1. A **toggle** (`src/tldr-toggle.html`) at the end of the Project Info Items Block.
2. A **TLDR summary block** (`case-studies/<page>-tldr.html`) placed after the hero image.
3. **Page custom code**: the state and visibility rules from `src/tldr-toggle.css` go in the page `<head>`, and `src/tldr-toggle.js` goes before `</body>`.

Markup contract:

| Attribute | Where | Effect |
| --- | --- | --- |
| `data-tldr-scope` | Content block wrapper | Its direct children get filtered |
| `data-tldr="always"` | Hero image | Shown in both views |
| `data-tldr="summary"` | TLDR block | Shown only in the TLDR view |
| _(none)_ | Every other child | Shown only in the full view |
| `data-tldr-set="full\|tldr"` | Toggle links | Switch the view |

Link to `?view=tldr` to open a page in the TLDR view.

The TLDR block reuses each page's own typography classes (for example `heading-style-h5` on Engage, `heading-style-h5-5` on Keywords), so check a page's existing classes before adding its TLDR. List spacing lives on the `tldr-list` combo class for each paragraph style.

Lightboxes added through Webflow's API have no media, because the API can't set it. The script in `src/tldr-toggle.js` fills any empty lightbox with the image inside it and re-runs Webflow's lightbox setup, so no Designer step is needed.

## Status

| Case study | Webflow page | TLDR |
| --- | --- | --- |
| Validity Engage | `/work/engage` | Added, not yet published |
| Keyword Research | `/work/keywords` | Added, not yet published |
| Tailwind Ghostwriter | `/work/ghostwriter` | Added, not yet published |

Every TLDR covers: the problem, my responsibilities, key considerations and trade-offs, improvements, and the outcome.
