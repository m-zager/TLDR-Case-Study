# Using the TLDR case study workflow with Claude

This repo holds everything needed to add a **TLDR version** and a **"Full case study / TLDR" toggle** to a portfolio case study page in Webflow. Claude does the work through its Webflow connector. You review and publish.

It has been used on three pages so far: Validity Engage, Keyword Research, and Tailwind Ghostwriter.

## What you get on each page

- **A toggle** at the end of the project info list (Year / Scope / Timeline / Industry). "Full case study" is the default view.
- **A TLDR block** right after the hero image, with five sections:
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
- **A case study page with the standard portfolio layout.** The workflow expects these elements, which every case study page on this site already has:
  - `Project Info Items Block`, where the toggle goes
  - `Project Details Content Block`, which wraps everything that switches between the two versions
  - `Project Details Image Block`, the hero image, shown in both versions
- **Optional:** write access to this repo, if you want Claude to save a copy of each TLDR here. See [Saving to GitHub](#saving-to-github).

## How to use it

### 1. Ask Claude

Start a chat with Claude, point it at this repo, and name the page:

> Add a TLDR version and toggle to the **Tailwind Ads** page in Webflow, the same way as the other case studies in m-zager/TLDR-Case-Study.

Mention anything you want done differently in the same message, for example:

> Keep it under 250 words, and use the before/after screenshots as the visuals.

### 2. What Claude does

1. Reads the page's full case study text and finds its images, lightboxes, videos, and metrics.
2. Writes the TLDR from the page's own content, without adding facts that aren't on the page.
3. Adds the toggle and the TLDR block, using the page's existing typography classes so the TLDR matches the rest of the page.
4. Tags the page so the script knows what to show in each view (see [How it works](#how-it-works)).
5. Adds the CSS and script from `src/` to the page's custom code.
6. Saves a copy of the TLDR to `case-studies/<page>-tldr.html` and commits it on a new branch.

Claude **does not publish** to your site.

### 3. Review in the Designer

Open the page in the Webflow Designer. The TLDR block sits right after the hero image, and you can edit its text and images like anything else on the page.

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
3. Publish to your custom domain.

## How it works

Everything is driven by a few attributes on the page and one shared script.

| Attribute | Where | Effect |
| --- | --- | --- |
| `data-tldr-scope` | `Project Details Content Block` | Its direct children are what switches |
| `data-tldr="always"` | Hero image block | Shown in both views |
| `data-tldr="summary"` | TLDR block | Shown only in the TLDR view |
| _(none)_ | Every other child | Shown only in the full view |
| `data-tldr-set="full"` / `"tldr"` | Toggle links | Switch the view |
| `data-tldr-play` | A `<video>` in the TLDR | Plays only while the TLDR view is showing |

Files:

- `src/tldr-toggle.html`: toggle markup
- `src/tldr-toggle.css`: toggle styles. The part under "Page custom code (head)" goes in each page's head code.
- `src/tldr-toggle.js`: goes in each page's footer code. It also:
  - scrolls to the top of the chosen version when someone switches mid-page
  - gives any lightbox with no media the image inside it, so lightboxes Claude adds open without a Designer step
- `case-studies/*.html`: a reference copy of each page's TLDR

## Adding it without Claude

1. Add the toggle from `src/tldr-toggle.html` to the end of the page's `Project Info Items Block`.
2. Add a `Project Main Description Wrapper` right after the hero image block, give it the attribute `data-tldr="summary"`, and write the TLDR inside it.
3. Add the attributes `data-tldr-scope="true"` to `Project Details Content Block` and `data-tldr="always"` to the hero image block.
4. In **Page settings → Custom code**:
   - paste the head rules from `src/tldr-toggle.css` into the head code, inside `<style>` tags
   - paste `src/tldr-toggle.js` into the footer code, inside `<script>` tags
5. Publish to staging and test.

## Things to know

- **Styles differ between pages.** Some pages use suffixed classes, such as `Heading Style H5 5` and `Paragraph L Regular 4` on Keyword Research. The TLDR reuses whatever the page already uses, and bullet spacing lives on the `tldr-list` combo class for each paragraph style.
- **The toggle uses links, not buttons.** Webflow turns `<button>` elements into links, so the toggle uses links with `role="button"`. They still work with Enter and Space.
- **TLDR videos are embeds.** Webflow's background videos can't be copied through the connector, so TLDR videos are HTML embeds that point to the same files on your live site. If you replace a video in the full case study, update the embed too.
- **Copied metrics don't animate.** A metrics row copied into the TLDR won't have the original's count-up animation. Add it in the Designer if you want it.
- **The TLDR is a copy.** Editing the full case study doesn't update the TLDR. Ask Claude to refresh it, or edit it in the Designer.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Both versions show on the live site | Check that the page's head and footer code are there and that `data-tldr-scope` is on the content block |
| The toggle does nothing | The script only runs on a published page. Test on staging, not in the Designer or Preview. |
| A lightbox image doesn't open | Make sure the footer script is the latest version from `src/tldr-toggle.js`, which includes the lightbox fix |
| The page jumps to the bottom when switching | Update the footer script to the latest version |
| A TLDR video doesn't play | Check that the video URL in the embed still exists on the live site |

## Saving to GitHub

Claude can only push to this repo if it has write access. Either:

- **Add the repo as a source** for your Claude session, or
- **Give Claude a fine-grained token** limited to this repo with **Contents: Read and write**. Set a short expiration and delete the token when you're done, since it stays in the chat history.

Each page's TLDR goes on its own branch, such as `tldr-<page>`. Open a pull request into `main` to merge it.
