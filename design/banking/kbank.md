# K bank — Design Reference Reference Design System

<!-- design-md:section experience -->
## 1. Experience

### Visual Theme & Atmosphere

K bank is South Korea’s first internet-only bank. Its official brand story describes a “pleasant financial life” built from the basics of banking—rates and fees—then carries that promise into everyday rewards, investment, safety, and connected services. The public-web product capture has a more restrained job than that broad marketing story: it uses a white canvas and black chrome with two blue actions, while product information pages mix the loaded K bank webfont with system-stack controls. K bank’s own resource center makes the blue pair and Pretendard K Edition part of its brand expression; its culture writing adds a participatory way of working. These sources explain the brand’s current public expression, but only the supplied selector-backed product capture establishes the tokens and components below.

The evidence covers five distinct public product URLs plus a duplicate home snapshot. It does not cover the authenticated app, transfer journeys, account management, documentation chrome, or native UI. Brand marketing, the resource center, and culture writing are therefore retained as context and asset evidence—not silently converted into generic banking components or product states.

**Key characteristics:**

- White public-web canvas and black structural text
- Official dark-blue `#0114A7` and secondary blue `#4262FF`, both observed on separate public actions
- Pretendard K Edition is the loaded public-web family; selected product controls also expose an operating-system stack
- Flat, selector-local controls: 8px and 10px action corners coexist with 0px tabs and utility controls

<!-- design-md:claim primary-tasks kind=user-outcomes count=3 lang=en -->
### Primary tasks

- Explore savings, card, and investment products on the public pages
- Read what a deposit product is worth before its conditions
- Check the eligibility limits a product page spells out
<!-- design-md:claim-end -->

### Brand Narrative

K bank’s official culture story identifies the company as South Korea’s first internet-only bank. Its current brand story frames the evolution not as finance for finance’s sake, but as a pleasant daily financial life: better basics, rewards woven into ordinary moments, access to investment, and reassurance around customers’ assets.

That public expression is supported by a resource center that gives the brand a consistent visual vocabulary—deep and secondary blue, a K identification icon, and Pretendard K Edition—while distinguishing logo/asset guidance from the public-web UI. The public product routes in this reference show only a bounded web slice of that system; they do not prove the design of protected banking work or the native app.

### Principles

1. **Make the financial basics feel worthwhile.** The brand story foregrounds rates, fees, and practical benefits.
   *UI implication:* lead public product pages with the customer value, then keep conditions readable.
2. **Connect finance to daily life.** The brand explicitly places banking around shopping, meals, rewards, and ordinary routines.
   *UI implication:* use concrete scenarios in public education without trivializing regulated detail.
3. **Protect confidence while broadening access.** The brand combines approachable benefits with asset reassurance, IT, and AI-security messaging.
   *UI implication:* do not reuse campaign exuberance as a substitute for clear security and transaction states.
4. **Build shared language through participation.** The culture story documents collective input into K bank’s way of working.
   *UI implication:* retain provenance and evidence boundaries so product, brand, and design teams can review decisions together.

### Personas

These are source-grounded service audiences, not fictional user profiles.

- **Everyday banking customer:** the brand story addresses spending, rewards, and routine money management; protected-flow requirements were not captured.
- **Customer exploring savings, cards, or investment:** public product pages and the brand story cover these offerings, without establishing a unified dashboard UI.
- **Customer seeking reassurance:** the brand story speaks to security and asset confidence; specific support or fraud-response flows remain unobserved.
- **Internal contributor:** the culture story documents employees participating in defining shared working practices, an organizational stakeholder rather than an end user.

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Color & Typography

### Color tokens

- `#0114A7` — official primary color in K bank’s resource center; also the computed fill of the 48px public primary action.
- `#4262FF` — official secondary color in the same resource center; also the computed fill of the 40px compact action.
- `#FFFFFF` — observed page canvas and action-label color.
- `#000000` — observed public-web structural text and transparent-control border color.

The resource center additionally lists `#E0E6F1`, `#EDF1F7`, and `#F7F9FD` as brand grayscale and `#2848DF` for the icon’s dark-mode treatment. They are official brand/asset guidance, not tokens promoted from the supplied product capture.

### Typography evidence classes

- **Official product/brand-use:** K bank’s resource center designates Pretendard K Edition for its consistent brand image and permits Pretendard as an alternate. This is official brand guidance, not a license grant or proof of every app surface.
- **Live computed surface-use:** Pretendard K Edition is `loaded` with high confidence, 58 observed uses, and four first-party WOFF2 sources on the supplied public-web routes. It is the sole UI-family token because both computed use and FontFaceSet/source evidence are present.
- **Live system use:** `-apple-system` is a high-confidence operating-system stack on 181 observed public-page elements, including product-detail controls. It remains system evidence rather than a K bank family or a substitute for Pretendard K Edition.
- **Declared-only:** `swiper-icons` has a data-URL `@font-face` declaration and zero visible uses. It is not a text-family token.
- **Official distributed asset / license:** no separately downloadable K bank font asset or font-license terms were located in the official material reviewed. The resource-center font statement remains useful brand evidence but does not authorize rehosting or substitution.

| Role | Size | Weight | Line height | Boundary |
|---|---:|---:|---:|---|
| Public-web body / compact action | 16px | 400 | normal | Home route; Pretendard K Edition loaded |
| Public deposit display | 44px | 700 | 59.4px | Supplied public deposit-product pages; -0.22px tracking |
| Selected product tab | 18px | 700 | 24.3px | Deposit index only; Pretendard K Edition |
<!-- design-md:claim-end -->

### Spacing & Shape

- The measured compact and primary actions use `0px 14px` / 8px and `0px 28px` / 10px respectively.
- The selected product tab is square (`0px`) with `10px 4px 12px` padding; the product-index bordered choice is 6px with `0px 12px` padding.
- The bundle also contains 2px, 3px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 28px, 32px, and 100px spacing observations. Their semantics are not promoted into a global scale.

### Motion & Easing

No motion, transition, easing, or interaction expansion appears in the supplied raw evidence. Motion tokens and behavioral rules are not established here; the observed selected tab is not proof of a tab transition or easing curve.

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Iconography & Imagery

K bank’s official resource center publishes logo, K-bank identification icon, logo spacing, light/dark icon colors, and media-kit material. The icon guide says the K position is visually adjusted and should not be moved; it is brand-asset guidance for identifying K bank, including transfer screens, rather than a general application icon library. The supplied product collector does not identify a named SVG set, illustration ratio, or icon-component geometry. `swiper-icons` is declared but unused and must not be substituted for a K bank text or icon token.

### Do

- Keep the two blue action treatments tied to their public-web selector and surface provenance.
- Use Pretendard K Edition only where loaded public-web evidence or official brand guidance applies.
- Use the official resource center for logo and K icon treatment, keeping those assets separate from product-control tokens.

### Don't

- Generalize captured public actions to transfer, account, login, or native-app flows.
- Invent interaction states, a responsive grid, a general card family, or a documentation system from these static routes.
- Render a system fallback or `swiper-icons` as a verified K bank-branded typeface.

<!-- design-md:section components-states -->
## 4. Components & States

### Components

### Public compact action

**Default**
- Background: `#4262FF`
- Text: `#FFFFFF`
- Radius: `8px`
- Padding: `0px 14px`
- Height: `40px`
- Font: `16px / 400 / Pretendard K Edition`
- States: Default only; no hover, pressed, focus, or disabled state captured.
- Use: `home::[captured element]`; the same fingerprint occurs across the supplied public routes.

### Public primary action

**Default**
- Background: `#0114A7`
- Text: `#FFFFFF`
- Radius: `10px`
- Padding: `0px 28px`
- Height: `48px`
- Font: `16px / 400 / system stack` on `product-curious::[captured element]`; the duplicate home snapshot uses a 14px Pretendard K Edition instance.
- States: Default only; no hover, pressed, focus, or disabled state captured.
- Use: Supplied public deposit and card-product pages; this does not establish an authenticated-flow CTA.

### Product index tab

**Selected**
- Text: `oklch(0.47 0.024 264.308)`
- Radius: `0px`
- Padding: `10px 4px 12px`
- Height: `44px`
- Font: `18px / 700 / Pretendard K Edition`
- States: Selected is observed through `aria-selected="true"`; no transition or alternate tab state was captured.
- Use: `product-index::[captured element]` on the public deposit index.

### Product-index bordered choice

**Default**
- Background: `oklch(1 0 0)`
- Text: `oklch(0.301 0.016 264.308)`
- Border: `1px solid oklch(0.87 0.02 267.27)`
- Radius: `6px`
- Padding: `0px 12px`
- Height: `32px`
- Font: `16px / 400 / system stack`
- States: Default only; no interaction state captured.
- Use: `product-index::[captured element]`; medium-confidence collector fingerprint, retained with its exact source boundary.

### Product-detail full-width text button

**Default**
- Text: `#000000`
- Radius: `0px`
- Padding: `16px 20px`
- Height: `60px`
- Font: `18.72px / 700 / system stack`
- States: Default only; no expansion or pressed state captured.
- Use: `product-curious::[captured element]`, repeated on the supplied deposit and card product pages.

The collector reports `interactionCount: 0` and no interaction records. The selected tab is an element-state observation, not an observed tab-change interaction. No menu, dialog, validation, toast, responsive, hover, focus, pressed, disabled, or authenticated-product variant is claimed.

### States

| Category | Evidence boundary |
|---|---|
| Empty | No public product empty state captured |
| Loading | No loading state captured |
| Error: validation | No validation state captured |
| Error: transaction or service interruption | No operational-error state captured |
| Success | No public product success state captured |
| Skeleton | No skeleton state captured |
| Disabled | No disabled control captured |
| Focus | No focus-visible state captured |
| Pressed | No pressed state captured |
| Hover | No hover state captured |
| Selected tab | Public deposit-index `aria-selected="true"` only; no selection-change interaction captured. |

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Layout & Grid

- The supplied collector uses a `1440×900` viewport on the home, product index, two deposit pages, and the ONE card page. The second home record is a duplicate URL, not a breakpoint or a distinct surface.
- The home’s `mainCardWrapper` is a measured static shell (`1365px × 840px`, no padding, 0px radius), not a reusable product-card or grid contract.
- Public product-page measurements include 44px tabs and 40px/48px action controls. No mobile breakpoint, authenticated layout, or responsive rule was captured.

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Content & Voice

The official brand story writes about rates, fees, everyday rewards, investment, and safety in short, conversational Korean: financial life should feel closer, easier, and more pleasant. It pairs that accessible public register with precise product explanations and terms on the public product pages. K bank-inspired public marketing can explain a concrete everyday benefit plainly, but this does not establish copy rules for regulated disclosures, transaction confirmations, eligibility decisions, or errors.

### Voice & Tone

- **Everyday and benefit-led:** the brand story grounds financial features in shopping, meals, rewards, and daily situations.
- **Reassuring but specific:** public pages pair cheerful benefit language with product conditions and legal information.
- **Participatory internally:** the official culture story describes employees gathering perspectives to define a shared way of working.

### Do

- Explain a public benefit through a concrete financial situation.
- Keep conditions and eligibility explicit when a product page needs them.
- Separate public marketing language from regulated or operational copy.

### Don't

- Treat playful campaign language as the verified voice of every banking flow.
- Fabricate executive quotations, customer promises, or error-state language.

<!-- design-md:section governance -->
## 7. Governance

### Preserved source material — Elevation

This material is retained for review because it has not yet been assigned to a typed Core field. Do not promote it to a token or product fact without an explicit decision.

The selector-backed public-home shell and all promoted action/tab samples have `box-shadow: none`. This is a route-level flatness observation, not a shadow scale for native banking, brand marketing, or unobserved panels.

### Accessibility

- The compact and primary actions pair white text with `#4262FF` and `#0114A7`; this reference does not substitute for a contrast or accessibility audit.
- No focus, keyboard, disabled, error, validation, or interaction snapshot was captured. A future implementation needs accessible focus and state treatments designed and verified on the relevant flow.
- The official brand resource asks that logo visibility be considered against its background. That asset rule is not evidence for control contrast, accessible names, landmarks, or mobile behavior.

<!-- design-md:claim authority kind=evidence-backed-reconstruction lang=en -->

### Authority



This document is an evidence-backed reconstruction, not authority for an unrelated target project.

<!-- design-md:claim-end -->

<!-- design-md:claim application-priority order=prompt-fact,repository-fact,system-contract,reference-inspiration lang=en -->

### Application priority



1. Direct user instructions for the requested scope.

2. Repository facts.

3. This system contract.

4. Reference inspiration.

<!-- design-md:claim-end -->

<!-- design-md:claim unknowns policy=absent-at-smallest-unresolved-boundary lang=en -->

### Unknowns



Omit only the smallest unresolved value or group. Do not replace it with a plausible default.

<!-- design-md:claim-end -->

<!-- design-md:claim changes policy=review-record-validate-before-adoption lang=en -->

### Changes



Record, review, and validate changes before adoption.

<!-- design-md:claim-end -->
