# Eflow Logo Assets

This directory contains the Eflow brand logo in various formats.

## Logo Files

### Main Logo
- `eflow-logo.svg` - Default logo with `currentColor` (adapts to text color)
- `eflow-logo-light.svg` - Light mode version (dark text #18181B)
- `eflow-logo-dark.svg` - Dark mode version (light text #FAFAFA)

### App Icons
- `favicon.svg` - 32x32 favicon for browser tabs
- `icon-512.svg` - 512x512 high-resolution app icon

## Design Concept

The logo features a minimalist letter "E" with flowing connection lines representing:
- **E Shape**: The core identity of "Eflow"
- **Flow Lines**: Data relationships and connections in ERD diagrams
- **Connection Nodes**: Database entities and their relationships
- **Blue Accent (#3B82F6)**: Represents data flow and connectivity

## Usage

### In React Components
```tsx
import Image from 'next/image'

// Default (adapts to theme)
<Image src="/eflow-logo.svg" alt="Eflow" width={200} height={200} />

// Light mode specific
<Image src="/eflow-logo-light.svg" alt="Eflow" width={200} height={200} />

// Dark mode specific
<Image src="/eflow-logo-dark.svg" alt="Eflow" width={200} height={200} />
```

### As Inline SVG
```tsx
<svg width="200" height="200" viewBox="0 0 200 200">
  <use href="/eflow-logo.svg#eflow-logo" />
</svg>
```

## Color Palette

- **Primary Dark**: #18181B (zinc-900)
- **Primary Light**: #FAFAFA (zinc-50)
- **Accent Blue**: #3B82F6 (blue-500)
