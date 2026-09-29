# TLDR-Case-Study
Create a TLDR version of your product case study and create a toggle on your webpage to filter between the two versions.

## How it works (Webflow)

Each case study page gets:

1. A **toggle** (`src/tldr-toggle.html`) at the top of the content block.
2. A **TLDR summary block** (`case-studies/<page>-tldr.html`) placed after the hero image.
3. **Page custom code**: the state and visibility rules from `src/tldr-toggle.css` go in the page `<head>`, and `src/tldr-toggle.js` goes before `</body>`.

Markup contract:

| Attribute | Where | Effect |
| --- | --- | --- |
| `data-tldr-scope` | Content block wrapper | Its direct children get filtered |
| `data-tldr="always"` | Toggle, hero image | Shown in both views |
| `data-tldr="summary"` | TLDR block | Shown only in the TLDR view |
| _(none)_ | Every other child | Shown only in the full view |
| `data-tldr-set="full\|tldr"` | Toggle links | Switch the view |

Link to `?view=tldr` to open a page in the TLDR view.

## Status

| Case study | Webflow page | TLDR |
| --- | --- | --- |
| Validity Engage | `/work/engage` | Added, not yet published |

Every TLDR covers: the problem, my responsibilities, key considerations and trade-offs, improvements, and the outcome.
