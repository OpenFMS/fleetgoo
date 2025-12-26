---
description: Generate a standardized solution page JSON based on user inputs and knowledge base.
---

# Generate Solution Page Workflow (SEO, Context & UI Optimized)

This workflow guides the AI to generate a comprehensive Solution Detail Page (JSON) by meticulously combining user requirements with the internal Product Knowledge Base, while optimizing for SEO, specific usage contexts, and UI layout balance.

## Step 1: Gather Requirements
Ask the user for the following information if not already provided:
1.  **Solution Name & Region**: (e.g., Cold Chain Logistics in Thailand, Mining Safety in Australia)
2.  **Target Audience**: (e.g., Fleet Managers, Compliance Officers)
3.  **URL Slug**: (e.g., `cold-chain-thailand`)
4.  **Top Pain Points**: Initial list from user.
5.  **Featured Hardware**: Device models to highlight (e.g., `D501`, `C08W`).

## Step 2: Retrieve Knowledge
1.  Read the **Platform Knowledge Base**: `public/knowledge/FleetGoo-Platform.txt`
2.  Read the **Hardware Knowledge Base** for requested models: `public/knowledge/[Model_Name].txt`

## Step 3: SEO Strategy Formulation
Before generating content, formulate an SEO strategy internally:
1.  **Primary Keywords**: Combine Industry + Region + "Fleet Management" (e.g., "Thailand Cold Chain Fleet Management").
2.  **Secondary Keywords**: Specific pain points.
3.  **Meta Strategy**: Ensure `metaTitle` and `metaDesc` are front-loaded with these keywords.

## Step 3.5: "Human-Touch" Writing Protocol
**CRITICAL**: Apply these rules to eliminate "AI-like" tone:
1.  **Ban Hollow Adjectives**: Do NOT use words like *seamless, revolutionary, cutting-edge, state-of-the-art, comprehensive landscape*.
2.  **Focus on "Why", not "What"**:
    *   *Bad*: "The D501 features dual 1080P cameras."
    *   *Good*: "See exactly what happened before the accident with dual 1080P evidence."
3.  **Be Blunt & Direct**: Speak directly to the Fleet Manager's fears (theft, accidents, lawsuits). Use short, punchy sentences.
4.  **No "Adjective Stacking"**: Avoid "efficient, reliable, and robust solution". Pick one specific benefit and explain it.

## Step 4: Generate Content (JSON Structure)
Construct a JSON object with the following blocks. **Ensure strict adherence to the existing schema.**

### 1. Metadata
- `id`: The provided slug.
- `categoryId`: "industry"
- `title`: "[Solution Name] Solution"
- `metaTitle`: "[Primary Keyword] | FleetGoo Solutions".
- `metaDesc`: 150-160 char summary.

### 2. Blocks
-   **Hero Block (`hero`)**:
    -   Title: Action-oriented header containing Primary Keywords.
    -   Subtitle: Address the main outcome/benefit directly.
    -   Image: Choose/generate a relevant image path.

-   **Pain Points Block (`pain_points`)**:
    -   **UI Rule**: Must generate exactly **6 items** (preferred) or **4 items** to maintain 3-column grid balance.
    -   **Context Rule**:
        1.  Start with user-provided pain points.
        2.  If user provided fewer than 6, **infer additional relevant pain points** based on the industry/region to reach 6 items.
        3.  Describe each specifically in the user's industry context.

-   **Architecture/Media (`media`)**:
    -   Show a high-level architecture diagram or relevant industry image.

-   **Core Capabilities (`features` - grid layout)**:
    -   **UI Rule**: Must generate exactly **6 items** (preferred) or **9 items** to maintain 3-column grid balance.
    -   Select relevant SaaS features from `FleetGoo-Platform.txt`.
    -   **Context Rule**: Rewrite generic descriptions to explain *how* it solves specific pain points.

-   **Impact Stats (`stats`)**:
    -   Generate 4 plausible metrics (e.g., ROI, Efficiency, Compliance).

-   **Hardware Highlights (`features` - alternating layout)**:
    -   For each selected hardware model, create a feature item.
    -   **Title**: The specific hardware capability.
    -   **Desc**: Blend technical specs with application benefits ([Spec] enabling [Benefit]).
    -   **Image**: Use `/images/products/[Model]-main.jpg`.

-   **Recommended Hardware (`product_list`)**:
    -   List the IDs of the selected products.

-   **CTA (`cta`)**:
    -   Title: "Ready to optimize your [Industry] fleet?"
    -   Button: "Get a Quote"

## Step 5: Write File
Write the generated JSON to: `public/data/en/solutions/[slug].json`

## Step 6: Update Solutions Index
Add the new solution entry to `public/data/en/solutions.json` with a compelling summary.

## Step 7: Localization Sync
// turbo
Run the i18n tool to sync the structure to other languages:
```bash
node tools/i18n-sync.cjs
```

## Step 8: Final Verification
Ask the user to review the generated page at `http://localhost:5173/en/solutions/[slug]`.
