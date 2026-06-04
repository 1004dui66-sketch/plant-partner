---
name: Botanical Innovation
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404944'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
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
  tertiary: '#242f41'
  on-tertiary: '#ffffff'
  tertiary-container: '#3a4558'
  on-tertiary-container: '#a7b2c9'
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
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  code-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system embodies the intersection of organic life and advanced technology. The brand personality is "Botanical Sophistication meets Silicon Valley Innovation," targeting a premium audience that values environmental harmony as much as technical precision. 

The visual style is **Modern Glassmorphism**. It utilizes soft, translucent layers to mimic the dappled light of a greenhouse, paired with the sharp, crisp precision of high-end software. The interface should feel breathable and calm, yet undeniably powerful. High-quality botanical photography serves as the foundation, with UI elements floating above like sophisticated data overlays on nature.

## Colors

The palette is anchored in **Emerald**, representing the depth and intelligence of plant life. **Mint** provides a refreshing, tech-forward highlight used for secondary actions and light backgrounds. **Dark Slate** is reserved for high-contrast typography and technical data points, ensuring a grounded, professional feel.

The background strategy relies on a soft off-white (#F8FAFC) to allow glass effects to pop. Gradients should transition subtly from Emerald to a deep forest shade or from Mint to White to simulate natural light shifts. Use transparency (alpha 0.1 to 0.7) for glass containers to maintain legibility while showcasing background imagery.

## Typography

This design system uses a high-contrast typographic pairing to bridge the gap between "Botanical" and "Innovation." 

**Playfair Display** is used for headlines to convey luxury, heritage, and the intricate beauty of nature. **Hanken Grotesk** provides a sharp, contemporary contrast for body copy and UI labels, ensuring maximum readability and a "Silicon Valley" efficiency. Large display sizes should use tight letter-spacing to feel curated, while labels use uppercase tracking for a systematic, technical appearance.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a premium, editorial feel, while transitioning to a fluid model for mobile. 

A 12-column grid is used with generous 64px outer margins on desktop to create "breathing room" reminiscent of high-end galleries. Spacing follows an 8px linear scale. Vertical rhythm should be intentionally airy (using `stack-lg`) between major sections to prevent the AI data from feeling overwhelming. Elements should often overlap slightly—such as a glass card partially covering a photo—to create depth.

## Elevation & Depth

Depth is created through **Glassmorphism** and soft **Ambient Shadows**. 

1.  **Base Layer:** Solid Mint or White background, or high-resolution botanical photography.
2.  **Glass Layer:** Surfaces use a background-blur (20px to 40px) with a semi-transparent white fill (70% opacity). 
3.  **Stroke:** Every glass element must have a 1px solid white border at 30% opacity to define the edge, mimicking the refraction of light on glass.
4.  **Shadows:** Use extremely diffused, low-opacity shadows (Blur: 30px, Y: 10px, Color: Emerald at 5% opacity) to make components appear as if they are floating gently above the organic background.

## Shapes

The shape language is **Pill-shaped** and ultra-soft. There are no sharp corners in this design system. 

The large radii (1rem for standard components, up to 3rem for cards) evoke the organic curves found in leaves and petals. This "squishy" and soft aesthetic reduces the perceived coldness of the AI technology, making the "Plant Buddy" feel approachable and nurturing. Circles and organic blobs are encouraged for decorative background elements.

## Components

-   **Buttons:** Primary buttons use a solid Emerald fill with White Hanken Grotesk text. Secondary buttons use the Glassmorphic style with a Mint tint and a subtle border.
-   **Cards:** Large border-radius (rounded-xl) with high background blur. Content within cards should have generous internal padding (32px).
-   **Input Fields:** Clear glass containers with a subtle Dark Slate stroke on focus. Use Hanken Grotesk for placeholder text.
-   **Chips/Tags:** Small, pill-shaped elements using a Mint background at 20% opacity with Emerald text to indicate plant species or health status.
-   **Data Visualization:** Graphs and charts should use thin, elegant lines in Emerald, with glowing Mint data points to emphasize the "AI intelligence" aspect.
-   **Botanical Markers:** Unique UI pins that appear on plant photos, using a circular glass blur with a pulsing Emerald center to indicate active AI scanning.