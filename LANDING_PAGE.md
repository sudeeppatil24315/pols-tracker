# Landing Page Features

## 🎨 Design Elements

### 3D Animation (Three.js)
- **Animated Sphere**: Distorting golden sphere with metallic material
- **Truck Model**: 3D truck representation with rotating animation
- **Particle System**: 500 floating particles creating a dynamic background
- **Auto-Rotation**: Smooth orbital camera movement

### Smooth Transitions (Framer Motion)
- **Fade-in animations** for all sections
- **Scroll-triggered animations** with viewport detection
- **Hover effects** on buttons and cards
- **Scale animations** on interactive elements
- **Staggered animations** for feature cards

## 📐 Sections

### 1. Hero Section
- Full-screen immersive experience
- 3D background with overlay gradient
- Animated chicken emoji logo
- Gradient text effect on title
- Two CTA buttons:
  - "Get Started" (primary)
  - "Watch Demo" (secondary)
- Animated scroll indicator

### 2. Features Section
- Three feature cards with:
  - Gradient backgrounds
  - Hover glow effects
  - Icon animations
  - Smooth transitions
- Features highlighted:
  - Real-Time Tracking
  - Smart ETA Predictions
  - Cargo Monitoring

### 3. Stats Section
- Four key metrics:
  - 99.9% Uptime
  - 500+ Deliveries/Day
  - 50+ Active Drivers
  - 24/7 Support
- Scale-in animations
- Yellow accent background

### 4. CTA Section
- Final call-to-action
- Large "Start Tracking Now" button
- Centered layout

### 5. Footer
- Copyright information
- Brand tagline

## 🎯 User Flow

1. **First Visit**: Landing page displays automatically
2. **Skip Option**: "Skip to Login" button in top-right
3. **Get Started**: Clicking CTA saves preference and shows login
4. **Return Visits**: Landing page skipped (localStorage check)

## 🔧 Technical Implementation

### Dependencies
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `framer-motion` - Animation library

### Components
- `LandingPage.tsx` - Main landing page component
- `Scene3D.tsx` - Three.js 3D scene with:
  - AnimatedSphere
  - TruckModel
  - Particles
  - OrbitControls

### Animations
- **Entrance**: Fade-in with upward motion
- **Scroll**: Viewport-triggered animations
- **Hover**: Scale and glow effects
- **Continuous**: Rotating 3D elements

### Performance
- Memoized particle geometry
- Optimized render loop
- Lazy component loading
- Efficient state management

## 🎨 Color Scheme

- **Primary**: #F9D71C (Los Pollos Yellow)
- **Background**: #0F0F0F (Deep Black)
- **Accent**: Gradients from blue, purple, green
- **Text**: White with gray variations

## 📱 Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Responsive text sizes
- Touch-friendly buttons
- Optimized 3D performance

## 🚀 Getting Started

The landing page automatically shows on first visit. To reset:

```javascript
// In browser console
localStorage.removeItem('hasVisitedLosPollos');
```

Then refresh the page to see the landing page again.

## 🎬 Animation Timeline

1. **0s**: Page loads, 3D scene initializes
2. **0.3s**: Skip button fades in
3. **0.5s**: Hero content fades in
4. **1s**: Scroll indicator starts bouncing
5. **On Scroll**: Feature cards animate in sequence
6. **On Scroll**: Stats scale in with stagger
7. **Continuous**: 3D elements rotate and float

## 💡 Customization

### Change Colors
Edit the gradient colors in `LandingPage.tsx`:
```typescript
const features = [
  {
    color: 'from-blue-500 to-cyan-500', // Change these
    // ...
  }
];
```

### Adjust 3D Scene
Modify `Scene3D.tsx`:
- Sphere distortion: `distort={0.4}`
- Particle count: `const count = 500`
- Animation speed: `autoRotateSpeed={0.5}`

### Animation Timing
Update Framer Motion props:
```typescript
transition={{ duration: 0.8, delay: 0.2 }}
```
