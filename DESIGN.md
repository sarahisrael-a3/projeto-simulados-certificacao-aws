## Product UI Layer — Simulador de Certificações AWS

> Status: `draft / needs-review`
> Purpose: adaptar a linguagem visual A3Data para uma interface web de produto educacional, mantendo o `DataViz Guide` como base visual e sem substituir o manual de marca.

### Intent

O simulador de certificações AWS deve parecer um produto interno/profissional da A3Data: claro, confiável, analítico e orientado a aprendizado. A interface deve combinar:

* identidade institucional A3Data;
* linguagem de dados e cloud;
* experiência de estudo focada;
* visual profissional, sem aparência infantil ou genérica de quiz;
* uso moderado de gamificação.

Esta camada de produto existe porque o manual original é mais forte em DataViz, dashboards, KPI cards, tabelas e gráficos. Para componentes web como botões, navegação, cards de certificação, quiz e estados interativos, as regras abaixo servem como adaptação conservadora.

---

### Brand Color Usage for Product UI

Use only the documented A3Data color tokens.

#### Institutional base

| Token     | Hex       | Product UI usage                                                    |
| --------- | --------- | ------------------------------------------------------------------- |
| Deep Sea  | `#001863` | Header, hero, dark theme base, institutional sections               |
| Tech Blue | `#0033FF` | Primary action, active state, links, progress highlight             |
| Pink Nic  | `#F53199` | Accent highlight, selected item, key callout, small visual emphasis |

#### Supporting accents

| Token           | Hex       | Product UI usage                                                 |
| --------------- | --------- | ---------------------------------------------------------------- |
| Summer Time     | `#FFEE00` | Achievement highlight, streak, celebration, small badge accent   |
| Amethyst Velvet | `#7B4AAF` | Secondary visual accent, learning path, premium/advanced context |
| Sky Frost       | `#39D0FF` | Info state, cloud/data visual accent, subtle highlights          |

#### Surfaces and text

| Token            | Hex       | Product UI usage                                    |
| ---------------- | --------- | --------------------------------------------------- |
| Background Light | `#F5F5F5` | Default light app background                        |
| Background Dark  | `#001863` | Default dark app background                         |
| Surface          | `#FFFFFF` | Cards, panels, quiz containers, modal-like surfaces |
| Text on Light    | `#00083D` | Main text on light background                       |
| Text on Dark     | `#F5F7FF` | Main text on dark background                        |
| Border Default   | `#EBEBEB` | Dividers, card borders, subtle separators           |

#### Semantic states

| Token          | Hex       | Product UI usage                                       |
| -------------- | --------- | ------------------------------------------------------ |
| Success        | `#35B769` | Correct answer, completed module, positive performance |
| Danger         | `#F91C1C` | Incorrect answer, destructive/error state              |
| Warning        | `#FF822E` | Attention, incomplete progress, weak domain            |
| Info candidate | `#39D0FF` | Informational state, pending validation                |

---

### Product Color Rules

1. Deep Sea is the main institutional color.
2. Tech Blue is the default action/highlight color.
3. Pink Nic is an accent, not a background default.
4. Summer Time must be used sparingly for achievement, celebration or emphasis.
5. Sky Frost can be used for info/cloud/data context.
6. Semantic colors must only be used when the meaning is semantic: success, error, warning or info.
7. Do not use random colors outside this design system.
8. Do not sample colors manually from screenshots.
9. If the logo/manual shows a tone not listed here, add it as `needs-review` before using it.
10. Never rely on color alone. Pair status colors with text, icon or label.

---

### Logo and Brand Mark Rules

The product may use the official A3Data logo only when a valid brand asset exists in the repository.

Rules:

* Do not redraw the logo.
* Do not recreate the logo typography.
* Do not crop the logo from screenshots.
* Do not recolor the logo manually.
* Do not stretch, rotate or distort the mark.
* Do not create unofficial logo variations.
* Use the light-background or dark-background lockup according to the surface.
* If no official logo asset exists, reserve a layout area for the logo but do not invent one.

Recommended product placements:

* app header/topbar;
* hero section on the home screen;
* footer or “by Guilda dos Estagiários” area;
* documentation screenshots.

---

### Product UI Composition

The simulator should use a clean, professional product layout.

Recommended structure:

* institutional hero area on the home screen;
* card grid for certifications;
* focused quiz container;
* analytical dashboard panels;
* compact status badges;
* visible progress/streak area;
* professional gamification, not childish gamification.

Avoid:

* excessive gradients;
* too many competing accent colors;
* neon-heavy visual language;
* large decorative elements inside the quiz;
* color-only feedback;
* visual patterns not supported by this design system.

---

### Home Screen

The home screen is the main brand entry point.

Recommended visual direction:

* Deep Sea hero or light hero with Deep Sea title;
* Tech Blue primary call to action;
* Pink Nic as small accent line, badge or highlight;
* cards on white/light surfaces;
* clear copy explaining the simulator and the Guilda dos Estagiários;
* visual feeling of cloud, data and learning.

Suggested hierarchy:

1. Product name.
2. Short value proposition.
3. Certification cards.
4. Study progress or quick action.
5. Community/contribution area.

---

### Certification Cards

Certification cards should feel like product cards, not generic quiz boxes.

Use:

* Surface `#FFFFFF`;
* text `#00083D`;
* subtle border `#EBEBEB`;
* Deep Sea for titles or icon containers;
* Tech Blue for active/primary action;
* Pink Nic or Sky Frost as small accent only;
* progress indicator when available.

Avoid:

* full-card backgrounds with strong accent colors;
* too many badges;
* decorative icons without meaning.

---

### Quiz Experience

The quiz screen must prioritize focus and readability.

Use:

* clear question container;
* strong question hierarchy;
* alternatives with enough spacing;
* visible selected state;
* accessible feedback for correct/incorrect answers;
* success/danger/warning colors paired with text or icon.

Color mapping:

* selected option: Tech Blue;
* correct answer: Success;
* incorrect answer: Danger;
* warning/review needed: Warning;
* explanation/info block: Sky Frost or neutral surface.

Avoid:

* decorative backgrounds behind question text;
* excessive animations;
* tiny fonts;
* color-only feedback.

---

### Dashboard and Results

The dashboard should follow the DataViz Guide more closely than the rest of the product.

Use:

* KPI card principles;
* DataViz categorical palette in documented order;
* short card titles;
* prominent values;
* minimal labels;
* clean chart containers;
* tooltips/supporting context instead of cluttered labels when possible.

Product interpretation:

* performance percentage: KPI card;
* correct/incorrect distribution: chart or compact comparison;
* weak domains: warning/info section;
* study streak: progress card;
* certification readiness: main KPI.

---

### Flashcards, Pomodoro and Study Sprint

These areas may use a more motivational tone, but still professional.

Use:

* Deep Sea and Tech Blue as base;
* Summer Time for achievements/streaks only;
* Pink Nic for occasional highlight;
* neutral cards for readability;
* progress states with text labels.

Avoid:

* childish game visuals;
* excessive emojis in core UI;
* heavy gradients;
* low-contrast text.

---

### Validation Panel

The validation panel must remain honest about persistence.

If the panel is mock/demo:

* show a visible `Demo / Mock` badge;
* explain that approvals/rejections are not persisted;
* do not imply production validation.

Visual direction:

* use Deep Sea for header;
* use Warning for demo/mock notice;
* use Success/Danger only for real validation status;
* keep table and review areas clean.

---

### Interaction States

Because the original manual does not fully define web interaction states, use conservative derived states.

#### Focus

* Always visible.
* Prefer Tech Blue outline.
* Must pass contrast.

#### Hover

* Use subtle surface shift, border emphasis or light tint.
* Avoid dramatic color changes.

#### Active/Selected

* Use Tech Blue as the main selected indicator.
* Pair with label, icon or border.

#### Disabled

* Use neutral gray.
* Keep text legible.
* Do not rely only on opacity.

#### Loading

* Use neutral skeleton or spinner.
* Do not use semantic colors unless status is meaningful.

#### Error

* Use Danger with text explanation.
* Do not rely on red alone.

#### Empty

* Use neutral surface.
* Provide next-step guidance.

---

### Product Typography

Use Segoe UI as the primary product interface font.

Guidelines:

* Do not use 8px/9px text for general product UI.
* Keep small DataViz/table labels only where appropriate.
* Use larger sizes for page titles, section titles and body text.
* Use DIN or numeric fallback only for KPI values and data-heavy numbers when available.

Suggested web scale pending validation:

| Role          | Suggested size | Status       |
| ------------- | -------------- | ------------ |
| Page title    | 32px–40px      | needs-review |
| Section title | 20px–24px      | needs-review |
| Card title    | 14px–16px      | needs-review |
| Body          | 14px–16px      | needs-review |
| Caption       | 12px–13px      | needs-review |
| KPI value     | 24px–40px      | needs-review |

---

### Spacing and Layout

Use the 8px base unit.

Recommended product spacing:

| Token     | Value | Usage                      |
| --------- | ----- | -------------------------- |
| `space-1` | 8px   | compact gap                |
| `space-2` | 16px  | default component gap      |
| `space-3` | 24px  | section/card padding       |
| `space-4` | 32px  | larger section spacing     |
| `space-5` | 40px  | hero/major section spacing |

All values above are product UI extensions and remain `needs-review`, but they follow the documented base-8 rule.

---

### Radius and Elevation

The original manual does not define radius or shadows for product UI.

Temporary product guidance:

* use rounded pills only where appropriate with `999px`;
* use subtle card radius consistently;
* use low elevation only when needed to separate surfaces;
* avoid heavy shadows.

Suggested tokens pending validation:

| Token         | Value | Usage            |
| ------------- | ----- | ---------------- |
| `radius-sm`   | 8px   | small controls   |
| `radius-md`   | 16px  | cards/panels     |
| `radius-lg`   | 24px  | hero/large cards |
| `radius-full` | 999px | badges/pills     |

Status: `needs-review`.

---

### AI Implementation Rules for This Product

When implementing this design in the simulator:

1. Use this `Product UI Layer` together with the main `DESIGN.md`.
2. Prefer changing CSS tokens before changing many individual components.
3. Preserve the existing app behavior.
4. Preserve offline/PWA behavior.
5. Do not alter quiz logic, JSON data, API, database, seed or workflows for visual changes.
6. Do not introduce new dependencies.
7. Do not implement LayerChart unless explicitly approved.
8. Use `src/` as source when the build process copies files to `public/`.
9. Run build after visual changes.
10. Report every divergence or assumption marked as `needs-review`.

---

### Acceptance Criteria for A3Data Visual Identity

The simulator can be considered visually aligned with A3Data when:

* the home screen clearly uses the institutional palette;
* certification cards use A3 colors and spacing consistently;
* quiz remains readable and focused;
* correct/incorrect feedback uses semantic colors with text/icon support;
* dashboard follows the DataViz palette and KPI card guidance;
* gamification feels professional;
* light and dark themes remain readable;
* no colors outside the design system are introduced;
* logo usage respects official assets only;
* no `needs-review` area is silently treated as final.
