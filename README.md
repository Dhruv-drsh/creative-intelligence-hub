# 🎨 Creato-Sphere

> **"Figma + Midjourney + Adobe + an Ad Agency — inside one calm, intelligent UI."**

Creato-Sphere is an AI-powered creative suite for generating retailer-compliant, multi-format advertising creatives in minutes.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Canvas | Fabric.js 7 |
| State | Zustand, TanStack Query |
| Backend | Lovable Cloud (Supabase), Edge Functions |
| AI | Lovable AI Gateway (Gemini, GPT-5) |

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with features, AI engines gallery, pricing |
| Auth | `/auth` | Login/signup with email authentication |
| Dashboard | `/dashboard` | Project management, templates, quick actions |
| Builder | `/builder/:id?` | Main canvas editor with AI tools |
| Profile | `/profile` | Account settings, avatar, preferences |

---

## 🤖 18 AI Engines

1. **Brand DNA Extractor** - Analyzes images to extract brand identity
2. **AutoLayout Engine** - Smart element repositioning across formats
3. **Compliance Checker** - Real-time platform compliance validation
4. **Creative Multiverse** - 20+ style variations generation
5. **AI Background Generator** - Professional product backgrounds
6. **Emotion-to-Design** - Translates mood to visual parameters
7. **Visual Auditor** - AI design critique and suggestions
8. **Typography Harmony** - Font pairing recommendations
9. **Color Psychology** - Color analysis based on goals
10. **Attention Heatmap** - Predicts viewer gaze patterns
11. **Performance Predictor** - Forecasts CTR/engagement
12. **Format Transformer** - Intelligent multi-format resizing
13. **Trend Forecast** - Industry trend analysis
14. **AI Copywriting** - 25-30 copy variations per request
15. **Campaign Set Creator** - Hero + channel variations
16. **Interactive Chat** - Natural language canvas control
17. **Safe Zones Overlay** - Platform-specific guides
18. **Background Removal** - AI-powered image segmentation

---

## 💾 Database Tables

- `profiles` - User account info
- `projects` - Creative projects with canvas data
- `brand_kits` - Brand colors, fonts, logos
- `templates` - Reusable design templates
- `template_favorites` - User favorite templates

All tables have RLS policies for user data isolation.

---

## 📡 API Endpoints

**Auth:** `/auth/register`, `/auth/login`, `/auth/me`

**Resources:** `/projects`, `/brand-kits`, `/templates`

**AI:** `/ai/brand-dna`, `/ai/copywriting`, `/ai/attention-heatmap`, `/ai/performance-predictions`, `/ai/creative-multiverse`, `/ai/canvas-control`, `/ai/emotion-design`, `/ai/trend-forecast`, `/ai/typography-harmony`, `/ai/color-psychology`, `/ai/visual-auditor`, `/ai/generate-background`, `/ai/campaign-set`

---

## 🎨 Design System

**Colors (HSL):**
- Primary: Emerald `#22C55E`
- Secondary: Sky `#38BDF8`
- Accent: Amber `#F59E0B`
- Background: `#0A0A0B` (dark)

**Typography:** Inter (headings + body)

---

## 📜 License

MIT License

---

Built with ❤️ using [Lovable](https://lovable.dev)
