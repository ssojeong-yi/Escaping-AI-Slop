# Woori Bank — Design Reference Reference Design System

<!-- design-md:section experience -->
## 1. Experience

### Visual Theme & Atmosphere

Woori Bank is a Korean bank whose public narrative links a long institutional history with the promise of financial innovation. Its museum identifies Daehancheonil Bank, founded in 1899, as the predecessor of today’s Woori Bank, while the current corporate site frames the bank as creating tomorrow’s value through today’s innovation. The recognizable identity is the dawn-shaped symbol: the official CI describes it as challenge and hope, with deep blue logotype and a light-blue-to-blue symbol gradient. The supplied public-web capture presents a narrower and more utilitarian picture—white canvas, black and gray text, square legacy controls, and mixed Korean system/declaration stacks. That measured web layer is not the CI palette rendered as product controls, so this reference keeps corporate brand assets, public bank pages, and declared fonts deliberately separate.

**Key characteristics:**

- Official CI: deep blue `#0067AC`, light blue `#20C4F4`, and blue `#0083CA`; these are brand-asset values, not inferred public-bank CTA tokens.
- Supplied public bank routes repeat white `#FFFFFF`, black `#000000`, secondary `#333333`, and muted `#7F7F7F` chrome.
- The measured public surfaces are compact and predominantly square: 0px radius dominates; a single home login utility has 5px corners.
- The artifact covers a public home and two public legacy service/information routes only; it does not establish native, authenticated, transactional, or mobile UI.

<!-- design-md:claim primary-tasks kind=user-outcomes count=2 lang=en -->
### Primary tasks

- Read the bank's published account of its own history.
- Look up the financial solutions offered to people and organisations.
<!-- design-md:claim-end -->

### Do's and Don'ts

### Do

- Use the official CI blue family only for brand identification or where a future product surface explicitly observes it.
- Keep the captured public legacy utility treatment square and compact when reproducing the same route-local context.
- Keep the public home and legacy surface typography as unresolved computed stacks until a loaded family and its source are corroborated.
- Preserve the distinction between a 1899-rooted corporate story and a specific public web component claim.

### Don't

- Don't turn the official dawn-gradient symbol colors into an inferred universal online-banking CTA or background gradient.
- Don't substitute Noto Sans KR, Malgun Gothic, Roboto, or a system fallback as a verified Woori Bank font.
- Don't invent a responsive grid, native-app shell, authenticated form, error state, dialog, toast, or interaction animation from this static desktop packet.
- Don't recast detected anchors or rows as buttons; the only structured component harvest is the selector-backed native text input.

### Brand Narrative

Woori Bank’s official history connects the present bank to Daehancheonil Bank, founded in 1899 as a modern national-capital bank. The bank’s historical material describes later firsts in overseas presence and online banking, making continuity and financial infrastructure part of its own story rather than an invented heritage claim.

Its current public vision is to create tomorrow’s value through today’s innovation, with customer, trust, expertise, and innovation named as core values. The official CI turns that narrative into a dawn symbol of challenge and hope, plus a controlled deep-blue and blue gradient palette. The public product-web evidence in this reference is much more restrained and legacy-oriented; it should not be overwritten by the corporate identity narrative.

The current ESG material adds a present-tense direction: responsible finance, social value, transparency, and long-term sustainable value. Those commitments explain the bank’s contemporary framing but do not yield unobserved product features, UX states, or quantitative service claims.

### Principles

1. **Put customers and neighbours first.** The official value statement places customers and neighbours first.
   *UI implication:* operational public copy should explain the next action or required information without decorative ambiguity.
2. **Build trust through principles.** The bank describes trust as something made through principles.
   *UI implication:* keep source boundaries, disclosures, and state uncertainty explicit; do not invent a reassuring UI pattern.
3. **Use expertise with restraint.** The official values present the bank as a financial expert that leads the market.
   *UI implication:* separate institutional/brand facts from route-local CSS observations rather than flattening them into generic fintech styling.
4. **Make innovation accountable.** The current vision and ESG material join innovation with future value, responsibility, and transparency.
   *UI implication:* a future product treatment needs direct evidence before it is promoted as a reusable token or component.

### Personas

The following are first-party stakeholder contexts, not synthetic personas or satisfaction claims.

**Individual banking customer.** The public vision and values address customers and neighbours directly. This reference preserves only the public desktop web styling available to them, not protected account or transaction experiences.

**Business or institutional customer.** The corporate site describes expertise and financial solutions for people and organisations. No enterprise application surface, dashboard, or administration UI was captured here.

**Brand, content, or service contributor.** Needs to distinguish the official dawn CI and corporate narrative from the white-and-neutral legacy public-bank chrome so a reuse does not become a false representation of the bank’s current product system.

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Color Palette & Roles

### Official CI asset colors

- **Woori Deep Blue** (`#0067AC`): official logotype main color (Pantone 7462 C) in the corporate CI guide.
- **Woori Light Blue** (`#20C4F4`): official symbol-mark gradient color (Pantone 2915 CP).
- **Woori Blue** (`#0083CA`): official symbol-mark gradient color (Pantone 3015 CP).

### Selector-backed public-web colors

- **Canvas** (`#FFFFFF`): repeated public-page background samples across the supplied surfaces.
- **Foreground** (`#000000`): repeated structural text and border samples across all three supplied surfaces.
- **Secondary foreground** (`#333333`): repeated utility text/border sample on the home and legacy routes.
- **Muted text** (`#7F7F7F`): repeated legacy service/information text input and utility sample.

The official CI guide requires its colors to be reproduced consistently across visual media. That supports the three CI asset values above, but it does not make an unobserved blue button, gradient panel, or banking-flow state a product token.
<!-- design-md:claim-end -->

### Depth & Elevation

The promoted public samples have `box-shadow: none`; `flat: none` is recorded as a selector-backed token. This establishes flatness for the measured home/legacy utility examples only. No card, modal, notification, elevated panel, or layered navigation shadow scale was captured.

### Motion & Easing

No motion duration, easing curve, transition property, or reduced-motion behavior was measured. Omit motion tokens rather than inventing a Woori Bank motion system.

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Typography Rules

### Evidence classes

| Evidence class | Family and boundary |
|---|---|
| Official product-use | No first-party material reviewed states that a named font is required for the captured public bank UI. |
| Live computed surface-use | The public home exposes `NotoSans, "Noto Sans KR", sans-serif` on its h1 and navigation samples; the two legacy routes repeatedly expose a stack beginning `맑은 고딕` / `Malgun Gothic`. Neither computed family has a matching loaded FontFace in the supplied artifact, so neither is a Woori Bank UI-family token. |
| Official distributed brand asset | No official Woori Bank font download or licence document was found in the reviewed first-party material. |
| Declared-only | `Noto Sans CJK KR` is declared from `simg.wooribank.com` and `Noto Sans KR` from Google Fonts, both with zero visible uses in the artifact. They remain declared-only. |
| System / unresolved | `Roboto` is classified system with zero visible uses; `돋움`, `dotum`, and `Arial` are not Woori Bank brand-font evidence. |

### Captured hierarchy

| Role | Family boundary | Size | Weight | Line height | Evidence boundary |
|---|---|---:|---:|---:|---|
| Public-home title | Computed `NotoSans` declaration; unresolved | 24px | 700 | normal | `home::h1` only |
| Legacy public body | Computed stack beginning 맑은 고딕; unresolved | 14px | 400 | 20px | repeated legacy service/information list and text samples |
| Legacy utility action | Computed stack beginning 돋움; unresolved | 12px | 400 | 23px | `surface-2::[captured element]` only |

Do not render a fallback as a verified Woori Bank typeface. The declaration and local/system stacks are useful audit context, but not a licence or a branded family token.

<!-- design-md:section components-states -->
## 4. Components & States

### Component Stylings

### Legacy information text input

**Default**
- Background: `#ffffff`
- Text: `#000000`
- Border: 1px `#cccccc`
- Radius: 0px
- Padding: 2px 3px 3px
- Height: 26px
- Font: 13px / 400 / computed stack beginning 맑은 고딕
- States: Default only. The supplied artifact records `interactionCount: 0`; no hover, focus, pressed, disabled, or error value is retained.
- Use: Native text input `surface-3::[captured element]`; medium-confidence, one public information-route sample only.

The artifact has `interactionCount: 0`, no interaction kinds, and no observed states. This selector-backed native input is therefore the sole structured component harvest: a static default with measured geometry, not evidence for hover, focus, pressed, disabled, validation, menu, dialog, toast, or authenticated banking patterns. Other detected anchors and rows remain raw evidence rather than being recast as buttons.

### States

The supplied artifact contains no interaction records, interaction kinds, or observed element states. Empty, loading, error, success, skeleton, and disabled treatments are therefore absent rather than filled with generic banking conventions. The static native text-input default in §4 is the only structured component evidence retained.

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Layout Principles

The supplied capture is desktop-only at `1440×900`. It records a 24px public-home title and compact legacy utility chrome, but not a reusable grid, container width, responsive breakpoint, authenticated layout, or transaction journey. Treat the measured public routes as route-local legacy web evidence rather than a general banking layout contract.

### Responsive Behavior

No mobile viewport or responsive transition was captured. The public web routes may adapt at smaller widths, but the supplied evidence supports no breakpoint, collapsed navigation, touch-target, or reflow specification.

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Voice & Tone

The official value system provides a useful but bounded public voice: customer-first, trustworthy, expert, and innovative. The current corporate story joins that language to a future-facing innovation claim, while the ESG material speaks of responsibility, inclusion, and transparent disclosure. These official statements guide high-level public communications; they do not prescribe regulated transaction copy, eligibility notices, or errors.

| Context | Supported direction |
|---|---|
| Corporate public message | Ground innovation in a concrete customer or societal value. |
| Trust-sensitive information | Be direct about principles, responsibilities, and what is being disclosed. |
| Service navigation | Use short, literal labels; the captured legacy web chrome is operational rather than campaign-led. |

### Supported copy samples

- “오늘의 혁신으로 내일의 가치를 만드는 은행” is the bank’s published vision statement.
- “우리 마음속 첫번째 금융” is the published slogan associated with the bank’s heritage and trust aspiration.
- “Good Finance for the Next” appears with the official ESG vision.

<!-- design-md:section governance -->
## 7. Governance

### Agent Prompt Guide

For a route-local Woori Bank public-web reference, use a white `#FFFFFF` canvas with `#000000` and `#333333` text, a compact 14px legacy body sample where that exact legacy context is intended, square utility controls, and no shadow. The only harvested component is the supplied route’s 26px native text input; treat `#0067AC`, `#20C4F4`, and `#0083CA` as official CI asset colors—not automatic UI fills. Do not name a font specimen, create an authenticated bank flow, or add interaction states without a new selector-backed and font/state-correlated capture.

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
