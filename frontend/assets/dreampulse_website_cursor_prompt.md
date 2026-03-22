# DREAMPULSE WEBSITE: CURSOR AI PROMPT
## Visually Stunning Design Inspired by davidlangarica.dev

---

## 🎯 PROJECT OVERVIEW

Create a visually captivating, interactive website for DreamPulse - an AI-driven lucid dreaming and sleep optimization app. The design should match the creative excellence and technical sophistication of davidlangarica.dev while adapting its aesthetic to the dream/sleep/mystical theme.

---

## 🌟 DESIGN PHILOSOPHY (Adapted from Reference Site)

### From David's Site:
✅ Playful, creative energy with professional polish
✅ Smooth animations and micro-interactions
✅ 3D elements and depth
✅ Personal, human touch
✅ "Magic" moments that surprise and delight
✅ Story-driven layout (narrative flow)

### Adapted for DreamPulse:
✅ Ethereal, dreamlike atmosphere (mystical not playful)
✅ Smooth, hypnotic animations (sleep-inducing not energetic)
✅ Cosmic 3D elements (stars, nebulae, floating particles)
✅ Intimate, contemplative tone (bedtime story narrator)
✅ "Dream state" moments (surreal transitions)
✅ Journey-driven layout (awake → sleep → dream → awakening)

---

## 🎨 COMPLETE VISUAL DESIGN SYSTEM

### Color Palette (Dream-Themed)

**Primary Colors:**
```css
--deep-indigo: #1a1a3e;        /* Night sky, main background */
--royal-purple: #6b5b95;       /* Twilight, secondary backgrounds */
--lavender: #9d84b7;           /* Mystical accent */
--soft-gold: #d4af37;          /* Dream glow, highlights */
--midnight-blue: #0d0d1f;      /* Deep sections */
```

**Accent Colors:**
```css
--teal-glow: #2d8b88;          /* Interactive elements */
--rose-quartz: #f7cad0;        /* Warm accents */
--cosmic-purple: #b19cd9;      /* Gradient overlays */
--stardust: #fff9e6;           /* Text highlights */
```

**Functional Colors:**
```css
--text-primary: #f5f1e8;       /* Main text (cream) */
--text-secondary: #c5bfb3;     /* Secondary text */
--text-muted: #8a8580;         /* Muted text */
--background-dark: #0a0a14;    /* Darkest background */
--glass-bg: rgba(255,255,255,0.05);  /* Glassmorphism */
```

### Typography System

**Font Families:**
```css
/* Display/Headers - Elegant Serif */
--font-display: 'Playfair Display', 'Cormorant Garamond', serif;

/* Body - Clean Sans-Serif */
--font-body: 'Inter', 'Manrope', sans-serif;

/* Accent - Mystical Touch */
--font-accent: 'Cinzel', 'Philosopher', serif;

/* Mono - Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Type Scale:**
```css
--text-xs: 0.75rem;    /* 12px - Captions */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - Subheadings */
--text-2xl: 1.5rem;    /* 24px - H3 */
--text-3xl: 1.875rem;  /* 30px - H2 */
--text-4xl: 2.25rem;   /* 36px - H1 */
--text-5xl: 3rem;      /* 48px - Hero */
--text-6xl: 3.75rem;   /* 60px - Mega hero */
--text-7xl: 4.5rem;    /* 72px - Display */
```

**Font Weights:**
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 8rem;     /* 128px */
--space-20: 10rem;    /* 160px */
```

---

## 📐 SECTION-BY-SECTION BREAKDOWN

### 1. HERO SECTION (Inspired by David's Landing)

**David's Approach:**
- Full viewport height
- Large animated text
- Scroll indicator
- Personal, human touch

**DreamPulse Adaptation:**

```jsx
<section className="hero">
  {/* 3D Starfield Background (Three.js) */}
  <Canvas className="hero-canvas">
    <StarfieldBackground particleCount={3000} />
    <FloatingNebula />
  </Canvas>

  {/* Content Overlay */}
  <div className="hero-content">
    {/* Animated Logo */}
    <div className="logo-container">
      <Logo className="animated-logo" />
      <div className="pulse-ring" /> {/* Subtle pulse animation */}
    </div>

    {/* Main Headline - Animated Text Reveal */}
    <h1 className="hero-title">
      <span className="line">Where Dreams</span>
      <span className="line gradient-text">Come Alive</span>
    </h1>

    {/* Subheadline with Typewriter Effect */}
    <p className="hero-subtitle">
      Experience cinematic journeys crafted by AI.
      <br />
      Wake up remembering <span className="highlight">vivid dreams</span>.
      <br />
      Train your mind for <span className="shimmer">lucid awareness</span>.
    </p>

    {/* CTA Buttons */}
    <div className="hero-cta">
      <button className="btn-primary glow-effect">
        Begin Your Journey
        <span className="btn-icon">→</span>
      </button>
      <button className="btn-secondary glass-effect">
        Watch Demo
        <span className="btn-icon">▶</span>
      </button>
    </div>

    {/* Scroll Indicator (like David's) */}
    <div className="scroll-indicator">
      <span className="scroll-text">Scroll to explore</span>
      <div className="scroll-arrow bounce">
        <svg>↓</svg>
      </div>
    </div>
  </div>

  {/* Floating Elements */}
  <div className="floating-particles">
    {/* Fireflies/stardust animated particles */}
  </div>
</section>
```

**Visual Effects:**
- Parallax scrolling (background slower than foreground)
- Text reveal animation on load (words appear sequentially)
- Gradient text with shimmer effect
- 3D starfield with mouse movement interaction
- Subtle pulse on logo
- Floating particles (fireflies/stardust)
- Glass morphism on buttons

**Technical Implementation:**
```css
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at center,
    var(--royal-purple) 0%,
    var(--deep-indigo) 50%,
    var(--midnight-blue) 100%
  );
}

.gradient-text {
  background: linear-gradient(
    135deg,
    var(--soft-gold) 0%,
    var(--lavender) 50%,
    var(--teal-glow) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.glow-effect {
  box-shadow: 
    0 0 20px rgba(212, 175, 55, 0.3),
    0 0 40px rgba(212, 175, 55, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glow-effect:hover {
  box-shadow: 
    0 0 30px rgba(212, 175, 55, 0.5),
    0 0 60px rgba(212, 175, 55, 0.2),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

---

### 2. ABOUT/INTRODUCTION SECTION

**David's Approach:**
- "Hey! I'm David" - personal introduction
- Photo with animated elements
- Currently playing music widget (personality)
- Expressive text animations

**DreamPulse Adaptation:**

```jsx
<section className="about">
  <div className="container">
    <div className="about-grid">
      {/* Left: Visual Element */}
      <div className="about-visual">
        {/* 3D Rendered Dream Scene */}
        <div className="dream-visualization">
          <Canvas>
            <DreamSceneModel /> {/* Abstract 3D brain/cosmos hybrid */}
          </Canvas>
        </div>

        {/* Stat Cards (Glassmorphism) */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <span className="stat-number">300M+</span>
            <span className="stat-label">Sleep Seekers in India</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-number">43%</span>
            <span className="stat-label">Report Lucid Dreams</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-number">600+</span>
            <span className="stat-label">Beta Dreamers</span>
          </div>
        </div>
      </div>

      {/* Right: Text Content */}
      <div className="about-content">
        <h2 className="section-title">
          <span className="text-line">The sleep crisis</span>
          <span className="text-line">is real...</span>
        </h2>

        <div className="text-reveal">
          <p className="body-large">
            Over 300 million people in India alone suffer from 
            sleep disorders. But even when they sleep, 
            <span className="highlight"> their dreams remain 
            unengaging</span> — fleeting, forgotten, disconnected.
          </p>

          <p className="body-large">
            What if sleep could be <span className="shimmer">transformative</span>? 
            What if your dreams became <span className="gradient-text">epic 
            journeys</span> you remember and control?
          </p>

          <p className="body-large">
            DreamPulse combines AI-driven storytelling with proven 
            neuroscience to create the world's most immersive sleep 
            experience. Not just tracking. Not just meditation. 
            <span className="bold"> Cinematic dreams.</span>
          </p>
        </div>

        {/* Animated Feature List */}
        <ul className="feature-list">
          <li className="feature-item">
            <div className="feature-icon">✨</div>
            <div>
              <h4>AI-Crafted Narratives</h4>
              <p>Every night is a new adventure</p>
            </div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">🧠</div>
            <div>
              <h4>Science-Backed Techniques</h4>
              <p>MILD, REM detection, reality anchors</p>
            </div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">🌙</div>
            <div>
              <h4>Lucid Dreaming Training</h4>
              <p>40-60% success rate in trials</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  {/* Background Accent */}
  <div className="section-bg-accent">
    <div className="gradient-orb orb-1"></div>
    <div className="gradient-orb orb-2"></div>
  </div>
</section>
```

**Animations:**
- Text reveal on scroll (fade in + slide up)
- Stats count up animation when visible
- 3D model slow rotation
- Gradient orbs float and pulse
- Feature list items stagger in

---

### 3. HOW IT WORKS SECTION

**David's Approach:**
- Process/work showcase
- Project cards with hover effects
- Clean grid layout

**DreamPulse Adaptation:**

```jsx
<section className="how-it-works">
  <div className="container">
    {/* Section Header */}
    <div className="section-header center">
      <h2 className="mega-title">
        <span className="line">Your Journey</span>
        <span className="line gradient-text">Into the Dream</span>
      </h2>
      <p className="section-subtitle">
        From wide awake to lucid awareness in 4 phases
      </p>
    </div>

    {/* Journey Timeline (Vertical on Desktop, Horizontal Scroll on Mobile) */}
    <div className="journey-timeline">
      
      {/* Phase 1 */}
      <div className="phase-card" data-phase="1">
        <div className="phase-visual">
          {/* Lottie animation: Person lying down */}
          <LottieAnimation src="phase1-relax.json" />
        </div>
        <div className="phase-content">
          <span className="phase-number">01</span>
          <h3 className="phase-title">Choose Your World</h3>
          <p className="phase-description">
            Journey, Sanctuary, Exploration, or The Clearing. 
            Each mode offers unique cinematic narratives designed 
            to guide you into restful sleep.
          </p>
          <ul className="phase-features">
            <li>10+ story worlds</li>
            <li>25-45 minute sessions</li>
            <li>Personalized pacing</li>
          </ul>
        </div>
        <div className="phase-connector"></div>
      </div>

      {/* Phase 2 */}
      <div className="phase-card" data-phase="2">
        <div className="phase-visual">
          <LottieAnimation src="phase2-sleep.json" />
        </div>
        <div className="phase-content">
          <span className="phase-number">02</span>
          <h3 className="phase-title">Let the Story Guide You</h3>
          <p className="phase-description">
            Immersive second-person narration combined with adaptive 
            soundscapes and binaural beats ease you from wakefulness 
            into deep, restorative sleep.
          </p>
          <ul className="phase-features">
            <li>MILD technique integration</li>
            <li>Progressive muscle relaxation</li>
            <li>Gradual music fade</li>
          </ul>
        </div>
        <div className="phase-connector"></div>
      </div>

      {/* Phase 3 */}
      <div className="phase-card" data-phase="3">
        <div className="phase-visual">
          <LottieAnimation src="phase3-rem.json" />
        </div>
        <div className="phase-content">
          <span className="phase-number">03</span>
          <h3 className="phase-title">REM Detection & Cues</h3>
          <p className="phase-description">
            Our AI monitors your sleep cycles using smartphone sensors 
            or wearable integration, triggering gentle audio cues during 
            REM sleep to spark lucid awareness.
          </p>
          <ul className="phase-features">
            <li>Smart REM timing (4.5-7 hrs)</li>
            <li>Whisper-quiet audio anchors</li>
            <li>Wearable sync (Apple Watch, Fitbit)</li>
          </ul>
        </div>
        <div className="phase-connector"></div>
      </div>

      {/* Phase 4 */}
      <div className="phase-card" data-phase="4">
        <div className="phase-visual">
          <LottieAnimation src="phase4-wake.json" />
        </div>
        <div className="phase-content">
          <span className="phase-number">04</span>
          <h3 className="phase-title">Wake Remembering</h3>
          <p className="phase-description">
            Morning prompts guide dream recall. Log your journey, 
            track lucidity patterns, and watch your dream awareness 
            grow with each session.
          </p>
          <ul className="phase-features">
            <li>AI dream interpretation</li>
            <li>Lucidity tracking & streaks</li>
            <li>Community sharing</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  {/* Parallax Background Element */}
  <div className="parallax-bg">
    <img src="/images/dream-nebula.png" alt="" className="layer-1" />
    <img src="/images/stars.png" alt="" className="layer-2" />
  </div>
</section>
```

**Interaction Design:**
- Timeline cards fade in on scroll (stagger animation)
- Hover on card → subtle glow + lift effect
- Connecting line animates as user scrolls
- Lottie animations play when card enters viewport
- Phase numbers pulse gently

---

### 4. FEATURES SHOWCASE (Interactive)

**David's Approach:**
- Work samples with hover previews
- Clean grid of projects
- Smooth transitions

**DreamPulse Adaptation:**

```jsx
<section className="features">
  <div className="container-wide">
    
    <div className="section-header center">
      <h2 className="mega-title">
        <span className="line">Not Just Sleep Tracking.</span>
        <span className="line gradient-text">Dream Experiences.</span>
      </h2>
    </div>

    {/* Feature Grid with Bento Box Layout */}
    <div className="bento-grid">
      
      {/* Large Feature: Cinematic Stories */}
      <div className="bento-item large glass-card">
        <div className="feature-media">
          <video autoPlay muted loop playsInline>
            <source src="/videos/story-preview.mp4" type="video/mp4" />
          </video>
          <div className="media-overlay gradient-overlay"></div>
        </div>
        <div className="feature-content">
          <h3 className="feature-title">Cinematic Story Worlds</h3>
          <p className="feature-description">
            Not generic affirmations. Epic narratives that transport 
            you to mystical deserts, ancient temples, underwater realms, 
            and enchanted forests.
          </p>
          <button className="btn-link">
            Explore Worlds →
          </button>
        </div>
      </div>

      {/* Medium Feature: AI Personalization */}
      <div className="bento-item medium glass-card">
        <div className="feature-icon-large">🎨</div>
        <h3 className="feature-title">AI Adaptation</h3>
        <p className="feature-description">
          Stories evolve based on your preferences, sleep patterns, 
          and dream journal entries.
        </p>
      </div>

      {/* Medium Feature: Lucid Training */}
      <div className="bento-item medium glass-card">
        <div className="feature-icon-large">✨</div>
        <h3 className="feature-title">Lucid Dream Training</h3>
        <p className="feature-description">
          MILD technique, reality anchors, and REM-timed cues proven 
          to increase lucidity by 40-60%.
        </p>
      </div>

      {/* Small Feature: Streak System */}
      <div className="bento-item small glass-card">
        <div className="stat-display">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">7</span>
        </div>
        <p className="feature-label">Day Streak System</p>
      </div>

      {/* Small Feature: Dream Journal */}
      <div className="bento-item small glass-card">
        <div className="stat-display">
          <span className="stat-icon">📖</span>
          <span className="stat-value">∞</span>
        </div>
        <p className="feature-label">AI Dream Journal</p>
      </div>

      {/* Large Feature: Community */}
      <div className="bento-item large glass-card">
        <div className="feature-media">
          <div className="community-preview">
            {/* Animated user avatars floating */}
            <div className="avatar-cluster">
              {[...Array(12)].map((_, i) => (
                <img 
                  key={i} 
                  src={`/avatars/user-${i}.jpg`} 
                  className="floating-avatar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="feature-content">
          <h3 className="feature-title">Dream Together</h3>
          <p className="feature-description">
            Share your journeys, discover what others are dreaming, 
            and build a community of lucid explorers.
          </p>
          <div className="community-stats">
            <span className="stat">12.3k Dreamers</span>
            <span className="stat">43k Dreams Logged</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

**Visual Effects:**
- Bento grid with CSS Grid (responsive masonry layout)
- Glassmorphism on all cards
- Hover effects:
  - Card lifts (translateY: -8px)
  - Glow intensifies
  - Video previews play on hover
- Stagger animation on scroll
- Floating avatars with subtle parallax

---

### 5. SOCIAL PROOF / TESTIMONIALS

**David's Approach:**
- Clean, minimalist approach
- Focus on quality over quantity

**DreamPulse Adaptation:**

```jsx
<section className="testimonials">
  <div className="container">
    
    <div className="section-header center">
      <h2 className="section-title">
        <span className="line">Dreamers</span>
        <span className="line gradient-text">Love Us</span>
      </h2>
      <p className="section-subtitle">
        Real experiences from our beta community
      </p>
    </div>

    {/* Testimonial Carousel */}
    <div className="testimonial-carousel">
      
      <div className="testimonial-card glass-card">
        <div className="testimonial-header">
          <img 
            src="/avatars/user-1.jpg" 
            className="avatar" 
            alt="Priya S."
          />
          <div className="user-info">
            <h4 className="user-name">Priya S.</h4>
            <p className="user-role">Student, Mumbai</p>
            <div className="rating">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
        <blockquote className="testimonial-quote">
          "I've struggled with insomnia for years. DreamPulse not only 
          helped me fall asleep faster, but I had my first lucid dream 
          after just 2 weeks! The Journey mode is absolutely magical."
        </blockquote>
        <div className="testimonial-footer">
          <span className="badge">✨ First Lucid Dream</span>
          <span className="date">14 days</span>
        </div>
      </div>

      {/* Additional testimonial cards... */}
      
    </div>

    {/* Stats Bar */}
    <div className="stats-bar glass">
      <div className="stat">
        <span className="stat-value">4.9</span>
        <span className="stat-label">Average Rating</span>
      </div>
      <div className="stat">
        <span className="stat-value">87%</span>
        <span className="stat-label">Improved Sleep Quality</span>
      </div>
      <div className="stat">
        <span className="stat-value">43%</span>
        <span className="stat-label">Reported Lucid Dreams</span>
      </div>
      <div className="stat">
        <span className="stat-value">72%</span>
        <span className="stat-label">7-Day Retention</span>
      </div>
    </div>

  </div>
</section>
```

---

### 6. PRICING SECTION

```jsx
<section className="pricing">
  <div className="container">
    
    <div className="section-header center">
      <h2 className="mega-title">
        <span className="line">Start Dreaming</span>
        <span className="line gradient-text">Tonight</span>
      </h2>
      <p className="section-subtitle">
        Choose your path to better sleep and vivid dreams
      </p>
    </div>

    {/* Pricing Cards */}
    <div className="pricing-grid">
      
      {/* Free Tier */}
      <div className="pricing-card glass-card">
        <div className="plan-badge">Free</div>
        <h3 className="plan-name">Dream Explorer</h3>
        <div className="plan-price">
          <span className="currency">₹</span>
          <span className="amount">0</span>
          <span className="period">/forever</span>
        </div>
        <ul className="plan-features">
          <li className="included">3 story worlds</li>
          <li className="included">10-minute sessions</li>
          <li className="included">Basic sleep timer</li>
          <li className="included">Dream journal</li>
          <li className="excluded">Full story library</li>
          <li className="excluded">REM cues</li>
          <li className="excluded">AI insights</li>
        </ul>
        <button className="btn-secondary">
          Start Free
        </button>
      </div>

      {/* Premium Monthly */}
      <div className="pricing-card glass-card featured">
        <div className="plan-badge premium">Most Popular</div>
        <h3 className="plan-name">Dream Master</h3>
        <div className="plan-price">
          <span className="currency">₹</span>
          <span className="amount">299</span>
          <span className="period">/month</span>
        </div>
        <ul className="plan-features">
          <li className="included">20+ story worlds</li>
          <li className="included">45-minute deep sessions</li>
          <li className="included">REM detection & cues</li>
          <li className="included">AI dream analysis</li>
          <li className="included">Advanced personalization</li>
          <li className="included">Community access</li>
          <li className="included">Priority support</li>
        </ul>
        <button className="btn-primary glow-effect">
          Start 7-Day Free Trial
        </button>
      </div>

      {/* Premium Annual */}
      <div className="pricing-card glass-card">
        <div className="plan-badge annual">Best Value</div>
        <h3 className="plan-name">Dream Architect</h3>
        <div className="plan-price">
          <span className="currency">₹</span>
          <span className="amount">2,499</span>
          <span className="period">/year</span>
        </div>
        <div className="savings-badge">
          Save 30% ✨
        </div>
        <ul className="plan-features">
          <li className="included">Everything in Dream Master</li>
          <li className="included">Exclusive premium journeys</li>
          <li className="included">Early access to new features</li>
          <li className="included">1-on-1 dream coaching session</li>
          <li className="included">Lifetime updates</li>
        </ul>
        <button className="btn-secondary">
          Get Started
        </button>
      </div>

    </div>

    {/* Money-Back Guarantee */}
    <div className="guarantee-banner glass">
      <div className="guarantee-icon">🛡️</div>
      <div className="guarantee-content">
        <h4>30-Day Money-Back Guarantee</h4>
        <p>
          Not experiencing better sleep? We'll refund you. No questions asked.
        </p>
      </div>
    </div>

  </div>
</section>
```

---

### 7. CTA SECTION (Like David's Contact)

**David's Approach:**
- "Don't be a stranger"
- Email with copy button
- Booking call option
- Friendly, inviting tone

**DreamPulse Adaptation:**

```jsx
<section className="cta">
  <div className="container">
    
    {/* Main CTA Content */}
    <div className="cta-content center">
      <h2 className="mega-title">
        <span className="line">Ready to Transform</span>
        <span className="line gradient-text">Your Nights?</span>
      </h2>
      
      <p className="cta-subtitle">
        Join 12,000+ dreamers who've discovered the magic of 
        cinematic sleep experiences.
      </p>

      {/* Email Signup */}
      <div className="email-capture glass-card">
        <input 
          type="email" 
          placeholder="Enter your email"
          className="email-input"
        />
        <button className="btn-primary glow-effect">
          Start Free Trial
          <span className="btn-icon">→</span>
        </button>
      </div>

      <p className="fine-print">
        No credit card required. 7-day trial on premium features.
      </p>

      {/* Secondary CTAs */}
      <div className="cta-secondary">
        <button className="btn-link">
          Watch Demo Video
          <span className="btn-icon">▶</span>
        </button>
        <span className="divider">or</span>
        <button className="btn-link">
          Read the Science
          <span className="btn-icon">📖</span>
        </button>
      </div>
    </div>

    {/* Trust Indicators */}
    <div className="trust-indicators">
      <div className="trust-item">
        <span className="trust-icon">🔒</span>
        <span className="trust-text">Secure & Private</span>
      </div>
      <div className="trust-item">
        <span className="trust-icon">📱</span>
        <span className="trust-text">iOS & Android</span>
      </div>
      <div className="trust-item">
        <span className="trust-icon">⭐</span>
        <span className="trust-text">4.9/5 Rating</span>
      </div>
      <div className="trust-item">
        <span className="trust-icon">🧠</span>
        <span className="trust-text">Science-Backed</span>
      </div>
    </div>

  </div>

  {/* Floating Dream Elements */}
  <div className="dream-elements">
    <div className="floating-star star-1">✨</div>
    <div className="floating-star star-2">⭐</div>
    <div className="floating-star star-3">🌟</div>
  </div>
</section>
```

---

### 8. FOOTER

```jsx
<footer className="footer">
  <div className="container">
    
    {/* Footer Grid */}
    <div className="footer-grid">
      
      {/* Brand Column */}
      <div className="footer-brand">
        <Logo className="footer-logo" />
        <p className="footer-tagline">
          Where dreams come alive.
        </p>
        <div className="social-links">
          <a href="#" className="social-icon glass-icon">
            <Twitter />
          </a>
          <a href="#" className="social-icon glass-icon">
            <Instagram />
          </a>
          <a href="#" className="social-icon glass-icon">
            <LinkedIn />
          </a>
          <a href="#" className="social-icon glass-icon">
            <YouTube />
          </a>
        </div>
      </div>

      {/* Product Column */}
      <div className="footer-column">
        <h4 className="footer-heading">Product</h4>
        <ul className="footer-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#roadmap">Roadmap</a></li>
        </ul>
      </div>

      {/* Resources Column */}
      <div className="footer-column">
        <h4 className="footer-heading">Resources</h4>
        <ul className="footer-links">
          <li><a href="#blog">Blog</a></li>
          <li><a href="#science">The Science</a></li>
          <li><a href="#guides">Dream Guides</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#support">Support</a></li>
        </ul>
      </div>

      {/* Company Column */}
      <div className="footer-column">
        <h4 className="footer-heading">Company</h4>
        <ul className="footer-links">
          <li><a href="#about">About Us</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#press">Press Kit</a></li>
          <li><a href="#careers">Careers</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>

    </div>

    {/* Footer Bottom */}
    <div className="footer-bottom">
      <p className="copyright">
        Designed and developed with 💜 by DreamPulse Team © 2026
      </p>
      <div className="legal-links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#cookies">Cookie Policy</a>
      </div>
    </div>

  </div>
</footer>
```

---

## 🎬 ANIMATIONS & INTERACTIONS

### Scroll-Based Animations (Framer Motion)

```jsx
import { motion } from 'framer-motion';

// Fade In Up Animation
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
  viewport: { once: true, amount: 0.3 }
};

// Stagger Children
const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale In
const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

// Usage Example
<motion.div {...fadeInUp}>
  <h2>This fades in from below</h2>
</motion.div>

<motion.div {...staggerContainer}>
  {items.map((item, i) => (
    <motion.div key={i} {...fadeInUp}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects (CSS)

```css
/* Card Hover Lift */
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(212, 175, 55, 0.2);
}

/* Glow Effect on Hover */
.glow-button {
  position: relative;
  overflow: hidden;
}

.glow-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.4) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.glow-button:hover::before {
  width: 300px;
  height: 300px;
}

/* Shimmer Text */
@keyframes shimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

.shimmer-text {
  background: linear-gradient(
    90deg,
    var(--text-primary) 0%,
    var(--soft-gold) 50%,
    var(--text-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
```

### Micro-Interactions

```css
/* Button Ripple Effect */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  transform: scale(0);
  opacity: 0;
}

.btn-ripple:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.floating {
  animation: float 6s ease-in-out infinite;
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## 🌟 3D ELEMENTS (Three.js / React Three Fiber)

### Starfield Background

```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

function StarfieldBackground({ count = 5000 }) {
  const ref = useRef();
  
  // Generate random star positions
  const [positions] = useState(() => 
    random.inSphere(new Float32Array(count * 3), { radius: 1.5 })
  );

  // Rotate stars slowly
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Usage in Hero Section
<Canvas className="hero-canvas">
  <StarfieldBackground count={3000} />
  <ambientLight intensity={0.5} />
</Canvas>
```

### Floating Nebula

```jsx
function FloatingNebula() {
  const mesh = useRef();

  useFrame((state) => {
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -5]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        map={nebulaTexture}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
```

---

## 💎 GLASSMORPHISM EFFECTS

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
}

/* Glass Button */
.glass-button {
  background: rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--soft-gold);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
}
```

---

## 📱 RESPONSIVE DESIGN

```css
/* Mobile First Approach */

/* Base Styles (Mobile 375px+) */
.container {
  max-width: 100%;
  padding: 0 1rem;
}

.mega-title {
  font-size: var(--text-4xl); /* 36px */
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding: 0 2rem;
  }
  
  .mega-title {
    font-size: var(--text-5xl); /* 48px */
  }
  
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
  
  .mega-title {
    font-size: var(--text-6xl); /* 60px */
  }
  
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
  
  .mega-title {
    font-size: var(--text-7xl); /* 72px */
  }
}

/* Ultra Wide (1536px+) */
@media (min-width: 1536px) {
  .container-wide {
    max-width: 1400px;
  }
}
```

---

## 🎨 COMPLETE CSS ARCHITECTURE

```css
/* ========================================
   DREAMPULSE - GLOBAL STYLES
   ======================================== */

/* CSS Variables */
:root {
  /* Colors */
  --deep-indigo: #1a1a3e;
  --royal-purple: #6b5b95;
  --lavender: #9d84b7;
  --soft-gold: #d4af37;
  --midnight-blue: #0d0d1f;
  --teal-glow: #2d8b88;
  --cosmic-purple: #b19cd9;
  --text-primary: #f5f1e8;
  --text-secondary: #c5bfb3;
  --glass-bg: rgba(255,255,255,0.05);
  
  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-accent: 'Cinzel', serif;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-12: 6rem;
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.6s ease;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.2);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.3);
  --shadow-glow: 0 0 30px rgba(212,175,55,0.3);
}

/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  color: var(--text-primary);
  background: var(--deep-indigo);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.mega-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(
    135deg,
    var(--soft-gold),
    var(--lavender),
    var(--teal-glow)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shimmer 4s linear infinite;
}

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.section {
  padding: var(--space-12) 0;
  position: relative;
  overflow: hidden;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--soft-gold), #c29d2f);
  color: var(--midnight-blue);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 
    0 4px 16px rgba(212, 175, 55, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(212, 175, 55, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.btn-secondary {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

/* Glass Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}

/* Animations */
@keyframes shimmer {
  to { background-position: 200% center; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

/* Utility Classes */
.text-center { text-align: center; }
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.grid { display: grid; }
.relative { position: relative; }
.absolute { position: absolute; }
```

---

## 🚀 TECH STACK RECOMMENDATION

```json
{
  "frontend": {
    "framework": "Next.js 14 (App Router)",
    "ui": "React 18",
    "styling": "Tailwind CSS + Custom CSS",
    "animations": "Framer Motion",
    "3d": "React Three Fiber + Three.js",
    "icons": "Lucide React",
    "forms": "React Hook Form"
  },
  "deployment": {
    "hosting": "Vercel",
    "cdn": "Vercel Edge Network",
    "domain": "dreampulse.ai"
  },
  "performance": {
    "images": "Next/Image (auto optimization)",
    "fonts": "Next/Font (Google Fonts)",
    "analytics": "Vercel Analytics"
  }
}
```

---

## ✅ FINAL CURSOR PROMPT (COPY-PASTE READY)

```
I need you to build a visually stunning, interactive website for DreamPulse - an AI-driven lucid dreaming and sleep optimization app. The design should match the creative excellence of davidlangarica.dev but adapted for a dream/sleep/mystical theme.

DESIGN INSPIRATION:
- Reference site: https://www.davidlangarica.dev/
- Take inspiration from: smooth animations, 3D elements, glassmorphism, playful interactions
- Adapt the energy: dreamlike (not playful), hypnotic (not energetic), mystical (not tech-focused)

TECH STACK:
- Next.js 14 (App Router)
- React 18
- Tailwind CSS + Custom CSS
- Framer Motion (animations)
- React Three Fiber (3D starfield background)
- TypeScript

COLOR PALETTE:
- Primary: Deep Indigo (#1a1a3e)
- Secondary: Royal Purple (#6b5b95)
- Accent: Soft Gold (#d4af37)
- Highlight: Lavender (#9d84b7)
- Background: Midnight Blue (#0d0d1f)
- Text: Cream (#f5f1e8)

TYPOGRAPHY:
- Display: Playfair Display (headers)
- Body: Inter (paragraphs)
- Accent: Cinzel (special text)

SECTIONS TO BUILD:

1. HERO SECTION
   - Full viewport height
   - 3D starfield background (React Three Fiber)
   - Animated headline with gradient text
   - Typewriter effect on subheadline
   - Two CTA buttons (primary glow effect, secondary glass)
   - Scroll indicator with bounce animation
   - Floating particle elements

2. ABOUT/PROBLEM SECTION
   - Two-column layout (visual left, text right)
   - 3D animated element or video
   - Glassmorphism stat cards (300M+ sleep seekers, 43% lucid dreams, etc.)
   - Text reveals on scroll (Framer Motion)
   - Feature list with icons and stagger animation

3. HOW IT WORKS (4-PHASE JOURNEY)
   - Vertical timeline on desktop, horizontal scroll on mobile
   - Each phase has: number, title, description, features, illustration
   - Connecting line animates on scroll
   - Cards fade in with stagger effect
   - Lottie animations for each phase

4. FEATURES SHOWCASE (BENTO GRID)
   - Bento box layout (mixed sizes)
   - Glassmorphism cards
   - Video preview on large cards
   - Hover effects: lift, glow, scale
   - Feature categories: Stories, AI, Lucid Training, Community

5. TESTIMONIALS
   - Carousel of user testimonials
   - Glassmorphism cards with avatar, quote, rating
   - Stats bar below (4.9 rating, 87% improved sleep, etc.)
   - Auto-rotate with pause on hover

6. PRICING
   - Three tiers: Free, Premium Monthly, Premium Annual
   - Glassmorphism pricing cards
   - Featured card has glow effect and "Most Popular" badge
   - Checkmarks for included features, x for excluded
   - Money-back guarantee banner

7. CTA SECTION
   - Email capture form (glass input + glow button)
   - Secondary CTAs (Watch Demo, Read Science)
   - Trust indicators (Secure, iOS/Android, 4.9★, Science-Backed)
   - Floating star elements

8. FOOTER
   - Four columns: Brand, Product, Resources, Company
   - Social icons with glass effect
   - Copyright and legal links
   - Dark background with subtle gradient

ANIMATIONS & INTERACTIONS:
- Scroll-based animations (Framer Motion)
- Text reveals (fade in + slide up)
- Stagger animations on lists/grids
- Hover effects (card lift, glow intensify)
- Smooth page transitions
- Parallax scrolling on background elements
- Floating/pulsing animations
- Shimmer effect on gradient text

GLASSMORPHISM:
- Cards: rgba(255,255,255,0.05) background
- Backdrop filter: blur(20px)
- Border: 1px solid rgba(255,255,255,0.1)
- Shadow: 0 8px 32px rgba(0,0,0,0.3)

3D ELEMENTS:
- Starfield background (5000+ stars)
- Floating nebula clouds
- Particle system (fireflies/stardust)
- Slow rotation and movement

RESPONSIVE:
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly interactions
- Optimized for all devices

PERFORMANCE:
- Lazy load images
- Code splitting
- Optimized animations (60fps)
- Compressed assets
- Fast initial load (<2s)

ACCESSIBILITY:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Alt text on images
- Color contrast WCAG AA

Please generate the complete website with:
1. Full component structure
2. All animations implemented
3. Responsive design
4. Glassmorphism effects
5. 3D starfield background
6. Production-ready code
7. TypeScript types
8. Comments explaining key sections

The final result should feel like stepping into a dream - mystical, elegant, and completely immersive.
```

---

## 🎯 ADDITIONAL PROMPTS FOR SPECIFIC FEATURES

### Prompt for 3D Starfield:
```
Create a 3D starfield background using React Three Fiber for the hero section.

Requirements:
- 5000 star particles
- Slow rotation animation
- Mouse movement parallax (subtle)
- Stars of varying sizes (0.5px - 3px)
- Performance optimized (60fps)
- Depth of field effect (closer stars brighter)

Include:
- StarfieldBackground component
- Camera controls
- Particle shader for performance
- Responsive canvas sizing
```

### Prompt for Glassmorphism Components:
```
Create reusable glassmorphism components for DreamPulse:

1. GlassCard component
   - Props: children, hover effect (boolean), glow (boolean)
   - Backdrop blur: 20px
   - Border: subtle white 0.1 opacity
   - Shadow: deep

2. GlassButton component
   - Variants: primary, secondary, outline
   - Ripple effect on click
   - Glow on hover
   - Icon support

3. GlassInput component
   - For email capture
   - Focus state with glow
   - Placeholder animation

Include TypeScript types and accessibility features.
```

### Prompt for Scroll Animations:
```
Implement scroll-based animations using Framer Motion:

1. Fade in from below (default for all sections)
2. Stagger animation for lists/grids
3. Scale in for cards
4. Text reveal (line by line)
5. Progress bar animation
6. Counter animation for stats

Each animation should:
- Trigger when 30% in viewport
- Only animate once
- 0.6s duration
- Ease-out timing
- Mobile-optimized (reduced motion option)

Provide reusable animation variants and hook for scroll detection.
```

---

## 📦 ASSETS NEEDED

### Images:
- [ ] Hero background starfield (3840x2160px)
- [ ] Logo (SVG, transparent)
- [ ] Mode preview images (Journey, Sanctuary, Exploration, Clearing)
- [ ] User avatars (testimonials)
- [ ] App screenshots (iPhone, Android)

### Videos:
- [ ] Hero background loop (10-15s, optimized)
- [ ] Feature demo clips (20-30s each)
- [ ] App interface walkthrough

### 3D Assets:
- [ ] Starfield particle system
- [ ] Nebula textures
- [ ] Abstract dream shapes

### Animations:
- [ ] Lottie files for "How It Works" phases
- [ ] Icon animations (hover states)
- [ ] Loading spinner

### Fonts:
- [ ] Playfair Display (Google Fonts)
- [ ] Inter (Google Fonts)
- [ ] Cinzel (Google Fonts)

---

## 🎨 BRAND GUIDELINES

### Logo Usage:
- Primary: Full color on dark background
- Secondary: White version for light overlays
- Minimum size: 32px height
- Clear space: 1x logo height on all sides

### Voice & Tone:
- **Mystical** but not mystifying
- **Scientific** but not clinical
- **Aspirational** but not unrealistic
- **Intimate** but not intrusive
- Like a bedtime story narrator meets meditation guide

### Copy Style:
- Short sentences (12-20 words max)
- Active voice preferred
- Second person ("you") to create intimacy
- Vivid, sensory language
- Avoid: jargon, hype, medical claims

---

## ✅ LAUNCH CHECKLIST

Before going live:

- [ ] All images optimized (<200KB each)
- [ ] Videos compressed (<5MB, WebM + MP4)
- [ ] Fonts preloaded
- [ ] Meta tags complete (SEO)
- [ ] Open Graph images (social sharing)
- [ ] Favicon set (multiple sizes)
- [ ] Analytics installed
- [ ] Forms connected to backend
- [ ] 404 page designed
- [ ] Loading states implemented
- [ ] Error boundaries added
- [ ] Mobile tested (iOS + Android)
- [ ] Browser tested (Chrome, Safari, Firefox)
- [ ] Accessibility audit (Lighthouse)
- [ ] Performance audit (90+ score)
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Backup/version control setup

---

**This is your complete blueprint for creating a website as visually stunning as davidlangarica.dev, but perfectly tailored for DreamPulse's dream/sleep theme. Copy the main Cursor prompt and start building! 🚀✨**
