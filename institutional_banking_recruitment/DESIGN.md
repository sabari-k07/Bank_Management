---
name: Institutional Banking Recruitment
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#1960a3'
  on-secondary: '#ffffff'
  secondary-container: '#7db6ff'
  on-secondary-container: '#00477f'
  tertiary: '#2d1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#493100'
  on-tertiary-container: '#cb9524'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a2c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004881'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#f8bc4b'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: '0'
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: '0'
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
  tabular-data:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, institutional, and federally compliant visual language engineered specifically for public- and private-sector banking recruitment. Built on the principles of regulatory precision, statutory transparency, and unwavering operational trust, it serves compliance officers, hiring committees, and high-volume applicant pools.

The aesthetic follows an elevated **Corporate / Modern** paradigm with strict federal-grade discipline. It eliminates ornamental friction, prioritizing legible typographic density, defensible visual hierarchies, and uncompromised accessibility. Visual weight conveys fiduciary responsibility; tabular precision ensures complex applicant scoring, regulatory quotas, and audit trails remain instantly decipherable.

## Colors

The palette establishes institutional credibility through deep naval tones, precise functional states, and balanced neutral slates.

- **Primary (`#1A365D`)**: Deep Federal Navy. Anchor for primary navigation, critical interactive states, high-priority actions, and authoritative table headings.
- **Secondary (`#2B6CB0`)**: Steel Blue. Supports secondary interactive elements, selected row states, and structural UI dividers.
- **Tertiary (`#D69E2E`)**: Muted Sovereign Gold. Reserved for regulatory flags, audit warnings, accreditation stars, and pending clearances.
- **Verification Emerald (`#276749` / `#38A169`)**: Strictly employed for verified eligibility markers, successful background checks, and compliance sign-offs.
- **Neutral Surface Palette**: Built on clean slate tiers (`#F8FAFC` base background, `#FFFFFF` elevated container, `#EDF2F7` sub-panel shading, `#E2E8F0` structural borders, and `#0F172A` high-contrast typography).

All contrast combinations guarantee a minimum WCAG 2.1 AA ratio of 4.5:1 for body copy and 3:1 for large display elements and data viz markers.

## Typography

Public Sans serves as the universal typeface across display, editorial, and functional surfaces. Developed specifically for public-sector and enterprise interfaces, its geometric neutrality, upright stress, and open counters allow dense information layouts to breathe.

- **Tabular Numerals**: Numerical data representations (application IDs, test percentiles, credit clearance scores, salary allocations) must enforce `font-feature-settings: "tnum" 1` to guarantee alignment down data grids.
- **Labels & Status Markers**: All uppercase tags, audit stamps, and badges utilize `label-sm` with deliberate tracking (`+0.05em`) to maintain legibility at sub-12px sizes.

## Layout & Spacing

The layout is built upon an 8pt institutional grid aligned to a 12-column fluid framework on desktop systems (max canvas width: 1440px) and a single-column stacked container on mobile screens.

- **Desktop (1024px and above)**: 12 columns, `1.5rem` (`24px`) gutters, `2rem` (`32px`) margins. Sidebar controls for compliance auditing and candidate filters utilize a fixed 280px left rail.
- **Tablet (768px – 1023px)**: 8 columns, `1rem` (`16px`) gutters, `1.5rem` (`24px`) margins. Left rail collapses to a top dock or drawer.
- **Mobile (< 768px)**: 4 columns, `0.75rem` (`12px`) gutters, `1rem` (`16px`) outer margins. Data tables switch to vertical card lists or sticky horizontal scroll panes.

## Elevation & Depth

To maintain government-grade regulatory sobriety, depth is conveyed through **low-contrast outlines** coupled with minimal, highly controlled ambient contact shadows. Deep, floating, or glossy elevations are strictly prohibited to prevent visual levity.

- **Level 0 (Base Canvas)**: `#F8FAFC`. Zero elevation, non-interactive surface.
- **Level 1 (Data Cards, Form Modules, Table Containers)**: `#FFFFFF` fill with a `1px solid #E2E8F0` structural border. Shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Records, Active Drawers)**: `#FFFFFF` fill with `1px solid #CBD5E1`. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modal Dialogs, Candidate Review Panels)**: `#FFFFFF` fill with `1px solid #94A3B8`. Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`. Overlay backdrop: `rgba(15, 23, 42, 0.6)` with no backdrop blur to retain clear contrast.

## Shapes

The design system enforces a **Soft (`1`)** roundedness standard. This introduces measured, formal curvature (0.25rem / 4px on baseline controls) that removes the harshness of raw rectangles while avoiding casual or consumer-like playfulness.

- **Inputs, Buttons, Pills, and Table Cells**: `0.25rem` (`4px`) border radius.
- **Institutional Cards & Panels**: `0.5rem` (`8px`) border radius (`rounded-lg`).
- **Modal Dialogs & Review Flyouts**: `0.75rem` (`12px`) border radius (`rounded-xl`).
- **Circular Indicators**: 9999px for avatar placeholders and stage progress dots only.

## Components

### Buttons
- **Primary**: Solid `#1A365D` fill, `#FFFFFF` text, `4px` radius. Internal padding: `8px 16px`. Active state `#0F2942`. Focused: `2px solid #2B6CB0` offset by `2px`.
- **Secondary**: Outlined `1px solid #CBD5E1` on `#FFFFFF`, text `#1A365D`. Hover: `#F1F5F9`.
- **Destructive**: Outlined or solid using `#991B1B` with strict confirmation steps.

### Chips & Status Badges
- **Verified / Compliant**: `#F0FDF4` background, `#166534` text, `1px solid #BBF7D0` border. Paired with a solid 6px dot or checkmark.
- **Pending Review**: `#FEFCE8` background, `#854D0E` text, `1px solid #FEF08A` border.
- **Disqualified / High Risk**: `#FEF2F2` background, `#991B1B` text, `1px solid #FECACA` border.

### Data Tables & Tabular Records
- **Header**: `#EDF2F7` background, `#1A365D` uppercase labels (`label-sm`), bottom border `2px solid #CBD5E1`.
- **Rows**: Alternating subtle zebra striping (`#FFFFFF` to `#F8FAFC`). Height: 48px standard, 36px compact. Monospaced or tabular numeral styling for candidate IDs and test metrics.
- **Hover**: Row background tints to `#EDF4FC`.

### Form Inputs & Controls
- **Text Inputs & Dropdowns**: Height `40px`, background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`. On focus: border becomes `#1A365D` with a `0 0 0 1px #1A365D` inner ring.
- **Checkboxes & Radios**: `16px` dimension, `1.5px` border width. Checked state fills `#1A365D` with sharp white indicators.

### Candidate Dossier Cards
- Constructed with a top 4px accent bar indicating phase status (e.g., Deep Navy for vetting, Emerald for cleared). Content zones partitioned via `1px solid #E2E8F0` dividers.