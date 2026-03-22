# Dream Pulse — React + Tailwind Components

Production-ready card selection UI with a reusable **DreamPulseCard** and **WorldSelectionSection**.

## Requirements

- React 18+
- Tailwind CSS 3.x (with arbitrary values enabled)
- Font: Inter (add to your app or `tailwind.config`: `fontFamily.sans: ['Inter', ...]`)

## Usage

### Option A: Use the full section

```jsx
import { WorldSelectionSection } from './components';

function App() {
  return (
    <WorldSelectionSection
      onSelectWorld={(id) => console.log('Selected:', id)}
    />
  );
}
```

### Option B: Use the Card only

```jsx
import { DreamPulseCard } from './components';

<DreamPulseCard
  title="JOURNEY"
  imageSrc="/assets/images/mainjourney.png.png"
  imageAlt="Journey"
  isPopular
  onChoose={() => selectWorld('journey')}
/>
```

## Design specs (matched in Tailwind)

- **Layout:** Centered section, min 120px top padding, 3-column grid, 40px gap.
- **Card:** Same width/height (440px), 24px radius, 60% image / 40% content, unified pill button.
- **Journey (hero):** `isPopular` → scale 1.05, spotlight glow, gold badge (MOST POPULAR).
- **Button:** Pill, glass gradient, hover lift + soft glow; label "Choose Experience".
- **Background:** Dark gradient (navy → purple), subtle particles, fade-up on load, hover `translateY(-6px)`.

## Integration with existing app

The main site uses vanilla HTML/CSS in `index.html` and `style.css`. This folder is a React + Tailwind reference. To replace the vanilla world selection with React:

1. Mount a root (e.g. `createRoot(document.getElementById('worldSelectionRoot'))`).
2. Render `<WorldSelectionSection onSelectWorld={selectWorld} />` and call your existing `selectWorld(id)` (map `romantic` → `clearing` if needed).
3. Ensure Tailwind is built and Inter is loaded.
