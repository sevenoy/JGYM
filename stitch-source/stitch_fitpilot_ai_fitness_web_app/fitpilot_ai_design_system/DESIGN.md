---
name: FitPilot AI Design System
colors:
  surface: '#f4fbf8'
  surface-dim: '#d4dcd9'
  surface-bright: '#f4fbf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f2'
  surface-container: '#e8efec'
  surface-container-high: '#e2eae7'
  surface-container-highest: '#dde4e1'
  on-surface: '#161d1b'
  on-surface-variant: '#3c4a46'
  inverse-surface: '#2b3230'
  inverse-on-surface: '#ebf2ef'
  outline: '#6b7a76'
  outline-variant: '#bacac5'
  surface-tint: '#006b5f'
  primary: '#006b5f'
  on-primary: '#ffffff'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#3cddc7'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffad3a'
  on-tertiary-container: '#6d4400'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f4fbf8'
  on-background: '#161d1b'
  surface-variant: '#dde4e1'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  stack-gap: 16px
  section-gap: 32px
  card-padding: 24px
---

## Brand & Style

This design system embodies a "Wellness Tech" aesthetic—a fusion of the rigorous precision found in productivity tools like Notion and the vibrant, motivational energy of Apple Fitness+. The brand personality is encouraging, professional, and luminous. It deliberately moves away from the aggressive, high-intensity "grind" culture of traditional fitness apps, favoring a holistic, calm, and health-forward atmosphere.

The visual style is **Soft Minimalism with Glassmorphic accents**. It relies on high-quality white space, a palette of airy tints, and "breathable" layouts. The goal is to make fitness feel accessible and mentally refreshing rather than physically daunting. The UI should feel lightweight, as if the elements are floating on a layer of fresh air.

## Colors

The palette is anchored in "Freshness." We utilize light, cool backgrounds to maintain a sense of cleanliness and energy. 

- **Primary:** A vibrant Fresh Teal (#2DD4BF) used for success states, primary actions, and progress indicators.
- **Secondary:** Sky Blue (#0EA5E9) for secondary data points and navigational elements.
- **Accent:** Vibrant Orange (#F59E0B) is used sparingly to draw attention to AI-driven insights, "Start" buttons, or high-priority notifications.
- **Backgrounds:** We avoid pure white in favor of a "Soft Off-White" (#F8FAFC). Pale Mint and Light Azure are used to differentiate content sections without adding visual weight.
- **Text:** Deep slate tones are used instead of pure black to maintain a premium, softer contrast ratio.

## Typography

This design system uses **Plus Jakarta Sans** for headlines to provide a friendly, modern, and slightly geometric character. For body text and functional labels, **Inter** is used for its exceptional legibility and neutral, systematic feel.

- **Scale:** High contrast between headlines and body text to create clear information hierarchy.
- **Weights:** Use Semibold (600) for interactive elements and Bold (700) only for primary page headers. 
- **Readability:** Body text uses a generous 1.6 line-height to ensure long-form workout descriptions or AI advice are easy to digest.

## Layout & Spacing

The layout follows a **Fluid Mobile-First** approach. Content is primarily housed within high-margin containers to avoid visual clutter.

- **Grid:** A standard 4-column mobile grid with 16px gutters.
- **Margins:** A generous 20px side margin is maintained across all screens to emphasize the "airy" brand tone.
- **Rhythm:** We use an 8px spacing scale. Most vertical stacks use 16px or 24px gaps. 
- **Safe Areas:** Navigation elements are strictly bottom-aligned within the mobile tab bar, ensuring easy thumb reach.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering** rather than heavy borders.

- **The "Floating" Card:** Primary content containers use a very soft, diffused shadow (Blur: 30px, Y: 10px) with a low-opacity teal or blue tint (2-4%) rather than pure grey. This creates a "glow" effect that feels healthy and light.
- **Glassmorphism:** The Tab Bar and Top Navigation use a heavy backdrop blur (20px) with a 70% opaque off-white background to maintain context of the content scrolling beneath them.
- **Z-Index:** AI "Pilots" or pop-up insights should appear on the highest elevation with a more pronounced shadow to signify their importance.

## Shapes

The shape language is "Hyper-Rounded" to evoke friendliness and safety.

- **Cards:** Use a minimum radius of **24px**. For large feature cards, this can scale up to **32px**.
- **Buttons:** Primary buttons are fully rounded (pill-shaped) to distinguish them clearly from card-based content.
- **Selection States:** Small interactive elements like chips or date pickers use a 12px radius.
- **Visual Metaphor:** Avoid sharp 90-degree corners anywhere in the application to maintain the "wellness" softness.

## Components

- **Primary Action Button:** Pill-shaped, Fresh Teal background with white text. High-contrast and centered for primary workout triggers.
- **Activity Cards:** Large 24px+ rounded containers with a #FFFFFF background. They use a "soft glow" shadow. Inside, content is padded by 24px.
- **AI Insight Chips:** Small, pale-azure capsules used to categorize AI-generated suggestions (e.g., "Recovery Tip" or "Form Check").
- **Tab Bar:** A frosted glass bar at the bottom with thin, 2px Sky Blue indicators for the active state. Icons should be "Line Art" style with rounded caps.
- **Progress Rings:** Utilizing the Fresh Teal and Sky Blue colors in a soft, non-segmented gradient to show daily goal completion.
- **Input Fields:** Soft grey backgrounds (#F1F5F9) with no borders; they transform to a Fresh Teal 2px border only when focused.