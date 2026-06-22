---
name: RideFlow Editorial
colors:
  surface: '#f8faf6'
  surface-dim: '#d8dbd7'
  surface-bright: '#f8faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f1'
  surface-container: '#eceeeb'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e1e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#404944'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#eff1ee'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#416656'
  on-secondary: '#ffffff'
  secondary-container: '#c3ecd7'
  on-secondary-container: '#476c5b'
  tertiary: '#4f2000'
  on-tertiary: '#ffffff'
  tertiary-container: '#723100'
  on-tertiary-container: '#ff9758'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#c3ecd7'
  secondary-fixed-dim: '#a8cfbc'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#294e3f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68d'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#f8faf6'
  on-background: '#191c1b'
  surface-variant: '#e1e3e0'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 48px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style

The design system is built on the narrative of "The Modern Explorer." It shifts away from high-gloss, tech-heavy aesthetics toward a premium, editorial travel experience. The personality is rugged yet refined—evoking the tactile feel of a high-end physical travel journal combined with the precision of a GPS instrument.

The visual style merges **Minimalism** with **Modern Editorial** influences. It prioritizes vast whitespace to represent the open road, high-contrast typography for legibility under varying light conditions, and organic textures that ground the digital interface in the physical world of motorcycle touring. The emotional response should be one of confidence, quiet luxury, and the visceral excitement of an upcoming journey.

## Colors

The palette is rooted in the natural landscape, moving from forest depths to sun-baked earth.
- **Primary (Deep Forest Green):** Used for brand-heavy moments, primary navigation, and core interaction points. It provides the "trustworthy" anchor of the system.
- **Secondary (Soft Sage):** Acts as a subtle tonal background for containers, chips, and secondary UI elements to reduce visual noise.
- **Accents (Burnt Terracotta & Sunrise Orange):** These are "Action & Status" colors. The Burnt Terracotta is used for highlights, GPS pathing, and active states, providing an earthy, high-visibility contrast. Orange is reserved for high-urgency notifications or "Start Ride" actions.
- **Neutral/Background:** An off-white base keeps the interface feeling light and airy, preventing the "heavy" feeling often associated with dark-themed adventure apps.

## Typography

Typography follows a strict hierarchical structure to ensure clarity during planning and while on the move. 
- **Headlines:** Montserrat is utilized for its geometric confidence and "outdoor" heritage. Large display sizes use tight tracking to feel more impactful and editorial.
- **Body:** Inter provides a systematic, neutral counter-balance that ensures maximum legibility for long-form route descriptions or technical bike specs.
- **Labels:** Small utility text uses uppercase Inter with increased letter spacing to differentiate metadata from body content.

## Layout & Spacing

This design system employs a **Fluid Grid** with generous inner margins to evoke a premium editorial layout. 
- **Desktop:** A 12-column grid with a max-width of 1440px. Content is often offset or utilizes asymmetrical placement to mimic magazine spreads.
- **Mobile:** A 4-column grid. Touch targets are prioritized, with vertical spacing increased to 12px or 16px between interactive elements to accommodate gloved hands or vibrations.
- **Rhythm:** Spacing follows an 8px scale. Use `section-gap` (64px) between major content blocks to maintain the feeling of "open space."

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than harsh lines. 
- **Surface 0 (Background):** #F8FAF6.
- **Surface 1 (Cards/Modals):** Pure White (#FFFFFF) with a very soft, diffused shadow (15% opacity, 20px blur, 4px Y-offset).
- **Surface 2 (Interactions):** Soft Sage (#D1FAE5) used as a hover or active background state to indicate depth without adding vertical shadows.
- **Depth Cues:** High-quality photography should use subtle "vignette" overlays or depth-of-field blurs when text is placed on top, maintaining the "premium travel" aesthetic.

## Shapes

The shape language is "Friendly-Technical." 
- **Core Radius:** A standard 8px (0.5rem) radius for buttons and inputs.
- **Large Radius:** Cards and image containers use a generous 16px to 24px radius (`rounded-xl` to `rounded-2xl`). This softens the "rugged" nature of the brand, making it feel more approachable and modern.
- **Icons:** Use line-based icons with a 2px stroke and slightly rounded terminals to match the UI's geometry.

## Components

- **Buttons:** Primary buttons use Deep Forest Green with white text. Secondary buttons use a Ghost style with a 1.5px Forest Green border. "Start Ride" buttons utilize the high-contrast accent palette.
- **Cards:** White backgrounds, 24px corner radius, and subtle 1px Forest Green borders at 5% opacity. Images within cards should always have a 16:9 or 4:3 aspect ratio.
- **Chips:** Used for "Route Difficulty" or "Terrain Type." These should have a pill shape and use the Soft Sage background with Deep Forest Green text.
- **Inputs:** Clean, underlines or light-gray borders. Focus states transition to Forest Green.
- **Map Elements:** Custom-styled map tiles using a monochromatic light-gray base, with the route highlighted in Burnt Terracotta. Use custom "Compass" style markers for GPS pins.
- **Progress Trackers:** Vertical "Trail Lines" with dotted patterns to indicate distance covered vs. distance remaining.