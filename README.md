# Uangku - Personal Finance Tracker

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Uangku** is a lightweight, no-frills personal finance tracker built to log daily income and expenses in seconds. Designed around a student's everyday spending habits — from campus needs to coffee runs — every transaction is synced live to a Supabase database, so nothing gets lost when the browser cache is cleared.

**Live Demo:** [uangku-app-dusky.vercel.app](https://uangku-app-dusky.vercel.app/)

## Key Features

- 📝 **Quick Logging:** Add an income or expense entry in seconds with title, amount, type, and category.
- 🏷️ **Student-Friendly Categories:** Preset categories like `Kebutuhan Kuliah`, `Kopi & Warkop`, `Top-up & Game`, and `Trading & Investasi` ready out of the box.
- 🔍 **Instant Search:** Filter transaction history in real time by title or category.
- ☁️ **Cloud-Synced Data:** Every transaction is persisted in Supabase (Postgres), not just local browser storage.
- ⚡ **Fast & Minimal:** Built on React 19 + Vite for near-instant load times and a clean, distraction-free interface.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) & npm
- A free [Supabase](https://supabase.com/) project

### 1. Database Setup

1. Create a new Supabase project.
2. Inside the SQL editor (or Table Editor), create a `transactions` table with the following columns:

   | Column       | Type        | Notes                          |
   |--------------|-------------|---------------------------------|
   | `id`         | int8 (PK)   | auto increment                  |
   | `created_at` | timestamptz | default `now()`                 |
   | `title`      | text        | transaction note/title          |
   | `amount`     | int8        | transaction amount              |
   | `type`       | text        | `pemasukan` or `pengeluaran`    |
   | `category`   | text        | transaction category            |

3. Copy your **Project URL** and **anon public key** from `Project Settings → API`.

### 2. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/BGS06/uangku-app.git
cd uangku-app

# Install dependencies
npm install

# Configure environment variables
# create a .env file in the root, then add:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run the development server
npm run dev
```

The app will start at `http://localhost:5173`.

### 3. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
uangku-app/
├── public/                # Static assets (favicon, icons)
├── src/
│   ├── assets/             # Images and other assets
│   ├── App.jsx               # Main application component
│   ├── App.css                # Component styling
│   ├── index.css                # Global styling
│   ├── main.jsx                   # React entry point
│   └── supabaseClient.js           # Supabase connection config
├── index.html
├── package.json
└── vite.config.js
```

## Roadmap

- [ ] User authentication (login/register)
- [ ] Balance summary & spending charts by category
- [ ] Filter transactions by date/month
- [ ] Edit & delete transactions
- [ ] Dark mode

## Author

**Bagas Bintang Saputro**

Undergraduate Informatics Student at Telkom University

GitHub: [https://github.com/BGS06](https://github.com/BGS06)
