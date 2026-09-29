# Using the TLDR case study workflow with Claude

This repo holds everything needed to add a **TLDR version** and a **"Full case study / TLDR" toggle** to a portfolio case study page in Webflow. Claude does the work through its Webflow connector. You review and publish.

It has been used on three pages so far: Validity Engage, Keyword Research, and Tailwind Ghostwriter. It works on other Webflow sites too. See [Adapting to your site](#adapting-to-your-site).

## What you get on each page

- **A toggle** near the top of the case study, usually beside the title or project details. "Full case study" is the default view.
- **A TLDR block** at the top of the case study content, with five sections:
  1. The Problem
  2. My Responsibilities
  3. Key Considerations & Trade-offs
  4. Improvements
  5. Outcome
- **Visuals from the full case study** (images, lightboxes, videos, and metrics rows) placed between the TLDR sections.
- **Shareable links:** adding `?view=tldr` to a page URL opens it in the TLDR view.

## Before you start

You need:

- **Claude with the Webflow connector** connected to the site. Claude asks for access the first time.
- **A case study page** built as a normal Webflow page. Class names don't matter. Claude looks for elements that play these three roles:

  | Role | What it is | Required? |
  | --- | --- | --- |
  | **Content wrapper** | One element that holds the case study content, meaning everything that should switch between the full and TLDR versions | Yes, or Claude can add one |
  | **Toggle spot** | Somewhere visible near the top, such as beside the title or project details | Yes, anywhere works |
  | **Shared content** | Anything inside the content wrapper that should show in both versions, such as a hero image | No |

  If a page doesn't have an obvious content wrapper, see [Adapting to your site](#adapting-to-your-site).
- **Optional:** write access to this repo, if you want Claude to save a copy of each TLDR here. See [Saving to GitHub](#saving-to-github).

## How to use it

### 1. Ask Claude

Start a chat with Claude, point it at this repo, and name the page:

> Add a TLDR version and toggle to the **Tailwind Ads** page in Webflow, the same way as the other case studies in m-zager/TLDR-Case-Study.

Mention anything you want done differently in the same message, for example:

> Keep it under 250 words, and use the before/after screenshots as the visuals.

### 2. What Claude does

1. Reads the page layout and finds the content wrapper, the toggle spot, and any shared content. On a site it hasn't worked on before, it tells you what it picked before changing anything.
2. Reads the page's full case study text and finds its images, lightboxes, videos, and metrics.
3. Writes the TLDR from the page's own content, without adding facts that aren't on the page.
4. Adds the toggle and the TLDR block, using the page's existing typography classes so the TLDR matches the rest of the page.
5. Tags the page so the script knows what to show in each view (see [How it works](#how-it-works)).
6. Adds the CSS and script from `src/` to the page's custom code.
7. Saves a copy of the TLDR to `case-studies/<page>-tldr.html` and commits it on a new branch.

Claude **does not publish** to your site.

### 3. Review in the Designer

Open the page in the Webflow Designer. The TLDR block sits at the top of the case study content, after any shared content like the hero image. You can edit its text and images like anything else on the page.

In the Designer you'll see **both versions stacked**. That's expected, because the Designer doesn't run custom code.

### 4. Ask for changes

Ask for changes in plain language, for example:

> Remove the assumption map from the TLDR, and move the core UX flow above Key Considerations.

> Add the dashboard walkthrough video below the Outcome section.

> Wrap the user flow image in a lightbox like in the full case study.

### 5. Test, then publish

1. Publish to your **webflow.io staging address** first. That's the only place the toggle works before going live.
2. On the staging page, check that:
   - the toggle switches between the full and TLDR versions
   - `?view=tldr` in the URL opens the TLDR view
   - switching while scrolled halfway down takes you to the top of the version you picked
   - lightbox images open when clicked
   - videos play in the TLDR view
   - anything that should stay visible, like the nav or footer, still shows in the TLDR view
3. Publish to your custom domain.

## How it works

Everything is driven by a few attributes on the page and one shared script. The script and CSS never look at class names.

| Attribute | Where | Effect |
| --- | --- | --- |
| `data-tldr-scope` | Content wrapper | Its **direct children** are what switches |
| `data-tldr="always"` | Shared content, a direct child of the content wrapper | Shown in both views |
| `data-tldr="summary"` | TLDR block, a direct child of the content wrapper | Shown only in the TLDR view |
| _(none)_ | Every other direct child of the content wrapper | Shown only in the full view |
| `data-tldr-set="full"` / `"tldr"` | Toggle links, anywhere on the page | Switch the view |
| `data-tldr-play` | A `<video>` in the TLDR | Plays only while the TLDR view is showing |

Only direct children of the content wrapper are switched. Anything outside it, like the nav, the page title, or the footer, is untouched.

Files:

- `src/tldr-toggle.html`: toggle markup
- `src/tldr-toggle.css`: toggle styles. The part under "Page custom code (head)" goes in each page's head code.
- `src/tldr-toggle.js`: goes in each page's footer code. It also:
  - scrolls to the top of the chosen version when someone switches mid-page
  - gives any lightbox with no media the image inside it, so lightboxes Claude adds open without a Designer step
- `case-studies/*.html`: a reference copy of each page's TLDR

## Adapting to your site

### How the roles map on this site

On zagerux.com, every case study page uses the same layout, so the roles map to these elements:

| Role | Element on zagerux.com |
| --- | --- |
| Content wrapper | `Project Details Content Block` |
| Toggle spot | End of `Project Info Items Block` (the Year / Scope / Timeline / Industry list) |
| Shared content | `Project Details Image Block` (the hero image) |
| TLDR block | A `Project Main Description Wrapper`, the same element the full case study's intro uses |

On another site, Claude finds the equivalents. If it isn't sure, it asks.

### No single content wrapper

Sometimes the case study sections sit side by side with other page parts, like the nav, the footer, or a "More projects" section. There are two ways to handle it:

- **Wrap the case study sections** in a new div and make that the content wrapper. This is the cleanest option.
- **Use a shared parent as the content wrapper**, and mark every direct child that should stay in both views, like the nav and footer, with `data-tldr="always"`. Anything left unmarked disappears in the TLDR view, so check this carefully on staging.

### CMS collection pages

If case studies come from a CMS collection, every case study shares one template page. Adding a TLDR block to the template adds the same block to every case study, so the static setup in this repo doesn't fit as-is. Instead:

1. Add a **TLDR** rich-text field to the collection and write each case study's TLDR there.
2. On the template, put a rich-text element bound to that field inside the content wrapper, and give it `data-tldr="summary"`.
3. Use conditional visibility to hide the TLDR block and the toggle on items whose TLDR field is empty.
4. Add the page custom code to the template once. The script works unchanged.

Rich-text fields can hold images, but not lightboxes, embeds, or metrics rows built from site components. Claude can set this up through the connector. Ask for the CMS version explicitly, since it's a different setup from the static pages here.

### No hero image

Nothing is needed. Without shared content, the TLDR view shows only the TLDR block. Anything without a `data-tldr` attribute shows in the full view only.

### Different typography

Class names vary between sites, and sometimes between pages on the same site. For example, Keyword Research on zagerux.com uses `Heading Style H5 5` and `Paragraph L Regular 4`. Claude reuses whatever heading and paragraph classes the page's case study already uses. Bullet spacing lives on a `tldr-list` combo class added to each paragraph style.

### Different brand colors

The toggle's colors are currently written for zagerux.com. To match another site, change them in two places:

- **In the Webflow Designer:** the `tldr-toggle` class has the track background (`#f1f1f1`), and the `tldr-toggle-btn` class has the inactive text color (`#5a6271`).
- **In the page's head code:** the selected button (`background-color: #1e1e1e; color: #fff;`) and the focus outline (`#1e1e1e`).

Or ask Claude to match the toggle to your site's button styles.

## Adding it without Claude

1. Pick your **content wrapper** and add the attribute `data-tldr-scope="true"` to it.
2. Add a block as a **direct child** of the content wrapper, give it `data-tldr="summary"`, and write the TLDR inside it. Put it after any shared content.
3. Give any shared content (direct children that should stay in both views) the attribute `data-tldr="always"`.
4. Add the toggle from `src/tldr-toggle.html` wherever you want it.
5. In **Page settings → Custom code**:
   - paste the head rules from `src/tldr-toggle.css` into the head code, inside `<style>` tags
   - paste `src/tldr-toggle.js` into the footer code, inside `<script>` tags
6. Publish to staging and test.

## Things to know

- **The toggle uses links, not buttons.** Webflow turns `<button>` elements into links, so the toggle uses links with `role="button"`. They still work with Enter and Space.
- **TLDR videos are embeds.** Webflow's background videos can't be copied through the connector, so TLDR videos are HTML embeds that point to the same files on your live site. If you replace a video in the full case study, update the embed too.
- **Copied metrics don't animate.** A metrics row copied into the TLDR won't have the original's count-up animation. Add it in the Designer if you want it.
- **The TLDR is a copy.** Editing the full case study doesn't update the TLDR. Ask Claude to refresh it, or edit it in the Designer.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Both versions show on the live site | Check that the page's head and footer code are there and that `data-tldr-scope` is on the content wrapper |
| Something that should stay, like the nav or footer, disappears in the TLDR view | It's a direct child of the content wrapper without `data-tldr="always"`. Add the attribute, or use a tighter content wrapper. |
| The TLDR block never shows | It must be a **direct** child of the content wrapper, with `data-tldr="summary"` |
| The toggle does nothing | The script only runs on a published page. Test on staging, not in the Designer or Preview. |
| A lightbox image doesn't open | Make sure the footer script is the latest version from `src/tldr-toggle.js`, which includes the lightbox fix |
| The page jumps to the bottom when switching | Update the footer script to the latest version |
| A TLDR video doesn't play | Check that the video URL in the embed still exists on the live site |

## Saving to GitHub

Claude can only push to this repo if it has write access. Either:

- **Add the repo as a source** for your Claude session, or
- **Give Claude a fine-grained token** limited to this repo with **Contents: Read and write**. Set a short expiration and delete the token when you're done, since it stays in the chat history.

Each page's TLDR goes on its own branch, such as `tldr-<page>`. Open a pull request into `main` to merge it.
