# Weather Dashboard

A **high-end, luxurious dark-mode weather dashboard** with glassmorphism design, smooth Framer Motion animations, and real-time data from Open-Meteo API. Built with React, Express, TypeScript, Tailwind, and shadcn/ui.



## ✨ Features

- **Premium UI**: Glassmorphism cards, gradient text, Playfair Display temps, Geist metrics
- **Real Weather Data**: Open-Meteo API (temperature, feels-like, UV, wind, precipitation, etc.)
- **Location Search**: Debounced autocomplete + geolocation
- **Smooth Animations**: Staggered entrances, shimmers, micro-interactions (Framer Motion)
- **Error Resilience**: Custom error states with retry
- **Responsive**: Mobile-first grid (1-4 columns)
- **Type-Safe**: Full Zod validation across client/server
- **Dev/Prod Ready**: Vite HMR + Express static serve

## 🛠 Tech Stack

| Frontend | Backend | Styling | Data/State |
|----------|---------|---------|------------|
| React 18, Vite, TS | Express 5, TS | Tailwind, shadcn/ui | TanStack Query, Zod |
| Framer Motion | Drizzle ORM (PG) | clsx, tw-merge | Wouter routing |
| Lucide React | Passport.js auth | Custom fonts | Shared schemas |

## 🚀 Quick Start

```bash
# Clone & Install
git clone <repo> && cd Weather-Display
npm install

# Development (API + Client HMR)
npm run dev

# Build & Production
npm run build
npm start
```

**Runs on port 5000** (publicly accessible).

### Scripts
```bash
npm run dev     # Dev server (Express + Vite)
npm run build   # Production build
npm run start   # Production server
npm run check   # TypeScript check
npm run db:push # Drizzle migrations
```

## 📁 Project Structure

```
├── client/              # Vite React app
│   ├── src/pages/dashboard.tsx     # Main UI
│   ├── src/hooks/use-weather.ts    # API queries
│   └── src/components/weather-*.tsx # Nav, Skeleton, Error
├── server/              # Express API
│   └── routes.ts        # /api/weather, /api/weather/search
├── shared/              # API contracts (Zod schemas)
└── package.json         # Monorepo deps
```

## 🌤️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/weather?lat=40.7&lon=-74&location=NYC` | Current weather |
| `GET` | `/api/weather/search?q=London` | Location search |

**simulateFail=true** for error demo.

## 🎨 Customization

### Fonts (tailwind.config.ts)
```ts
fontFamily: {
  sans: ["Geist", "sans-serif"],
  display: ["Playfair Display", "serif"],
}
```

### Colors & Glassmorphism
- `glass-panel`: `backdrop-blur`, `bg-white/5`, `border-white/10`
- Hover states: Scale + glow
- Gradients: `text-gradient`, shimmer animations

## 📱 Demo Features

1. **Hero Display**: Giant temperature with weather icon
2. **8 Detail Cards**: Humidity, Wind, Visibility, Pressure, Clouds, Precip, Dew Point, UV
3. **Search**: Live location autocomplete
4. **Geolocation**: Auto-detect + reverse geocode
5. **States**: Loading shimmer → Success stagger → Error glow

## 🔮 Extensibility

- **Charts**: Recharts ready
- **Auth**: Passport + sessions
- **PWA**: Vite plugins
- **Database**: Drizzle + PostgreSQL

## 🤝 Contributing

1. Fork & PR
2. `npm run check` before push
3. Update docs for new features

## 📄 License

MIT - Use freely!

---

**Built with ❤️ for atmospheric enthusiasts**
