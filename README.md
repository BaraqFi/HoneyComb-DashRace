# Dash Race 🚗 – Web3 Game MVP

A fully on-chain, Solana-powered racing game MVP built with Next.js, Phaser, and Honeycomb Protocol.
Its a classic retro 3-lane obstacle dodging, coin-collecting race game.

Track your racing stats, earn your place on the leaderboard, and showcase your on-chain wallet profile!

## 📹 Video Walkthrough

[Google Drive](https://drive.google.com/file/d/1QBzPSqX8PN_f3JgovudqebJ24wSYZ6U2/view?usp=drivesdk)

---

## How Honeycomb Powers Dash Race

Dash Race is a web3 racing game fully integrated with the Honeycomb Protocol, providing seamless on-chain identity, persistent player stats, and a public leaderboard—all without managing your own backend.

Player Flow

Guest vs Registered Play:

You can play instantly as a guest (no wallet required), but stats won’t be saved.

To save your progress and appear on the leaderboard, connect your Solana wallet and register.

Onboarding:

When you click “Play Game” with your wallet connected, the app guides you through registration:

Username Entry: You choose your username.

User & Profile Creation: A Honeycomb user and profile are created, all on-chain and owned by your wallet.

(Future) Character Minting: You’ll mint a simple on-chain character (admin-assisted), tracked natively by Honeycomb.

(Future) Resources: “Fuel” (a non-fungible Honeycomb resource) is planned for missions and rewards.

Game Session & Stats:

After every race session, if you click “Save & Exit,” a modal pops up to let you save your stats (score and miles).

These stats are fetched from Honeycomb, summed with your latest session, and pushed back on-chain—ranking you on the leaderboard.

Leaderboard:

Leaderboard rankings are calculated from Honeycomb profile data—public, transparent, and live.

Missions & Idle Progression (Planned):

Beyond active gameplay, Honeycomb’s mission pools will allow players to send their characters on “idle” missions (e.g. spend Fuel to earn smaller, passive stats over time). DAO-driven missions will unlock unique NFTs with benefits.

All data (user, profile, character, resources, and mission progress) lives on-chain, managed by Honeycomb. No centralized servers—everything is verifiable, upgradable, and composable for future features.

---

## Features

* **Mobile-first racing gameplay:** 3-lane action, coins, obstacles, and rockets. Built with Phaser 3.
* **Web3 Wallet Integration:**

  * Connect with Phantom or Solflare using Solana Wallet Adapter.
* **Honeycomb Profiles:**

  * Onboarding flow creates your on-chain user/profile, stores username, links to your wallet.
  * Seamless auto-detection for returning users—no setup if you’ve played before.
* **Leaderboard:**

  * Fully on-chain, live ranks, powered by Honeycomb Protocol.
  * Top 10 players shown (sorted by score, then miles).
* **Stats Sync:**

  * Save your game stats (score, miles) after each race session.
  * All stats are **cumulative** and stored on-chain—no cheating!
* **Modern UI/UX:**

  * Modals for profile setup, game over/stats update.
  * Custom design, fully responsive, dark theme, smooth for mobile or desktop.

---

## How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/dashrace-hc.git
cd dashrace-hc
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` in the root folder:

```env
NEXT_PUBLIC_HONEYCOMB_PROJECT_ADDRESS=ABH6HW87Y5yJfwVnV432hTW9eFgYdgRRZvFMgiRhCmMb
NEXT_PUBLIC_HONEYCOMB_PROFILE_TREE=7kP3GWAiw4PPsRrZ7yQYA6ijpinhtt1UU8rW5tjBkzwr
```

Add any additional admin/project addresses as needed.

### 4. Start the local dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to play.

---

## Project Structure

* `app/` — Next.js app directory (routes, pages)
* `components/` — All React components (game, profile setup, modals, leaderboard)
* `public/` — Game asset images (car, coin, obstacle, missile, etc.)
* `utils/` — Honeycomb and Solana helpers

---

## Tech Stack

* **Frontend:** Next.js 13+, React
* **Game Engine:** Phaser 3 (integrated in React)
* **Solana:**

  * `@solana/web3.js`
  * `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`, `@solana/wallet-adapter-react-ui`
* **Honeycomb Protocol:**

  * `@honeycomb-protocol/edge-client`
* **Other:** `bs58`, TypeScript

---

## Security & Limitations

* Only your stats are saved on-chain; all gameplay is local/client-side.
* All wallet actions are user-approved (no auto-signing).
* Stats/leaderboard are public and open to all.
* No tokens or gambling involved—purely for fun and leaderboard glory!

---

## Admin/Project Addresses (for reference)

* **Project Address:** `ABH6HW87Y5yJfwVnV432hTW9eFgYdgRRZvFMgiRhCmMb`
* **Profiles Tree:** `7kP3GWAiw4PPsRrZ7yQYA6ijpinhtt1UU8rW5tjBkzwr`
* **Assembler Config:** `ATkZFWE7ZUc8AD5hLWrnVXzzKahWM3JAKJTtxQKvLrsR`
* **Character Model:** `GA8DoknQYGXas3eQv5FET9gduYiF4u3Vqppbj71qabEE`

---

## Author

* [BaraqFi](https://x.com/BaraqFi)
  Built for Honeycomb Protocol + Solana demo MVP.

---


## License

MIT License.
