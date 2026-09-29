# Toss Bank (토스뱅크) Reference Design System

<!-- design-md:section experience -->
## 1. Experience

### Visual Theme & Atmosphere

Toss Bank is a Korean bank whose public site presents banking products, customer information, and a campaign asking people to describe banking experiences worth changing. The public home uses short, benefit-led Korean headlines for accounts, savings, loans, foreign exchange, cards, and always-available support; the campaign’s central line is “은행을 바꾸는 은행.” That combination gives the public-facing work a direct, conversational register rather than the ceremonial tone associated with conventional bank marketing. The live capture nevertheless contains three different source domains: the home is a marketing surface, while product disclosure and protected-products are documentation chrome. They share a loaded typeface and familiar blue/gray values, but neither route is evidence for the authenticated Toss Bank app or for financial-flow components. [Toss Bank home](https://www.tossbank.com/) · [campaign](https://www.tossbank.com/ten-million)

The group’s official resource center identifies Toss Blue `#0064FF` and Toss Gray `#202632`, and includes a Toss Bank affiliate logo. Those are brand-asset facts. The supplied live capture separately shows `#3182f6` in public-site text and borders; it is retained as an observed public-surface value, not silently equated with the official logo color. The resulting reference is intentionally narrow: clear typography, sparse borders, and public information controls are verified; account, transfer, card, status, and authenticated-app patterns are not.

**Key Characteristics:**

- Official Toss brand blue `#0064FF` and gray `#202632` for group identity assets
- Loaded Toss Product Sans across the captured public home and customer-information routes
- `#3182f6` observed in public-site control text/borders, alongside neutral documentation colors
- Marketing, documentation chrome, and unobserved authenticated banking flows kept separate
- Only selector-backed public controls are described; app-style cards, forms, and transaction states are omitted

<!-- design-md:claim primary-tasks kind=user-outcomes count=4 lang=en -->
### Primary tasks

- Browse bank products across accounts, savings, loans, and cards
- Report an inconvenient banking experience you want changed
- Read the product disclosure and protected-product pages
- Reach a customer center at any hour of the day
<!-- design-md:claim-end -->

### Do's and Don'ts

### Do

- Keep official brand assets (`#0064ff`, `#202632`) distinct from live public-interface observations.
- Use Toss Product Sans only when the deployment can load the verified family or is explicitly within its official platform boundary.
- Preserve the marketing-home and customer-information source domains on documented controls.
- Treat the selected documentation tab as a selected documentation state, not a general app tab pattern.

### Don't

- Do not turn the observed `#3182f6` text/border value into a universal filled banking CTA.
- Do not reuse the public pill action as a transfer, account-opening, or confirmation component.
- Do not invent hover, pressed, focus, error, disabled, success, or responsive variants from this artifact.
- Do not substitute a system font and call it Toss Product Sans.

### Brand Narrative

Toss Bank frames itself publicly as a bank that changes banking: its home lists everyday bank products and services, while its campaign says it is still changing banks and invites people to name the experiences they want improved. The bank’s site also identifies a 24-hour customer center, placing accessibility of assistance alongside its product navigation. [Toss Bank home](https://www.tossbank.com/) · [campaign](https://www.tossbank.com/ten-million)

Within the wider Toss identity, the official resource center supplies the group’s blue and gray brand assets and an affiliate-logo listing for Toss Bank. This is the right evidence for group identity and logo treatment, not for app-screen behavior or financial-product UI tokens. [Brand Resource Center](https://brand.toss.im/)

### Principles

1. **Make the promised outcome easy to scan.** The home groups products by account, savings, loans, foreign exchange, cards, and help. *UI implication:* public information should use clear categorization before decorative treatment.
2. **Ask for a concrete banking problem.** The campaign explicitly requests an inconvenient bank experience. *UI implication:* feedback prompts should ask for one specific experience and clearly say how the response will be used.
3. **Separate brand assets from product evidence.** Official group color rules and live public CSS answer different questions. *UI implication:* never convert a logo color or shared design-kit convention into an unobserved banking-flow token.

### Personas

The public campaign names customers with roles including self-employed people, office workers, university students, and families. These are examples presented by Toss Bank, not a validated user-research segmentation model. [Campaign](https://www.tossbank.com/ten-million)

**Public-source audience cues:** people managing everyday accounts, people considering loans or foreign exchange, card users, and people who want to report a frustrating banking experience. No invented personal profiles are included because the current evidence does not support them.

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Color Palette & Roles

### Official brand assets

- **Toss Blue** (`#0064ff`): official Toss brand color, specified by the group resource center for brand use.
- **Toss Gray** (`#202632`): official Toss brand gray, also specified by the group resource center.

### Observed public surfaces

- **Public control blue** (`#3182f6`): repeated public-site text and border value on all three captured routes.
- **Canvas** (`#ffffff`): observed documentation-route background.
- **Foreground** (`#212529`): repeated public text value across the capture.
- **Strong foreground** (`#191f28`): observed on both documentation routes.
- **Secondary foreground** (`#4e5968`) and **muted text** (`#6b7684`): observed documentation and public-site text values.
- **Border** (`#d1d6db`) and **hairline** (`#e5e8eb`): observed public-route border values.
- **Muted surface** (`#f2f4f6`): observed background on the protected-products route.

### Boundary

No captured evidence establishes semantic success/error colors, a universal CTA fill, or a Toss Bank app color system. Brand-asset colors are not promoted to product controls, and the observed public control blue is not presented as a replacement for the official brand color.
<!-- design-md:claim-end -->

### Depth & Elevation

The representative public controls have `box-shadow: none`. No evidence in this run supports a card, sheet, modal, floating-action, or elevation scale. Use flat public-surface controls only where their documented source domain applies; do not infer banking-product depth rules.

### Motion & Easing

No transition duration, easing curve, reduced-motion behavior, or animated state was captured on the supplied routes. Motion tokens are intentionally absent.

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Typography Rules

### Evidence classes

- **Live computed surface-use:** **Toss Product Sans** is the computed family on 672 captured elements across the home and both customer-information routes. The collector reports a matching loaded FontFaceSet entry with 1,536 static.toss.im font-source URLs, so it is the verified public-web family for this reference.
- **Official product-use and history:** Toss says it developed Toss Product Sans as a product typeface for financial, mobile, and digital contexts, initially with Sandoll and later with Leedotype. This explains the typeface’s financial-context intent but does not establish unobserved Toss Bank app sizes or components. [Official typeface history](https://toss.im/tossfeed/article/beginning-of-tps)
- **Official distributed asset / license boundary:** Apps in Toss documentation says the Figma kit uses SF Pro because Toss Product Sans is difficult to distribute as a separate asset, while Toss apps apply Toss Product Sans automatically. The reviewed material does not grant an independent font-file license for this reference. [TDS design-tool guidance](https://developers-apps-in-toss.toss.im/design/prepare/design.html)
- **Declared/system families:** Tossface, SF Pro, Apple SD Gothic Neo, Roboto, Noto Sans, and emoji families occur in the computed fallback declaration. They have no loaded-font match in the supplied evidence and are not promoted to Toss Bank UI tokens.

### Observed hierarchy

| Role | Size | Weight | Line height | Source boundary |
|------|------|--------|-------------|-----------------|
| Marketing title | 48px | 700 | 62.4px | One home marketing heading |
| Public navigation | 15px | 500 | 22.5px | Home navigation controls |
| Documentation body | 16px | 400 | 24px | Product-disclosure and protected-products routes |
| Documentation utility | 11px | 600 | 17.6px | Compact documentation control |

Do not substitute SF Pro, Pretendard, Inter, or a system font and label it Toss Product Sans. Conversely, the non-loadable fallback declaration remains useful compatibility context but is not treated as a product font source.

<!-- design-md:section components-states -->
## 4. Components & States

### Component Stylings

### Public marketing home

**Pill action — observed default**
- Background: #fdfdfe
- Text: #212529
- Radius: 100px
- Padding: 18px 32px
- Font: 16px / 400 / Toss Product Sans
- Use: `home::[captured element]`, a single public-home action with a 63px rendered height. It is marketing evidence only.

### Customer-information documentation chrome

**Outline button — observed default**
- Text: #4e5968
- Border: 1px solid #4e5968
- Radius: 40px
- Padding: 4px 10px
- Font: 11px / 600 / Toss Product Sans
- Use: `surface-2::[captured element]`, also repeated on `surface-3`; 28px rendered height.

**Documentation tab — observed selected**
- Text: #212529
- Padding: 9px 14px
- Font: 16px / 400 / Toss Product Sans
- Use: `surface-2::[captured element]`, `role="tab"` and `aria-selected="true"`; 40px rendered height.

The raw artifact labels some public buttons with focus/hover/pressed state markers but contains no interaction snapshots (`interactionCount: 0`). No state styling is therefore specified. No authenticated-app button, account card, input, badge, toast, sheet, toggle, error, success, or mobile navigation variant had selector and surface provenance in this update.

The previous reference inferred a mobile-bank application system from shared TDS patterns. This update retains only source-backed public values and components, while preserving separately confirmed Toss brand and typeface context.

### States

The supplied artifact records one selected documentation tab (`aria-selected="true"`). It contains no captured interaction snapshots and no selector-backed empty, loading, error, success, disabled, toast, or skeleton state. Those state specifications are intentionally absent rather than inferred from generic banking conventions.

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Layout Principles

The supplied desktop capture exposes public marketing and documentation layouts, not an authenticated banking-screen grid. Observed spacing values cluster at 4, 8, 12, 16, and 32px; documentation controls use compact padding while the home pill action uses 18px 32px. A 375px baseline, transaction alignment rules, safe-area behavior, and an app layout grid were not captured and are omitted.

### Responsive Behavior

Only a 1440×900 collector viewport was supplied. No mobile viewport, breakpoint, responsive layout change, touch-target policy, or safe-area behavior was observed. Re-verification needs public mobile captures before this reference can describe responsive rules.

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Voice & Tone

The official home uses concise, benefit-led Korean phrasing such as “하루만 넣어도 이자가 쌓이는” and “쉽고 간편하게 시작해요.” The campaign directly asks for “바꾸고 싶은 불편한 은행 경험,” then says the bank will use those opinions to make a better bank. This supports a clear, constructive public voice; legal and disclosure wording remains a separate regulated content domain. [Home](https://www.tossbank.com/) · [campaign](https://www.tossbank.com/ten-million)

| Context | Observed direction |
|---------|--------------------|
| Product marketing | Short benefit plus a plain-language explanation |
| Participation campaign | Ask directly for a concrete inconvenient experience |
| Documentation | Keep product information distinct from promotional claims |

Voice samples are quoted/paraphrased from the cited public pages, not a specification for unobserved in-app copy.

<!-- design-md:section governance -->
## 7. Governance

### Agent Prompt Guide

For a public Toss Bank marketing or customer-information concept, use the verified source boundary: official group blue `#0064ff` for brand context; observed public control blue `#3182f6` only as a text/border observation; neutral text and hairlines; and Toss Product Sans only when it can actually load. Do not generate an account dashboard, money transfer flow, banking status state, or universal TDS component from this reference—the current evidence does not establish them.

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
