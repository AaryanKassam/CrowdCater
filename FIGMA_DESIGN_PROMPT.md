# Figma Design Prompt for CrowdCater

## App Overview
**CrowdCater** is an AI-powered catering recommendation web application that helps users find the perfect catering solutions for their events. The app combines intelligent AI suggestions with Google Maps integration to provide a seamless experience for event planning.

## Brand Identity
- **App Name**: CrowdCater
- **Tagline**: "Quickly Find The Perfect Catering Solutions For Your Event"
- **Tone**: Professional, friendly, modern, trustworthy
- **Target Audience**: Event planners, individuals organizing corporate events, weddings, parties, and social gatherings

## Color Palette
- **Primary Color**: Blue (#0284c7 / primary-600)
- **Primary Shades**: 
  - Light: #f0f9ff (primary-50)
  - Medium: #0ea5e9 (primary-500)
  - Dark: #0369a1 (primary-700)
- **Background**: Gradient from blue-50 via white to purple-50
- **Text**: Gray-900 for headings, Gray-600-700 for body text
- **Accents**: Yellow-500 for ratings, Green-600 for call-to-action buttons
- **Neutrals**: White cards, Gray-100-200 for borders and backgrounds

## Typography
- **Headings**: Bold, large (text-5xl for main title, text-2xl-3xl for section headers)
- **Body Text**: Medium weight, readable sizes (text-sm to text-base)
- **Font Style**: Modern, clean sans-serif (system fonts or similar)

## Design Style
- **Aesthetic**: Modern, clean, minimalist with subtle shadows and rounded corners
- **Card Design**: White cards with rounded-2xl corners, shadow-xl, hover effects
- **Spacing**: Generous padding (p-6 to p-8), comfortable gaps between elements
- **Borders**: Subtle gray borders (border-gray-200-300)
- **Shadows**: Soft shadows (shadow-lg, shadow-xl) for depth
- **Transitions**: Smooth hover transitions and color changes

## Key Screens & Components

### 1. Landing Page / Main Screen
**Layout**:
- Centered container with max-width (max-w-4xl)
- Hero section at top with:
  - Large, bold app title "CrowdCater" (text-5xl)
  - Subtitle tagline below
- Gradient background (blue-50 to white to purple-50)
- Main content area with form and results

### 2. Event Details Form Component
**Design Elements**:
- White card with rounded-2xl corners, shadow-xl, padding p-8
- Section title: "Event Details" (text-2xl, bold, gray-900)
- Form fields in vertical stack (space-y-6)

**Form Fields**:
1. **Number of Attendees**
   - Label: "Number of Attendees" (text-sm, font-medium, gray-700)
   - Input: Number type, full width, rounded-lg, border-gray-300
   - Focus state: ring-2, ring-primary-500

2. **Event Type**
   - Label: "Event Type"
   - Input: Text type with placeholder "e.g., Wedding, Corporate Meeting, Birthday Party"
   - Triggers AI recommendations on input

3. **AI Food Recommendations Section** (Conditional)
   - Appears when event type is entered
   - Light blue background (primary-50), border (primary-200)
   - Title: "Quick Select:" (text-sm, font-medium, primary-900)
   - Pill-shaped buttons in flex wrap layout
   - Selected state: primary-600 background, white text
   - Unselected: white background, primary-700 text, primary-300 border

4. **Food Type Input**
   - Label: "Food Type (or select from AI recommendations above)"
   - Text input with placeholder "e.g., Italian, BBQ, Vegetarian"

5. **Budget Section**
   - Label: "Budget"
   - Flex layout with number input and dropdown
   - Input: flex-1, number type
   - Dropdown: Select for "Total" or "Per Person"

6. **Location Section**
   - Label: "Location"
   - Flex layout with text input and button
   - Input: flex-1, placeholder "Enter city, address, or zip code"
   - Button: "📍 Use My Location" with toggle state
   - Active state: primary-600 background, white text
   - Inactive: white background, gray text, gray border

7. **Submit Button**
   - Full width, primary-600 background, white text
   - Rounded-lg, padding py-3
   - Hover: primary-700
   - Disabled: gray-400 background
   - Text: "Find Catering Options" or "Searching..." when loading

**Error Display**:
- Red/error colored alert component
- Dismissible with X button
- Appears above form fields

### 3. Restaurant Results Component
**Layout**:
- Section title: "Catering Options (X)" where X is count
- Grid layout: 2 columns on medium+ screens, 1 column on mobile
- Gap-6 between cards

**Restaurant Card Design**:
- White background, rounded-xl, shadow-lg
- Hover: shadow-xl transition
- Multiple sections with borders between:

**Card Header Section** (p-6, border-b):
- Restaurant name: text-xl, bold, gray-900, flex-1
- Expand/Collapse button: primary-600, hover primary-700, text-sm
- Rating display: Star emoji (⭐), rating number, price level ($ symbols)
- Address: text-sm, gray-600
- Distance: text-sm, primary-600, with 📍 emoji

**Contact Information Section** (p-6, space-y-3, border-b):
- Phone: 📞 emoji, primary-600 link, clickable tel: link
- Website: 🌐 emoji, primary-600 link, opens in new tab

**Expanded Content Section** (p-6, space-y-6, border-b) - Only visible when expanded:
- **Menu Images**:
  - Title: "📋 Images:" (text-sm, font-semibold, gray-700)
  - Grid: 2 columns, gap-3
  - Images: aspect-video, rounded-lg, object-cover
  - Fallback: gray-100 background if image fails

- **Highlights Section**:
  - Title: "Highlights:" (text-sm, font-semibold, gray-700)
  - Loading state: Spinner animation, "Generating highlights..." text
  - Content: Cards with gray-50 background, border-gray-200, rounded-lg, padding p-4
  - Each highlight: Name (font-semibold, gray-900), Description (text-sm, gray-700)
  - Empty state: "No highlights available..." (text-sm, gray-500)

**Action Button** (p-6, pt-0):
- "📞 Generate Call Script" button
- Full width, primary-600 background, white text
- Rounded-lg, hover: primary-700

### 4. Call Script Modal
**Design**:
- Full screen overlay: black background with 50% opacity
- Centered modal: white background, rounded-2xl, shadow-2xl
- Max width: 2xl, max height: 90vh, scrollable
- Sticky header with border-bottom

**Modal Header** (sticky, bg-white, border-b, p-6):
- Title: "Call Script for [Restaurant Name]" (text-2xl, bold, gray-900)
- Close button: × symbol, gray-500, hover gray-700, text-2xl

**Modal Content** (p-6):
- Loading state: Centered spinner, "Generating call script..." text
- Script display: Gray-50 background, rounded-lg, padding p-4, whitespace-pre-wrap
- Action buttons (when script loaded):
  - "📋 Copy Script": primary-600, full width (flex-1)
  - "📞 Call Now": green-600, full width (flex-1), tel: link
  - Flex layout with gap-3

## Interactive States

### Buttons
- **Default**: Primary color background, white text
- **Hover**: Darker shade (primary-700)
- **Active**: Slightly darker
- **Disabled**: Gray-400 background, not-allowed cursor
- **Loading**: Spinner animation, disabled state

### Inputs
- **Default**: White background, gray-300 border
- **Focus**: Ring-2, ring-primary-500, border-transparent
- **Error**: Red border (if applicable)
- **Placeholder**: Gray-400 text

### Cards
- **Default**: White, shadow-lg
- **Hover**: shadow-xl, subtle scale or elevation
- **Expanded**: Additional content revealed with smooth transition

## Responsive Design
- **Mobile**: Single column layout, full width cards, stacked form elements
- **Tablet**: 2-column grid for restaurant cards, form remains single column
- **Desktop**: 2-column grid, max-width container, comfortable spacing

## Micro-interactions
- Smooth transitions on hover (0.2-0.3s)
- Loading spinners for async operations
- Expand/collapse animations for restaurant cards
- Modal fade-in/out animations
- Button press feedback
- Copy to clipboard confirmation (toast or alert)

## Accessibility Considerations
- High contrast text (gray-900 on white)
- Clear focus states with visible rings
- Semantic HTML structure
- Alt text for images
- Keyboard navigation support
- Screen reader friendly labels

## Design Inspiration Keywords
Modern, clean, professional, trustworthy, friendly, intuitive, efficient, elegant, minimal, sophisticated

## Additional Notes
- Use emojis sparingly but effectively (📍, 📞, 🌐, ⭐, 📋)
- Maintain consistent spacing using 4px or 8px grid
- Ensure touch targets are at least 44x44px for mobile
- Use subtle animations to enhance UX without being distracting
- Keep the design focused on the primary goal: finding catering options quickly

---

**Use this prompt with Figma's AI design tools or share with a designer to create a complete, polished interface design system for CrowdCater.**

