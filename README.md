
# 🚦 K53 Academy

**Master the Road.**

Gamified K53 Learner's & Driver's Licence preparation for South Africa.

[![Live Site](https://img.shields.io/badge/live-k53academy.netlify.app-E4002B?style=for-the-badge)](https://k53academy.netlify.app)
[![Netlify Status](https://img.shields.io/badge/deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://k53academy.netlify.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## About

Most K53 study material in South Africa is a PDF or a wall of multiple-choice questions. It works, but nobody finishes it.

K53 Academy takes the same syllabus and wraps it in the mechanics that actually keep people coming back — **rooms**, **learning paths**, **XP**, and **streaks**. You don't grind through a textbook; you clear rooms and watch your progress bar move.

Built for learners preparing for **Code 1 (motorcycle)**, **Code 2 (light motor vehicle)** and **Code 3 (heavy motor vehicle)** tests.

---

## Features

| | |
|---|---|
| 🏠 **Study Rooms** | Topic-based modules — Rules of the Road, Road Signs, Vehicle Controls, Signals & Markings |
| 🛣️ **Learning Paths** | Guided routes through the syllabus so you always know what's next |
| ⚡ **XP System** | Earn experience for every completed room and correct answer |
| 🔥 **Streaks** | Daily consistency tracking — the thing that actually gets people to pass |
| 📝 **Mock Tests** | Full-length practice exams modelled on the real test format |
| 🚗 **Code 1 / 2 / 3** | Separate tracks for motorcycle, light and heavy vehicle licences |
| 📱 **Installable PWA** | Add to home screen, works like a native app on iOS and Android |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with CSS-variable design tokens (light and dark)
- **State:** Zustand, persisted to the browser (accounts and progress are device-local)
- **Motion & charts:** Framer Motion, Recharts
- **Road signs:** official SADC / SARTSM artwork, public domain (see `public/signs/SOURCE.md`)
- **Hosting:** Netlify

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/Junyadoingthings/K53-Academy.git
cd K53-Academy

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5300](http://localhost:5300) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
K53-Academy/
├── app/               # Routes: landing, auth, dashboard pages, API
├── components/        # UI primitives, layout, quiz engine, signs, gamification
├── lib/
│   ├── data/          # Rooms, paths, questions, signs (+ generated sign questions)
│   ├── store.ts       # XP, streaks, progress (Zustand)
│   └── auth-store.ts  # Device-local accounts
├── public/signs/      # 104 SADC road sign SVGs (public domain)
└── tailwind.config.ts # Design tokens
```

---

## Roadmap

- [ ] Curated video resources per room
- [ ] Offline mode for full syllabus access without data
- [ ] Progress sync across devices
- [ ] Afrikaans and isiZulu language support
- [ ] Timed exam simulation with official pass thresholds
- [ ] Weak-area detection and targeted revision

---

## Contributing

Contributions are welcome — especially question-bank corrections and translations. Sign names and meanings live in `lib/data/signs.ts`; every sign automatically gets a practice question.

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

If you're reporting an incorrect answer or outdated regulation, please open an issue and include a source.

---

## Disclaimer

K53 Academy is an **independent study tool**. It is not affiliated with, endorsed by, or connected to the Road Traffic Management Corporation (RTMC), the Department of Transport, or any South African government entity.

All study content is original and written to cover the same road traffic regulations assessed in the official test. It does not reproduce any copyrighted K53 publication.

Passing this app's mock tests does not guarantee passing the official learner's or driver's licence test. Always confirm current requirements with your local licensing department.

---

## Licence

Distributed under the MIT Licence. See [`LICENSE`](LICENSE) for details.

---

## Contact

**Junya** — JUNYA WEB

Live site: [k53academy.netlify.app](https://k53academy.netlify.app)

<div align="center">
<br>
<sub>Built in Springs, Gauteng 🇿🇦</sub>
</div>
