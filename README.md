# 🎨 Creato-Sphere

> **"Figma + Midjourney + Adobe + an Ad Agency — inside one calm, intelligent UI."**

Creato-Sphere is a comprehensive AI-powered creative suite designed to generate retailer-compliant, multi-format advertising creatives in minutes. It combines 18 specialized AI engines with a professional canvas editor, enabling non-designers to create stunning marketing materials without design expertise.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Technology Stack](#-technology-stack)
3. [System Architecture](#-system-architecture)
4. [Application Pages (Detailed)](#-application-pages-detailed)
5. [18 AI Engines (Complete Documentation)](#-18-ai-engines-complete-documentation)
6. [Database Schema](#-database-schema)
7. [API Endpoints](#-api-endpoints)
8. [Design System](#-design-system)
9. [Features Overview](#-features-overview)
10. [Environment Configuration](#-environment-configuration)
11. [License](#-license)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Lovable Cloud account (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/creato-sphere.git

# Navigate to project directory
cd creato-sphere

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5173
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_BACKEND_TYPE=supabase  # or 'fastapi' for local development
```

---

## 🛠 Technology Stack

### Frontend Layer

| Technology | Purpose | Version |
|------------|---------|---------|
| **React 18** | UI component library | ^18.3.1 |
| **TypeScript** | Type-safe JavaScript | ^5.x |
| **Vite** | Build tool & dev server | ^5.x |
| **Tailwind CSS** | Utility-first styling | ^3.x |
| **shadcn/ui** | Pre-built accessible components | Latest |
| **Fabric.js 7** | Canvas manipulation engine | ^7.0.0 |
| **Framer Motion** | Animation library | ^12.x |
| **Zustand** | State management | ^5.0.9 |
| **TanStack Query** | Data fetching & caching | ^5.x |
| **React Router DOM** | Client-side routing | ^6.30.1 |
| **Lucide React** | Icon library | ^0.462.0 |
| **Recharts** | Data visualization | ^2.15.4 |

### Backend Layer (Lovable Cloud)

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database, auth, storage |
| **Edge Functions** | Serverless AI endpoints (Deno runtime) |
| **Lovable AI Gateway** | Unified AI model access (Gemini, GPT-5) |
| **Row Level Security (RLS)** | Database access control |

### Alternative Backend (FastAPI)

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python REST API framework |
| **MongoDB Atlas** | Document database |
| **Beanie ODM** | MongoDB async ODM |
| **JWT** | Authentication tokens |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   React     │  │  Fabric.js  │  │   Zustand   │  │  TanStack  │ │
│  │   Router    │  │   Canvas    │  │    Store    │  │   Query    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API ABSTRACTION LAYER                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   src/lib/api/                               │   │
│  │  ┌───────────────┐              ┌───────────────┐           │   │
│  │  │   Supabase    │◄── switch ──►│    FastAPI    │           │   │
│  │  │   Adapter     │              │    Adapter    │           │   │
│  │  └───────────────┘              └───────────────┘           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  LOVABLE CLOUD (Supabase)                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │PostgreSQL│  │   Auth   │  │ Storage  │  │Edge Funcs  │  │   │
│  │  │  + RLS   │  │   JWT    │  │  Buckets │  │ (18 AI)    │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AI GATEWAY LAYER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │               Lovable AI Gateway (Unified API)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │ Gemini   │  │  GPT-5   │  │ GPT-5    │  │  Gemini    │  │   │
│  │  │  2.5 Pro │  │  Full    │  │  Mini    │  │  2.5 Flash │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Application Pages (Detailed)

### 1. 🏠 Landing Page (`/`)

**File:** `src/pages/LandingPage.tsx`

**Purpose:** Marketing-focused homepage designed to convert visitors into users. Showcases the platform's capabilities, AI engines, and value proposition.

**Sections:**

| Section | Description | Key Features |
|---------|-------------|--------------|
| **Hero Section** | Animated hero with headline, CTA buttons | Floating geometric shapes, gradient backgrounds, video modal |
| **Trust Badges** | Social proof indicators | Animated stats (10K+ Users, 500K+ Creatives, 18 AI Engines, 99.9% Uptime) |
| **How It Works** | 3-step process explanation | Step 1: Upload/Describe → Step 2: AI Magic → Step 3: Export |
| **18 AI Engines Gallery** | Interactive slider showcasing all AI engines | Auto-scroll carousel, gradient icons, hover glow effects, animated orbs |
| **Features Grid** | Key platform capabilities | Multi-format, brand consistency, compliance, real-time collaboration |
| **Pricing** | Subscription tiers | Free, Pro ($29/mo), Team ($99/mo), Enterprise (custom) |
| **CTA Section** | Final conversion push | "Start Creating for Free" with demo video option |
| **Footer** | Navigation links, social media, legal | Contact info, documentation links |

**User States:**
- **Not Logged In:** Shows "Sign In" and "Get Started" buttons
- **Logged In:** Shows "Dashboard" and "Open Builder" buttons

**Animations:**
- Framer Motion page transitions
- Floating gradient orbs with infinite animation
- Scroll-triggered reveal animations
- Embla carousel auto-scroll for AI engines

---

### 2. 🔐 Authentication Page (`/auth`)

**File:** `src/pages/Auth.tsx`

**Purpose:** Unified authentication page handling both login and registration flows with email-based authentication.

**Components:**

| Component | Functionality |
|-----------|---------------|
| **Email Input** | Email address validation |
| **Password Input** | Secure password entry (min 6 characters) |
| **Mode Toggle** | Switch between "Sign In" and "Sign Up" modes |
| **Submit Button** | Loading state with spinner |
| **Error Display** | Toast notifications for validation errors |

**Authentication Flow:**
1. User enters email and password
2. Mode-dependent API call (signInWithPassword / signUp)
3. Success → Redirect to Dashboard
4. Failure → Display error toast

**Security Features:**
- Auto-confirm email signups enabled
- JWT token storage in local storage
- Session persistence across browser closes
- RLS enforcement on all database queries

**Design:**
- Centered card layout
- Dark mode optimized
- Gradient accent borders
- Responsive on mobile devices

---

### 3. 📊 Dashboard (`/dashboard`)

**File:** `src/pages/Dashboard.tsx`

**Purpose:** Central hub for project management, quick actions, and navigation to creative workflows.

**Sections:**

| Section | Description | Features |
|---------|-------------|----------|
| **Header** | Navigation bar | Logo (links to landing), user avatar, settings dropdown |
| **Quick Actions** | Primary action buttons | "New Creative", "Upload Asset", "Brand Kit" |
| **Recent Projects** | Project grid | Thumbnail previews, names, last edited dates, quick actions |
| **Templates Gallery** | Starter templates | Category filters, favorites, use template button |
| **Stats Overview** | Usage metrics | Total projects, AI generations used, storage consumed |

**Project Management:**
- **Create:** Opens format selector dialog → Creates project → Navigates to Builder
- **Edit:** Opens project in Creative Builder
- **Duplicate:** Creates copy with "(Copy)" suffix
- **Delete:** Confirmation dialog → Soft delete

**Quick Actions:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  ➕ New         │  │  📤 Upload      │  │  🎨 Brand Kit   │
│  Creative       │  │  Asset          │  │  Manager        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Template Categories:**
- Social Media (Instagram, Facebook, Twitter, LinkedIn, TikTok)
- E-commerce (Product Cards, Banners, Amazon Listings)
- Marketing (Email Headers, Blog Graphics, Ads)
- Print (Flyers, Posters, Business Cards)

---

### 4. 🎨 Creative Builder (`/builder/:id?`)

**File:** `src/pages/CreativeBuilder.tsx`

**Purpose:** The core canvas editor where users design and generate ad creatives using AI-powered tools.

**Layout Structure:**

```
┌────────────────────────────────────────────────────────────────────┐
│                         TOP BAR                                    │
│  [Logo] [Format: 1080x1080 ▼] [Quick Export] [Theme] [?]          │
├──────────────┬────────────────────────────────┬───────────────────┤
│              │                                │                   │
│   LEFT       │                                │      RIGHT        │
│   PANEL      │        CANVAS AREA            │      PANEL        │
│              │                                │                   │
│  - Icons     │   ┌──────────────────────┐    │  - Properties     │
│  - Assets    │   │                      │    │  - Colors         │
│  - Layers    │   │   Fabric.js Canvas   │    │  - Fonts          │
│  - AI Tools  │   │   (with safe zones)  │    │  - Brand Kit      │
│              │   │                      │    │  - AI Panel       │
│              │   └──────────────────────┘    │                   │
│              │                                │                   │
├──────────────┴────────────────────────────────┴───────────────────┤
│                      MOBILE BOTTOM NAV                            │
└────────────────────────────────────────────────────────────────────┘
```

**Left Panel Components:**

| Component | Purpose |
|-----------|---------|
| **Draggable Icon Library** | 500+ icons organized by category (arrows, shapes, social, business) |
| **Asset Manager** | Uploaded images, brand assets, generated backgrounds |
| **Layer Panel** | Z-index control, visibility toggle, lock/unlock, naming |
| **AI Tools Accordion** | Access to all 18 AI engines |

**Right Panel Components:**

| Component | Purpose |
|-----------|---------|
| **Object Properties** | Selected object's position, size, rotation, opacity |
| **Color Picker** | Fill, stroke, gradient controls |
| **Typography Panel** | Font family, size, weight, line height, letter spacing |
| **Brand Kit Hub** | Apply brand colors, fonts, logos |
| **Compliance Score** | Real-time compliance percentage |

**Canvas Features:**
- **Safe Zones Overlay:** Platform-specific guide lines
- **Realtime Cursors:** Collaboration presence indicators
- **Keyboard Shortcuts:** Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+C/V (copy/paste), Delete, Arrow keys
- **Touch Gestures:** Pinch zoom, two-finger pan (mobile)
- **History Management:** 50-step undo/redo stack

**Format Presets:**

| Platform | Format | Dimensions |
|----------|--------|------------|
| Instagram | Feed Post | 1080 × 1080 |
| Instagram | Story | 1080 × 1920 |
| Instagram | Reels Cover | 1080 × 1920 |
| Facebook | Post | 1200 × 630 |
| Facebook | Story | 1080 × 1920 |
| Facebook | Cover | 820 × 312 |
| Twitter/X | Post | 1200 × 675 |
| Twitter/X | Header | 1500 × 500 |
| LinkedIn | Post | 1200 × 627 |
| LinkedIn | Banner | 1584 × 396 |
| YouTube | Thumbnail | 1280 × 720 |
| YouTube | Banner | 2560 × 1440 |
| Pinterest | Pin | 1000 × 1500 |
| TikTok | Video Cover | 1080 × 1920 |
| Amazon | Product | 1000 × 1000 |

---

### 5. 👤 Profile Page (`/profile`)

**File:** `src/pages/Profile.tsx`

**Purpose:** User account management, preferences, and AI-powered avatar generation.

**Sections:**

| Section | Features |
|---------|----------|
| **Avatar Section** | Current avatar display, AI avatar generation button, upload option |
| **Personal Info** | Full name, email (read-only), bio |
| **Account Settings** | Theme preference (light/dark/system), notification settings |
| **Security** | Change password link, two-factor authentication (future) |
| **Danger Zone** | Delete account with confirmation |

**AI Avatar Generation:**
1. User clicks "Generate AI Avatar"
2. System extracts user's name for prompt
3. Edge function calls image generation API
4. New avatar uploaded to Supabase Storage
5. Profile updated with new avatar URL

**Dark Mode Styling:**
- Subtle gradient backgrounds
- Muted accent colors for icons
- Glass-morphism card effects
- Proper contrast ratios (WCAG AA compliant)

---

### 6. 🚫 Not Found Page (`/404`)

**File:** `src/pages/NotFound.tsx`

**Purpose:** Error page for invalid routes with navigation options.

**Features:**
- Large 404 display
- Helpful message explaining the error
- "Go Home" button → Landing page
- "Open Dashboard" button → Dashboard (if logged in)
- Animated background elements

---

## 🤖 18 AI Engines (Complete Documentation)

### Engine 1: 🧬 Brand DNA Extractor

**Endpoint:** `POST /ai/brand-dna`

**Purpose:** Analyzes product images, logos, or brand materials to automatically extract brand identity elements including colors, typography recommendations, and brand personality traits.

**How It Works:**
1. User uploads a product image or logo (URL or Base64)
2. AI vision model analyzes visual elements
3. Extracts dominant colors using color theory
4. Identifies typography style recommendations
5. Determines brand personality traits (modern, classic, playful, premium)
6. Returns complete brand kit ready for use

**Input Schema:**
```typescript
{
  imageUrl?: string;      // URL to the image
  imageBase64?: string;   // Base64 encoded image data
}
```

**Output Schema:**
```typescript
{
  brandDNA: {
    personality: string[];       // ["Modern", "Premium", "Innovative"]
    values: string[];           // ["Quality", "Trust", "Innovation"]
    moodKeywords: string[];     // ["Sleek", "Professional", "Bold"]
    targetAudience: string;     // "Young professionals aged 25-40"
    industryFit: string[];      // ["Technology", "Finance", "Luxury"]
  },
  brandKit: {
    primaryColor: string;       // "#22C55E"
    secondaryColor: string;     // "#38BDF8"
    accentColor: string;        // "#F59E0B"
    backgroundColor: string;    // "#0A0A0B"
    fontHeading: string;        // "Inter"
    fontBody: string;           // "Inter"
  }
}
```

**Use Cases:**
- New brand setup from existing product photos
- Competitor brand analysis
- Client onboarding (extract their brand from website screenshots)
- Refreshing brand kits from updated product lines

---

### Engine 2: 📐 AutoLayout Engine

**Purpose:** Intelligently repositions and resizes design elements when switching between different format dimensions, maintaining visual hierarchy and balance.

**How It Works:**
1. Analyzes current canvas element positions and sizes
2. Identifies element hierarchy (primary, secondary, tertiary)
3. Calculates new positions based on target dimensions
4. Applies smart scaling while respecting safe zones
5. Adjusts text size proportionally
6. Maintains relative spacing between elements

**Supported Transformations:**

| From | To | Strategy |
|------|-----|----------|
| Square (1:1) | Portrait (9:16) | Stack vertically, increase text prominence |
| Square (1:1) | Landscape (16:9) | Spread horizontally, add side margins |
| Portrait (9:16) | Square (1:1) | Center crop, prioritize top elements |
| Landscape (16:9) | Portrait (9:16) | Reflow to vertical stack |

**Features:**
- Preserves aspect ratios of images
- Respects brand safe zones
- Maintains text readability (minimum font sizes)
- Groups related elements together

---

### Engine 3: ✅ Compliance Checker

**Purpose:** Real-time validation ensuring creatives meet platform-specific requirements for text coverage, safe zones, resolution, and accessibility standards.

**Compliance Rules:**

| Platform | Text Limit | Safe Zone | Min Resolution | File Size |
|----------|------------|-----------|----------------|-----------|
| Facebook Ads | <20% of image | 14% margin | 1080×1080 | <30MB |
| Instagram Feed | <20% of image | 5% margin | 1080×1080 | <30MB |
| Instagram Story | <25% of image | 250px top/bottom | 1080×1920 | <30MB |
| Google Display | <20% of image | 10% margin | Various | <150KB |
| LinkedIn | No limit | 5% margin | 1200×627 | <5MB |
| Twitter/X | No limit | 3% margin | 1200×675 | <5MB |
| Amazon A+ | <30% of image | Safe zone varies | 970×600 | <2MB |

**Scoring System:**
- **90-100:** ✅ Ready to publish (green badge)
- **70-89:** ⚠️ Minor fixes recommended (yellow badge)
- **50-69:** ⚠️ Significant issues (orange badge)
- **Below 50:** ❌ Major compliance failures (red badge)

**Checks Performed:**
1. Text-to-image ratio calculation
2. Element position vs safe zone overlap
3. Image resolution adequacy
4. Color contrast for accessibility (WCAG AA)
5. Font size minimums for readability
6. File format compatibility
7. Logo placement recommendations

---

### Engine 4: 🌌 Creative Multiverse Generator

**Endpoint:** `POST /ai/creative-multiverse`

**Purpose:** Generates 20+ distinct style variations of the current design, allowing users to explore different creative directions instantly.

**Available Styles:**

| # | Style | Description |
|---|-------|-------------|
| 1 | **Premium Luxury** | Gold accents, serif fonts, elegant spacing |
| 2 | **Minimal Clean** | Abundant white space, sans-serif, muted colors |
| 3 | **Neon Futuristic** | Vibrant neon colors, dark backgrounds, tech feel |
| 4 | **Retro Vintage** | Muted earth tones, textured backgrounds, classic fonts |
| 5 | **Dark Moody** | Deep blacks, dramatic lighting, high contrast |
| 6 | **Festive Seasonal** | Holiday colors, celebratory elements, ornaments |
| 7 | **Corporate Professional** | Blues and grays, structured layouts, formal |
| 8 | **Playful Vibrant** | Bold primary colors, rounded shapes, fun fonts |
| 9 | **Organic Natural** | Greens and browns, leaf patterns, eco-friendly |
| 10 | **Tech Futuristic** | Gradients, glows, geometric patterns |
| 11 | **Lifestyle Photography** | Image-centric, lifestyle focus, aspirational |
| 12 | **Bold Graphic** | Large typography, strong contrasts, impactful |
| 13 | **Soft Pastel** | Light colors, gentle gradients, delicate |
| 14 | **Urban Street** | Graffiti influence, edgy, youth-oriented |
| 15 | **Scandinavian** | Simple, functional, light backgrounds |
| 16 | **Art Deco** | Geometric patterns, gold details, 1920s influence |
| 17 | **Brutalist** | Raw, stark, industrial, intentionally harsh |
| 18 | **Illustrated** | Hand-drawn elements, artistic, unique |
| 19 | **High Contrast** | Black and white with color accents |
| 20 | **Trendy Gen-Z** | Current trends, memes influence, bold choices |

**Input:**
```typescript
{
  canvasData: FabricJSCanvas;    // Current canvas state
  productDescription: string;    // "Summer sale for athletic wear"
  selectedStyles?: string[];     // Optional specific styles to generate
}
```

**Output:**
```typescript
{
  variations: [
    {
      styleId: "premium-luxury",
      styleName: "Premium Luxury",
      canvasData: FabricJSCanvas,  // Ready-to-apply canvas JSON
      thumbnail: string            // Preview URL
    }
  ],
  allStyles: StyleDefinition[]
}
```

---

### Engine 5: 🖼️ AI Background Generator

**Endpoint:** `POST /ai/generate-background`

**Purpose:** Creates professional, contextually appropriate backgrounds for product placement using AI image generation.

**Input:**
```typescript
{
  prompt: string;           // "Minimalist marble surface with soft shadows"
  productContext?: string;  // "Luxury skincare product"
  style?: string;           // "product-photography" | "lifestyle" | "abstract"
  aspectRatio?: string;     // "1:1" | "16:9" | "9:16" | "4:3"
}
```

**Prompt Enhancement:**
The engine automatically enhances user prompts with:
- "Professional product photography background"
- "High resolution, commercial quality"
- "Soft, even lighting"
- "No text or watermarks"
- "Subtle gradients or textures only"

**Popular Background Types:**

| Category | Examples |
|----------|----------|
| **Studio** | White sweep, colored gradients, light gray |
| **Surfaces** | Marble, wood grain, concrete, fabric |
| **Nature** | Leaves, flowers, water reflections |
| **Abstract** | Geometric patterns, color splashes |
| **Seasonal** | Snow, autumn leaves, spring blossoms |
| **Lifestyle** | Kitchen counter, desk setup, outdoor cafe |

---

### Engine 6: 💭 Emotion-to-Design Translator

**Endpoint:** `POST /ai/emotion-design`

**Purpose:** Translates emotional goals and mood descriptions into concrete visual design parameters including colors, typography, spacing, and effects.

**Input:**
```typescript
{
  emotion: string;      // "Excitement" | "Trust" | "Calm" | "Urgency" | "Joy"
  intensity: number;    // 0.0 to 1.0 (subtle to intense)
  context?: string;     // "Black Friday sale for electronics"
}
```

**Output:**
```typescript
{
  designParams: {
    colors: {
      primary: "#hex",
      secondary: "#hex",
      accent: "#hex",
      background: "#hex",
      text: "#hex"
    },
    typography: {
      headingFont: "Montserrat",
      bodyFont: "Open Sans",
      headingWeight: "bold",
      letterSpacing: "tight"
    },
    composition: {
      layout: "asymmetric",
      spacing: "tight",
      alignment: "center"
    },
    effects: {
      shadows: "dramatic",
      gradients: true,
      textures: "subtle",
      borders: "bold"
    },
    mood: {
      description: "High-energy, impactful design...",
      intensity: 85,
      warmth: "warm"
    }
  }
}
```

**Emotion Mappings:**

| Emotion | Colors | Typography | Effects |
|---------|--------|------------|---------|
| **Excitement** | Red, orange, yellow | Bold, condensed | Strong shadows, gradients |
| **Trust** | Blue, green, white | Clean sans-serif | Subtle, professional |
| **Calm** | Soft blue, lavender, beige | Light weight, serif | Minimal, airy |
| **Urgency** | Red, black, yellow | Heavy, uppercase | High contrast, bold borders |
| **Joy** | Yellow, pink, bright green | Rounded, playful | Soft shadows, fun patterns |
| **Premium** | Gold, black, deep purple | Elegant serif | Subtle gradients, refined |

---

### Engine 7: 🔍 Visual Improvement Auditor

**Endpoint:** `POST /ai/visual-auditor`

**Purpose:** Provides AI-powered design critique with actionable improvement suggestions based on design principles and best practices.

**Analysis Categories:**

| Category | What's Checked |
|----------|----------------|
| **Composition** | Balance, alignment, visual hierarchy, rule of thirds |
| **Typography** | Font pairings, size hierarchy, readability, kerning |
| **Color Usage** | Harmony, contrast, brand consistency, accessibility |
| **Imagery** | Quality, relevance, placement, cropping |
| **White Space** | Breathing room, cluttered areas, margins |
| **Call-to-Action** | Visibility, placement, contrast, clarity |

**Output:**
```typescript
{
  overallScore: 78,
  grade: "B+",
  strengths: [
    "Strong color contrast draws attention",
    "Clear visual hierarchy established",
    "CTA button is prominently placed"
  ],
  improvements: [
    {
      area: "Typography",
      issue: "Heading and body fonts are too similar",
      suggestion: "Use a bold sans-serif for headings",
      impact: "high"
    },
    {
      area: "Whitespace",
      issue: "Elements are too close to edges",
      suggestion: "Add 20px padding around content area",
      impact: "medium"
    }
  ],
  quickWins: [
    "Increase CTA button size by 20%",
    "Add subtle shadow to product image"
  ]
}
```

---

### Engine 8: ✍️ Typography Harmony Advisor

**Endpoint:** `POST /ai/typography-harmony`

**Purpose:** Recommends scientifically-validated font pairings based on brand style, readability principles, and current design trends.

**Input:**
```typescript
{
  brandStyle: string;       // "modern" | "classic" | "playful" | "luxury" | "tech"
  currentFonts?: string[];  // ["Inter", "Roboto"]
  context?: string;         // "E-commerce fashion brand"
}
```

**Output:**
```typescript
{
  analysis: {
    currentAssessment: "Good foundation but lacking contrast",
    harmonyScore: 72,
    issues: ["Similar x-heights reduce distinction"]
  },
  recommendations: {
    primary: [
      {
        headingFont: "Playfair Display",
        bodyFont: "Source Sans Pro",
        reason: "Classic serif + modern sans creates elegant contrast",
        pairing: "complementary"
      }
    ],
    alternative: [...],
    experimental: [...]
  },
  usageGuide: {
    headings: { font: "Playfair Display", sizes: ["48px", "36px", "24px"] },
    body: { font: "Source Sans Pro", sizes: ["16px", "14px"] },
    captions: { font: "Source Sans Pro", sizes: ["12px"] }
  }
}
```

**Font Categories Considered:**

| Category | Examples | Best For |
|----------|----------|----------|
| **Geometric Sans** | Futura, Montserrat, Poppins | Modern, tech, startups |
| **Humanist Sans** | Open Sans, Lato, Source Sans | Friendly, accessible |
| **Transitional Serif** | Times, Georgia, Libre Baskerville | Traditional, editorial |
| **Modern Serif** | Playfair, Didot, Bodoni | Luxury, fashion, elegant |
| **Slab Serif** | Roboto Slab, Rockwell | Bold, impactful |
| **Display** | Bebas Neue, Oswald | Headlines only |

---

### Engine 9: 🎨 Color Psychology Analyzer

**Endpoint:** `POST /ai/color-psychology`

**Purpose:** Provides color recommendations based on target emotions, industry best practices, and cultural considerations.

**Input:**
```typescript
{
  targetEmotion: string;     // "trust", "excitement", "luxury"
  industry: string;          // "healthcare", "finance", "food"
  existingColors?: string[]; // ["#22C55E", "#38BDF8"]
}
```

**Output:**
```typescript
{
  colorAnalysis: {
    primaryRecommendations: [
      {
        color: "#1E40AF",
        name: "Royal Blue",
        emotion: "trust",
        strength: 92
      }
    ],
    complementaryPalette: ["#1E40AF", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
    psychologyInsights: {
      primaryEmotion: "Trust and reliability evoked by blue spectrum",
      secondaryEmotions: ["stability", "professionalism"],
      culturalConsiderations: "Blue is universally positive; avoid red in financial contexts",
      industryFit: "Healthcare and finance traditionally use blue for credibility"
    },
    usageGuidelines: {
      backgrounds: "Use lighter tints (10-20% saturation) for backgrounds",
      text: "Dark blue (#1E3A5F) for body text on light backgrounds",
      accents: "Amber (#F59E0B) for CTAs to create contrast",
      ctaButtons: "Primary blue or contrasting amber depending on urgency"
    }
  }
}
```

**Psychology Reference:**

| Color | Primary Emotions | Industries |
|-------|------------------|------------|
| **Red** | Urgency, passion, energy | Food, retail, entertainment |
| **Blue** | Trust, calm, professionalism | Finance, healthcare, tech |
| **Green** | Growth, nature, health | Organic, wellness, finance |
| **Yellow** | Optimism, warmth, attention | Food, children, caution |
| **Purple** | Luxury, creativity, wisdom | Beauty, premium brands |
| **Orange** | Enthusiasm, confidence, fun | Food, fitness, youth |
| **Black** | Luxury, power, sophistication | Fashion, luxury, tech |
| **White** | Purity, simplicity, clean | Healthcare, minimalist brands |

---

### Engine 10: 👁️ Attention Heatmap Simulator

**Endpoint:** `POST /ai/attention-heatmap`

**Purpose:** Predicts where viewers will look on your design based on visual psychology, element prominence, and composition analysis.

**Input:**
```typescript
{
  canvasElements: [
    {
      id: "text-1",
      type: "text",
      content: "50% OFF",
      position: { x: 100, y: 50 },
      size: { width: 200, height: 60 },
      fontSize: 48,
      color: "#FF0000",
      fontWeight: "bold"
    }
  ]
}
```

**Output:**
```typescript
{
  heatmapZones: [
    {
      elementId: "text-1",
      intensity: 95,      // 0-100 attention score
      rank: 1,            // Order of viewing
      reason: "Large red text with high contrast"
    },
    {
      elementId: "product-image",
      intensity: 78,
      rank: 2,
      reason: "Centered product with face/human element"
    }
  ],
  gazePath: [
    { x: 540, y: 200, order: 1, duration: 0.3 },  // First fixation
    { x: 300, y: 400, order: 2, duration: 0.5 },  // Second fixation
    { x: 540, y: 600, order: 3, duration: 0.4 }   // Third fixation
  ],
  recommendations: [
    "Move CTA button into primary attention zone",
    "Increase product image size for better visibility"
  ],
  summary: {
    primaryFocus: "Headline text",
    attentionFlow: "Top-left to center to bottom-right",
    blindSpots: ["Bottom-left corner", "Right edge"]
  }
}
```

**Factors Analyzed:**
1. **Size** - Larger elements attract more attention
2. **Color** - High saturation and contrast draw eyes
3. **Position** - F-pattern and Z-pattern reading habits
4. **Faces** - Human faces are attention magnets
5. **Motion** - Implied movement direction
6. **Isolation** - Elements with whitespace around them
7. **Text** - Headlines and numbers catch attention

---

### Engine 11: 📊 Performance Predictor

**Endpoint:** `POST /ai/performance-predictions`

**Purpose:** Forecasts advertising performance metrics (CTR, engagement, conversion) before publishing, based on creative analysis.

**Input:**
```typescript
{
  canvasAnalysis: {
    format: "instagram-feed",
    elements: CanvasElement[],
    colorAnalysis: { dominant: "#22C55E", contrast: 4.5 },
    textContent: "Summer Sale - 50% Off All Items",
    hasHumanFaces: true,
    hasCTA: true,
    ctaText: "Shop Now"
  }
}
```

**Output:**
```typescript
{
  predictions: {
    ctr: {
      value: 2.4,           // Predicted CTR percentage
      range: [1.8, 3.2],    // Confidence interval
      confidence: 78        // Prediction confidence %
    },
    engagement: {
      value: 4.2,           // Engagement rate %
      range: [3.5, 5.0],
      confidence: 82
    },
    conversion: {
      value: 0.8,           // Conversion rate %
      range: [0.5, 1.2],
      confidence: 65
    },
    recall: {
      value: 72,            // Brand recall score
      range: [65, 80],
      confidence: 70
    }
  },
  benchmarks: {
    industry: "E-commerce Fashion",
    averageCtr: 1.2,
    topPerformerCtr: 3.5
  },
  strengths: [
    "Strong color contrast increases visibility",
    "Clear CTA button drives action",
    "Human face element boosts engagement"
  ],
  weaknesses: [
    "Text may be too small on mobile",
    "Limited urgency elements"
  ],
  recommendations: [
    "Add countdown timer for urgency",
    "Increase headline font size by 20%"
  ],
  overallScore: 78
}
```

---

### Engine 12: 📐 Format Transformer

**Purpose:** Intelligently resizes designs across multiple platform formats while maintaining visual integrity and compliance.

**Transformation Logic:**

```
Source Format → Analyze Elements → Calculate Priorities → Apply Transformations
                                                               ↓
                                         ┌─────────────────────┼─────────────────────┐
                                         ↓                     ↓                     ↓
                                    Instagram              Facebook              Twitter
                                    Story                  Cover                 Header
                                    1080×1920              820×312               1500×500
```

**Element Priority System:**
1. **Critical** (always visible): Logo, CTA, primary headline
2. **Important** (scale down if needed): Product image, offer text
3. **Supporting** (hide if necessary): Decorative elements, secondary text
4. **Optional** (remove for small formats): Tertiary information

**Smart Behaviors:**
- Auto-stack elements for portrait formats
- Spread horizontally for landscape formats
- Maintain brand logo in visible corner
- Keep CTA above the fold
- Respect platform-specific safe zones

---

### Engine 13: 📈 Trend Forecast Engine

**Endpoint:** `POST /ai/trend-forecast`

**Purpose:** Monitors and predicts creative trends across industries and platforms, helping users stay ahead of the curve.

**Input:**
```typescript
{
  industry: string;          // "fashion", "tech", "food", "beauty"
  platform: string;          // "instagram", "tiktok", "linkedin"
  targetAudience?: string;   // "gen-z", "millennials", "professionals"
}
```

**Output:**
```typescript
{
  currentTrends: [
    {
      name: "Y2K Nostalgia",
      description: "Early 2000s aesthetics with metallics and gradients",
      momentum: "rising",
      adoptionRate: 45
    },
    {
      name: "AI-Generated Patterns",
      description: "Abstract backgrounds created with AI tools",
      momentum: "stable",
      adoptionRate: 60
    }
  ],
  emergingTrends: [
    {
      name: "Hyper-Personalization",
      description: "Dynamic content that adapts to viewer",
      timeToMainstream: "6-12 months",
      potentialImpact: "high"
    }
  ],
  decliningTrends: [
    {
      name: "Flat Illustration Style",
      description: "Vector illustrations with flat colors",
      recommendation: "Transition to 3D or gradient-enhanced versions"
    }
  ],
  recommendations: [
    {
      action: "Incorporate subtle gradients into existing flat designs",
      priority: "high",
      impact: "Increases modern perception by 35%"
    }
  ],
  industryInsights: "Fashion industry seeing strong shift toward sustainability messaging and earthy color palettes..."
}
```

---

### Engine 14: ✍️ AI Copywriting Engine

**Endpoint:** `POST /ai/copywriting`

**Purpose:** Generates 25-30 variations of advertising copy including headlines, CTAs, body text, and taglines across different tones.

**Input:**
```typescript
{
  productName: string;        // "Summer Collection 2025"
  productDescription: string; // "Lightweight breathable fabrics..."
  tone: string;               // "professional" | "casual" | "urgent" | "luxurious" | "playful"
  targetAudience?: string;    // "Young professionals aged 25-35"
  keyBenefits?: string[];     // ["Comfortable", "Stylish", "Affordable"]
}
```

**Output:**
```typescript
{
  headlines: [
    { text: "Summer Never Looked So Cool", tone: "playful" },
    { text: "Elevate Your Summer Wardrobe", tone: "premium" },
    { text: "Beat the Heat in Style", tone: "casual" },
    // ... 7 more variations
  ],
  subheadlines: [
    { text: "Breathable fabrics meet timeless design", tone: "professional" },
    // ... 7 more variations
  ],
  ctaButtons: [
    { text: "Shop the Collection", urgency: "low" },
    { text: "Get Yours Now", urgency: "medium" },
    { text: "Limited Time - Shop Now", urgency: "high" },
    // ... 2 more variations
  ],
  bodyText: [
    { text: "Discover our new summer collection...", length: "short" },
    // ... 4 more variations
  ],
  taglines: [
    { text: "Where Comfort Meets Style", memorable: true },
    // ... 4 more variations
  ]
}
```

**Tone Characteristics:**

| Tone | Vocabulary | Punctuation | Energy |
|------|------------|-------------|--------|
| **Professional** | Formal, precise | Periods, minimal exclamation | Medium |
| **Casual** | Friendly, relaxed | Conversational, contractions | Low-medium |
| **Urgent** | Action words, FOMO | Exclamation marks, caps | High |
| **Luxurious** | Elegant, exclusive | Sophisticated, refined | Low-medium |
| **Playful** | Fun, witty | Emojis optional, puns | High |
| **Inspirational** | Empowering, aspirational | Ellipses, powerful statements | Medium-high |

---

### Engine 15: 🎯 Campaign Set Creator

**Endpoint:** `POST /ai/campaign-set`

**Purpose:** Generates a complete campaign with hero creative plus 5-8 channel-specific variations, ensuring brand consistency across all touchpoints.

**Input:**
```typescript
{
  campaignName: string;          // "Black Friday 2025"
  campaignGoal: string;          // "Drive sales with 50% discount message"
  brandKit: BrandKit;            // Colors, fonts, logo
  productImages: string[];       // Product image URLs
  selectedChannels?: string[];   // ["instagram-feed", "facebook-post", "twitter"]
}
```

**Output:**
```typescript
{
  campaignDetails: {
    name: "Black Friday 2025",
    goal: "Drive sales with 50% discount message",
    createdAt: "2025-01-13"
  },
  heroCreative: {
    id: "hero-1",
    name: "Hero Creative",
    format: { width: 1080, height: 1080 },
    canvasData: FabricJSCanvas  // Full canvas JSON
  },
  variations: [
    {
      id: "instagram-story-1",
      channelId: "instagram-story",
      channelName: "Instagram Story",
      format: { width: 1080, height: 1920 },
      canvasData: FabricJSCanvas,
      platformNotes: "Added swipe-up CTA area"
    },
    {
      id: "facebook-cover-1",
      channelId: "facebook-cover",
      channelName: "Facebook Cover",
      format: { width: 820, height: 312 },
      canvasData: FabricJSCanvas,
      platformNotes: "Logo moved to avoid profile picture overlap"
    }
    // ... more variations
  ],
  allChannels: ChannelFormat[]  // All available channel options
}
```

**Channel Formats Supported:**

| Channel | Dimensions | Special Considerations |
|---------|------------|------------------------|
| Instagram Feed | 1080×1080 | Square focus, mobile-first |
| Instagram Story | 1080×1920 | Vertical, swipe-up area |
| Facebook Post | 1200×630 | Horizontal, preview crop |
| Facebook Cover | 820×312 | Wide banner, profile overlap |
| Twitter Post | 1200×675 | Preview card dimensions |
| LinkedIn Post | 1200×627 | Professional tone |
| YouTube Thumbnail | 1280×720 | High contrast, readable |
| Pinterest Pin | 1000×1500 | Tall format, scroll-stop |
| TikTok Cover | 1080×1920 | Video placeholder style |
| Amazon Product | 1000×1000 | White background compliance |

---

### Engine 16: 💬 Interactive Creative Chat (Canvas Control)

**Endpoint:** `POST /ai/canvas-control`

**Purpose:** Enables natural language control of the canvas, allowing users to add, modify, delete, and style elements through conversation.

**Input:**
```typescript
{
  prompt: string;           // "Add a red circle in the top right corner"
  canvasState?: object;     // Current canvas JSON for context
}
```

**Supported Commands:**

| Category | Example Commands |
|----------|------------------|
| **Add Elements** | "Add a blue rectangle", "Create a text box saying 'Sale'" |
| **Modify** | "Make the headline bigger", "Change the button color to green" |
| **Position** | "Move the logo to the center", "Align all text to the left" |
| **Delete** | "Remove the background image", "Delete all circles" |
| **Style** | "Make it more minimalist", "Add a drop shadow to the product" |
| **Duplicate** | "Copy this element", "Duplicate the header section" |
| **Group** | "Group these elements", "Ungroup the logo" |

**Output:**
```typescript
{
  message: "I've added a red circle (150px diameter) in the top right corner.",
  commands: [
    {
      action: "add_shape",
      targets: [],
      params: {
        type: "circle",
        fill: "#EF4444",
        radius: 75,
        position: { x: 950, y: 130 }
      }
    }
  ]
}
```

---

### Engine 17: 📏 Safe Zones Overlay

**Purpose:** Displays platform-specific safe zone guides ensuring critical content isn't cropped or obscured on different platforms.

**Safe Zone Rules:**

| Platform | Top | Bottom | Left | Right | Special |
|----------|-----|--------|------|-------|---------|
| Instagram Feed | 5% | 5% | 5% | 5% | - |
| Instagram Story | 250px | 250px | 5% | 5% | Top for username, bottom for buttons |
| Facebook Cover | 20px | 20px | 20px | 20px | Profile picture overlap zone |
| YouTube Thumbnail | 10% | 10% | 10% | 10% | Right side for duration overlay |
| LinkedIn Banner | 10% | 10% | 10% | 10% | Profile picture overlap |

**Visual Indicators:**
- **Green zone:** Completely safe, always visible
- **Yellow zone:** Mostly safe, may crop on some devices
- **Red zone:** Danger, likely to be cropped or obscured

---

### Engine 18: ✂️ AI Background Removal

**Purpose:** Removes backgrounds from images using AI-powered segmentation, enabling easy subject isolation for product images.

**How It Works:**
1. User uploads an image or selects an existing canvas image
2. AI model identifies foreground subject(s)
3. Background pixels are made transparent
4. Processed image replaces original or creates new layer

**Technology:**
- Uses HuggingFace Transformers for browser-based inference
- Model: Xenova/modnet (optimized for web)
- Runs client-side for privacy
- Supports PNG output with alpha channel

**Best Results With:**
- Clear subject/background separation
- Good lighting conditions
- Single dominant subject
- Contrasting colors between subject and background

---

## 💾 Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐         ┌──────────────────┐
│     profiles     │         │     projects     │
├──────────────────┤         ├──────────────────┤
│ id (PK, FK auth) │    ┌───→│ id (PK)          │
│ email            │    │    │ user_id (FK)     │
│ full_name        │    │    │ name             │
│ avatar_url       │    │    │ canvas_data      │
│ created_at       │    │    │ format_id        │
│ updated_at       │    │    │ format_width     │
└──────────────────┘    │    │ format_height    │
         │              │    │ brand_kit_id (FK)│───┐
         │              │    │ compliance_score │   │
         └──────────────┘    │ thumbnail_url    │   │
                             │ created_at       │   │
                             │ updated_at       │   │
                             └──────────────────┘   │
                                                    │
┌──────────────────┐         ┌──────────────────┐   │
│    templates     │         │    brand_kits    │←──┘
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ user_id (FK)     │         │ user_id (FK)     │
│ name             │         │ name             │
│ description      │         │ logo_url         │
│ canvas_data      │         │ primary_color    │
│ category         │         │ secondary_color  │
│ format_width     │         │ accent_color     │
│ format_height    │         │ font_heading     │
│ is_public        │         │ font_body        │
│ thumbnail_url    │         │ guidelines       │
│ created_at       │         │ created_at       │
│ updated_at       │         │ updated_at       │
└──────────────────┘         └──────────────────┘
         │
         │
         ↓
┌──────────────────┐
│template_favorites│
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ template_id (FK) │
│ created_at       │
└──────────────────┘
```

### Table Details

#### `profiles`
Stores user profile information linked to Supabase Auth.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | - | Primary key, matches auth.users.id |
| email | text | Yes | - | User's email address |
| full_name | text | Yes | - | Display name |
| avatar_url | text | Yes | - | Profile picture URL |
| created_at | timestamptz | No | now() | Record creation time |
| updated_at | timestamptz | No | now() | Last update time |

#### `projects`
Stores creative projects with full canvas data.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Owner's user ID |
| name | text | No | 'Untitled Creative' | Project name |
| canvas_data | jsonb | No | '{}' | Fabric.js canvas JSON |
| format_id | text | No | 'instagram-feed' | Format preset ID |
| format_width | integer | No | 1080 | Canvas width in pixels |
| format_height | integer | No | 1080 | Canvas height in pixels |
| brand_kit_id | uuid | Yes | - | Associated brand kit |
| compliance_score | integer | No | 0 | 0-100 compliance rating |
| thumbnail_url | text | Yes | - | Preview thumbnail URL |
| created_at | timestamptz | No | now() | Record creation time |
| updated_at | timestamptz | No | now() | Last update time |

#### `brand_kits`
Stores brand identity configurations.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Owner's user ID |
| name | text | No | - | Brand kit name |
| logo_url | text | Yes | - | Brand logo URL |
| primary_color | text | Yes | '#22C55E' | Primary brand color |
| secondary_color | text | Yes | '#38BDF8' | Secondary brand color |
| accent_color | text | Yes | '#F59E0B' | Accent color |
| font_heading | text | Yes | 'Inter' | Heading font family |
| font_body | text | Yes | 'Inter' | Body font family |
| guidelines | text | Yes | - | Brand usage guidelines |
| created_at | timestamptz | No | now() | Record creation time |
| updated_at | timestamptz | No | now() | Last update time |

#### `templates`
Stores reusable design templates.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | Yes | - | Creator's user ID (null for system templates) |
| name | text | No | - | Template name |
| description | text | Yes | - | Template description |
| canvas_data | jsonb | No | '{}' | Fabric.js canvas JSON |
| category | text | No | 'general' | Template category |
| format_width | integer | No | 1080 | Canvas width |
| format_height | integer | No | 1080 | Canvas height |
| is_public | boolean | No | false | Visibility flag |
| thumbnail_url | text | Yes | - | Preview thumbnail |
| created_at | timestamptz | No | now() | Record creation time |
| updated_at | timestamptz | No | now() | Last update time |

#### `template_favorites`
Stores user's favorite templates.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | User's ID |
| template_id | uuid | No | - | Favorited template ID |
| created_at | timestamptz | No | now() | When favorited |

### Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

**profiles:**
- SELECT: `auth.uid() = id` (view own profile)
- INSERT: `auth.uid() = id` (create own profile)
- UPDATE: `auth.uid() = id` (update own profile)

**projects:**
- SELECT: `auth.uid() = user_id` (view own projects)
- INSERT: `auth.uid() = user_id` (create own projects)
- UPDATE: `auth.uid() = user_id` (update own projects)
- DELETE: `auth.uid() = user_id` (delete own projects)

**brand_kits:**
- SELECT: `auth.uid() = user_id` (view own brand kits)
- INSERT: `auth.uid() = user_id` (create own brand kits)
- UPDATE: `auth.uid() = user_id` (update own brand kits)
- DELETE: `auth.uid() = user_id` (delete own brand kits)

**templates:**
- SELECT: `is_public = true OR auth.uid() = user_id` (view public or own)
- INSERT: `auth.uid() = user_id` (create own templates)
- UPDATE: `auth.uid() = user_id` (update own templates)
- DELETE: `auth.uid() = user_id` (delete own templates)

**template_favorites:**
- SELECT: `auth.uid() = user_id` (view own favorites)
- INSERT: `auth.uid() = user_id` (add favorites)
- DELETE: `auth.uid() = user_id` (remove favorites)

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/signin` | Login with email/password |
| POST | `/auth/signout` | Logout current session |
| GET | `/auth/session` | Get current session |
| POST | `/auth/reset-password` | Request password reset |

### Resource Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List user's projects |
| POST | `/projects` | Create new project |
| GET | `/projects/:id` | Get project by ID |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/brand-kits` | List user's brand kits |
| POST | `/brand-kits` | Create brand kit |
| PUT | `/brand-kits/:id` | Update brand kit |
| DELETE | `/brand-kits/:id` | Delete brand kit |
| GET | `/templates` | List templates |
| POST | `/templates` | Create template |
| PUT | `/templates/:id` | Update template |
| DELETE | `/templates/:id` | Delete template |
| GET | `/templates/favorites` | List favorite templates |
| POST | `/templates/:id/favorite` | Add to favorites |
| DELETE | `/templates/:id/favorite` | Remove from favorites |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/brand-dna` | Extract brand DNA from image |
| POST | `/ai/copywriting` | Generate copy variations |
| POST | `/ai/attention-heatmap` | Generate attention predictions |
| POST | `/ai/performance-predictions` | Predict ad performance |
| POST | `/ai/creative-multiverse` | Generate style variations |
| POST | `/ai/canvas-control` | Natural language canvas control |
| POST | `/ai/emotion-design` | Emotion to design parameters |
| POST | `/ai/trend-forecast` | Get trend predictions |
| POST | `/ai/typography-harmony` | Get font pairing suggestions |
| POST | `/ai/color-psychology` | Get color recommendations |
| POST | `/ai/visual-auditor` | Get design critique |
| POST | `/ai/generate-background` | Generate AI background |
| POST | `/ai/campaign-set` | Generate campaign variations |

### Storage Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/storage/upload` | Upload file to storage |
| GET | `/storage/:bucket/:path` | Get file URL |
| DELETE | `/storage/:bucket/:path` | Delete file |

---

## 🎨 Design System

### Color Palette (HSL Format)

```css
/* Primary Colors */
--primary: 142 76% 36%;              /* Emerald #22C55E */
--primary-foreground: 0 0% 100%;     /* White */

/* Secondary Colors */
--secondary: 199 89% 48%;            /* Sky Blue #38BDF8 */
--secondary-foreground: 0 0% 100%;   /* White */

/* Accent Colors */
--accent: 38 92% 50%;                /* Amber #F59E0B */
--accent-foreground: 0 0% 0%;        /* Black */

/* Background Colors (Dark Mode) */
--background: 0 0% 4%;               /* Near Black #0A0A0B */
--foreground: 0 0% 100%;             /* White */

/* Card Colors */
--card: 0 0% 9%;                     /* Dark Gray #18181B */
--card-foreground: 0 0% 100%;        /* White */

/* Muted Colors */
--muted: 0 0% 15%;                   /* Gray */
--muted-foreground: 0 0% 63%;        /* Light Gray #A1A1AA */

/* Border Colors */
--border: 0 0% 20%;                  /* Border Gray */
--input: 0 0% 20%;                   /* Input Border */
--ring: 142 76% 36%;                 /* Focus Ring (Primary) */

/* Status Colors */
--destructive: 0 84% 60%;            /* Red #EF4444 */
--success: 142 76% 36%;              /* Green #22C55E */
--warning: 38 92% 50%;               /* Amber #F59E0B */
--info: 199 89% 48%;                 /* Blue #38BDF8 */
```

### Typography

```css
/* Font Families */
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing Scale

```css
/* Base: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Circular */
```

### Shadows

```css
/* Card Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Glow Effects */
--glow-primary: 0 0 20px rgb(34 197 94 / 0.3);
--glow-secondary: 0 0 20px rgb(56 189 248 / 0.3);
--glow-accent: 0 0 20px rgb(245 158 11 / 0.3);
```

---

## ✨ Features Overview

### Core Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Design** | 18 specialized AI engines for creative automation |
| **Multi-Format Export** | One-click export to 15+ platform formats |
| **Brand Consistency** | Brand kit management with automatic application |
| **Real-Time Compliance** | Live platform guideline checking |
| **Drag-and-Drop Canvas** | Fabric.js powered professional editor |
| **Template Library** | Pre-built templates for quick starts |
| **Collaboration** | Real-time cursors and sharing (coming soon) |
| **Mobile Responsive** | Full functionality on mobile devices |

### AI Capabilities Summary

| Category | Engines | Key Benefit |
|----------|---------|-------------|
| **Brand Intelligence** | Brand DNA, Color Psychology | Instant brand kit creation |
| **Design Automation** | AutoLayout, Format Transformer | Minutes instead of hours |
| **Creative Generation** | Multiverse, Background Gen | Unlimited variations |
| **Performance Insight** | Heatmap, Predictor | Data-driven decisions |
| **Content Creation** | Copywriting, Campaign Set | Complete campaigns instantly |
| **Quality Assurance** | Compliance, Visual Auditor | Error-free publishing |

---

## ⚙️ Environment Configuration

### Required Variables

```env
# Supabase Configuration (auto-provided by Lovable Cloud)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=your-project-id

# Backend Type (optional)
VITE_BACKEND_TYPE=supabase  # or 'fastapi'
```

### Optional Variables (FastAPI Backend)

```env
# FastAPI Configuration
VITE_FASTAPI_URL=http://localhost:8000

# MongoDB (FastAPI only)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# JWT Secret (FastAPI only)
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## 📜 License

MIT License

Copyright (c) 2025 Creato-Sphere

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Canvas powered by [Fabric.js](http://fabricjs.com)

---

*Generated for Creato-Sphere - AI-Powered Creative Suite*
